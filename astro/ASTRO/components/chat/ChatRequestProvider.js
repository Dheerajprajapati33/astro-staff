// components/chat/ChatRequestProvider.js
// Mounted once in app/_layout.js. Keeps the astrologer's socket connected
// app-wide (after login) and shows the incoming chat request popup on top
// of whichever screen is currently active. See guide Section B, Steps 1-3.
//
// IMPORTANT (verified live against the backend on 2026-08-12 via a
// socket.io probe): a socket that connects and starts listening BEFORE a
// consultation is created receives NOTHING when that consultation is
// created - no "incoming_chat_request" event, no event of any kind. The
// listener below for "incoming_chat_request" is therefore known to never
// fire against the current backend; it's kept only as a passive safety net
// in case the backend adds this push later (see onAny tap below, which will
// log the real event name immediately if/when the backend starts sending one).
//
// The only confirmed-working way to discover a pending chat request today is
// polling GET /consultation/history?status=waiting&type=chat (confirmed live:
// the backend accepts and returns that filter). That's what actually drives
// the popup below.

import { useEffect, useRef, useState } from "react";
import { router, useSegments } from "expo-router";

import IncomingChatModal from "./IncomingChatModal";
import { getStoredUser } from "../../utils/auth";
import { connectSocket, emitEvent, getSocket } from "../../utils/socket";
import useIncomingRequestRingtone from "../../hooks/useIncomingRequestRingtone";

const LOG_TAG = "[ChatRequestProvider]";

export default function ChatRequestProvider({ children }) {
  const segments = useSegments();
  const [incomingRequest, setIncomingRequest] = useState(null);
  const listenerAttachedRef = useRef(false);
  const dismissedIdsRef = useRef(new Set());

  useIncomingRequestRingtone(!!incomingRequest);

  useEffect(() => {
    let isMounted = true;

    const setupChatSocket = async () => {
      const user = await getStoredUser();

      if (!user?.token) {
        console.log(LOG_TAG, "No token found, skipping chat socket setup");
        return;
      }

      let socket = getSocket();
      if (!socket?.connected) {
        socket = await connectSocket(user.token);
      }

      if (listenerAttachedRef.current) return;
      listenerAttachedRef.current = true;

      const handleIncomingChat = (data) => {
        console.log(
          LOG_TAG,
          "Incoming chat socket event received:",
          JSON.stringify(data),
        );

        if (!data) return;

        // Agar unified incoming_consultation_request hai aur call hai, toh ignore karein
        const type = data.consultationType || data.type || "chat";
        if (type !== "chat" && type !== "CHAT") return;

        const consultationId = data.consultationId || data.id;
        if (!consultationId || dismissedIdsRef.current.has(consultationId)) return;

        // Agar astrologer live broadcast ya call/chat screen par hai toh popup na dikhaye
        const isBusyOnScreen = segments.some(
          (s) => s === "golive" || s === "call" || s === "chat",
        );
        if (isBusyOnScreen) return;

        if (isMounted) {
          setIncomingRequest({
            consultationId,
            roomId: data.roomId || consultationId,
            userId: data.userId,
            userName: data.userName || data?.user?.name || "Client",
            birthDetails:
              data.birthDetails ||
              data.clientBirthDetails ||
              data?.user?.birthDetails ||
              null,
            gender: data?.gender || data?.user?.gender,
            dob: data?.dob || data?.user?.dob,
            tob: data?.tob || data?.user?.tob,
            pob:
              data?.pob ||
              data?.birthPlace ||
              data?.user?.pob ||
              data?.user?.birthPlace ||
              data?.user?.city,
            lat: data?.lat || data?.user?.lat,
            lon: data?.lon || data?.user?.lon,
            timezone: data?.timezone || data?.user?.timezone,
            problem: data.problem || "Chat Consultation",
            maxDurationSeconds: data.maxDurationSeconds || data.maxDuration || 900,
          });
        }
      };

      // Listen for both unified event and specific chat event
      socket.on("incoming_chat_request", handleIncomingChat);
      socket.on("incoming_consultation_request", handleIncomingChat);
    };

    setupChatSocket();

    return () => {
      isMounted = false;
    };
  }, [segments]);

  const handleAccept = () => {
    if (!incomingRequest) return;

    const {
      consultationId,
      roomId,
      userId,
      userName,
      gender,
      dob,
      tob,
      pob,
      lat,
      lon,
      timezone,
      birthDetails,
      problem,
      maxDurationSeconds,
    } = incomingRequest;

    console.log(LOG_TAG, "REQUEST ACCEPTED:", JSON.stringify(incomingRequest));

    emitEvent("accept_chat_session", { consultationId });

    dismissedIdsRef.current.add(consultationId);
    setIncomingRequest(null);

    router.push({
      pathname: "/chat",
      params: {
        consultationId,
        roomId: roomId || consultationId,
        userId,
        name: userName,
        gender,
        dob,
        tob,
        pob,
        lat,
        lon,
        timezone,
        birthDetails:
          typeof birthDetails === "object"
            ? JSON.stringify(birthDetails)
            : birthDetails,
        problem,
        maxDurationSeconds,
      },
    });
  };

  const handleDecline = () => {
    console.log(LOG_TAG, "REQUEST DECLINED:", JSON.stringify(incomingRequest));

    if (incomingRequest?.consultationId) {
      dismissedIdsRef.current.add(incomingRequest.consultationId);
    }

    setIncomingRequest(null);
  };

  return (
    <>
      {children}

      <IncomingChatModal
        request={incomingRequest}
        onAccept={handleAccept}
        onDecline={handleDecline}
      />
    </>
  );
}
