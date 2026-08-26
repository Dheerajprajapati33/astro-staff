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
import { useGetConsultationHistoryQuery } from "../../redux/ChatApi";

const LOG_TAG = "[ChatRequestProvider]";
const POLL_INTERVAL_MS = 8000;

export default function ChatRequestProvider({ children }) {
  const segments = useSegments();
  const [incomingRequest, setIncomingRequest] = useState(null);
  const [hasToken, setHasToken] = useState(false);
  const listenerAttachedRef = useRef(false);
  const dismissedIdsRef = useRef(new Set());

  useEffect(() => {
    let isMounted = true;

    const setupChatSocket = async () => {
      const user = await getStoredUser();

      if (isMounted) setHasToken(!!user?.token);

      if (!user?.token) {
        console.log(LOG_TAG, "NO TOKEN YET, SKIPPING SOCKET SETUP");
        return;
      }

      let socket = getSocket();

      if (!socket?.connected) {
        socket = await connectSocket(user.token);
      }

      if (listenerAttachedRef.current) return;
      listenerAttachedRef.current = true;

      // Debug tap: logs every event the socket ever receives, tagged so it's
      // easy to grep. Use this to confirm the real event name live if the
      // backend starts pushing incoming-request notifications.
      socket.onAny((eventName, ...args) => {
        console.log(LOG_TAG, "onAny ->", eventName, JSON.stringify(args));
      });

      // Kept as a passive safety net - not confirmed to ever fire, see note above.
      socket.on("incoming_chat_request", (data) => {
        console.log(LOG_TAG, "incoming_chat_request RECEIVED:", JSON.stringify(data));

        if (isMounted) {
          setIncomingRequest({
            consultationId: data?.consultationId,
            roomId: data?.roomId,
            userId: data?.userId,
            userName: data?.userName,
            problem: data?.problem,
            maxDurationSeconds: data?.maxDurationSeconds,
          });
        }
      });

      console.log(LOG_TAG, "socket listeners attached (onAny + incoming_chat_request)");
    };

    setupChatSocket();

    return () => {
      isMounted = false;
    };
  }, [segments]);

  // Working fallback: poll for "waiting" chat consultations since no live
  // push event has been confirmed. See file header note.
  // NOTE: the backend's `type` query param on /consultation/history 500s
  // (confirmed live: "Unknown column 'Consultation.type' in 'where clause'"
  // - the DB column is actually `consultationType`). Only pass `status`,
  // which is confirmed working, and filter to chat consultations ourselves.
  const { data: waitingData, error: waitingError } = useGetConsultationHistoryQuery(
    { page: 1, limit: 10, status: "waiting" },
    { pollingInterval: POLL_INTERVAL_MS, skip: !hasToken },
  );

  useEffect(() => {
    if (waitingError) {
      console.log(LOG_TAG, "waiting-requests poll error:", JSON.stringify(waitingError));
      return;
    }

    const waitingList = (waitingData?.consultations ?? []).filter(
      (c) => c.consultationType === "chat",
    );

    console.log(LOG_TAG, "waiting-requests poll result count:", waitingList.length);

    if (incomingRequest) return; // already showing one, don't interrupt

    const next = waitingList.find((c) => !dismissedIdsRef.current.has(c.id));

    if (next) {
      console.log(LOG_TAG, "surfacing waiting consultation as incoming request:", next.id);

      setIncomingRequest({
        consultationId: next.id,
        roomId: next.id,
        userId: next.userId,
        userName: next?.user?.name || "Client",
        problem: next.problem,
        maxDurationSeconds: next.maxDuration,
      });
    }
  }, [waitingData, waitingError, incomingRequest]);

  const handleAccept = () => {
    if (!incomingRequest) return;

    const {
      consultationId,
      roomId,
      userId,
      userName,
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
        // No distinct chat-room id has ever been observed from the backend
        // for this flow (confirmed live) - roomId falls back to consultationId.
        roomId: roomId || consultationId,
        userId,
        name: userName,
        problem,
        maxDurationSeconds,
      },
    });
  };

  const handleDecline = () => {
    console.log(
      LOG_TAG,
      "REQUEST DECLINED:",
      JSON.stringify(incomingRequest),
    );

    if (incomingRequest?.consultationId) {
      try {
        emitEvent("reject_chat_session", {
          consultationId: incomingRequest.consultationId,
          reason: "declined_by_astrologer",
        });

        emitEvent("end_chat_session", {
          consultationId: incomingRequest.consultationId,
          reason: "declined",
        });
      } catch (e) {
        console.log(LOG_TAG, "Error emitting decline events:", e);
      }

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
