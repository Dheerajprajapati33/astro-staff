// components/call/CallRequestProvider.js
// Mounted in app/_layout.js alongside ChatRequestProvider.
// Manages incoming voice call alerts and accept/decline flows for the Astrologer.
// Follows Section B (Steps 1-3) of the Voice & Video Call Consultation Guide.

import { useEffect, useRef, useState } from "react";
import { router, useSegments } from "expo-router";

import IncomingCallModal from "./IncomingCallModal";
import { getStoredUser } from "../../utils/auth";
import { connectSocket, emitEvent, getSocket } from "../../utils/socket";
import useIncomingRequestRingtone from "../../hooks/useIncomingRequestRingtone";

const LOG_TAG = "[CallRequestProvider]";

export default function CallRequestProvider({ children }) {
  const segments = useSegments();
  const [incomingCall, setIncomingCall] = useState(null);
  const listenerAttachedRef = useRef(false);
  const dismissedIdsRef = useRef(new Set());

  useIncomingRequestRingtone(!!incomingCall);

  useEffect(() => {
    let isMounted = true;

    const setupCallSocket = async () => {
      const user = await getStoredUser();

      if (!user?.token) {
        console.log(LOG_TAG, "No token found, skipping call socket setup");
        return;
      }

      let socket = getSocket();
      if (!socket?.connected) {
        socket = await connectSocket(user.token);
      }

      if (listenerAttachedRef.current) return;
      listenerAttachedRef.current = true;

      const handleIncomingCall = (data) => {
        console.log(
          LOG_TAG,
          "Incoming call socket event received:",
          JSON.stringify(data),
        );

        if (!data) return;

        // Agar unified incoming_consultation_request hai aur chat hai, toh ignore karein
        const type = data.consultationType || data.type || "call";
        if (type !== "call" && type !== "CALL" && type !== "voice" && type !== "video") return;

        const consultationId = data.consultationId || data.id;
        if (!consultationId || dismissedIdsRef.current.has(consultationId)) return;

        // Agar astrologer live broadcast ya kisi call/chat screen par hai toh incoming call popup na dikhaye
        const isBusyOnScreen = segments.some(
          (s) => s === "golive" || s === "call" || s === "chat",
        );
        if (isBusyOnScreen) return;

        if (isMounted) {
          setIncomingCall({
            consultationId,
            userId: data?.userId,
            userName: data?.userName || data?.user?.name || "Client",
            problem: data?.problem || "Voice Call Consultation",
            maxDurationSeconds: data?.maxDurationSeconds || data?.maxDuration || 1500,
          });
        }
      };

      // Listen for socket push events
      socket.on("incoming_call_request", handleIncomingCall);
      socket.on("incoming_consultation_request", handleIncomingCall);
    };

    setupCallSocket();

    return () => {
      isMounted = false;
    };
  }, [segments]);

  const handleAccept = () => {
    if (!incomingCall) return;

    const { consultationId, userId, userName, problem, maxDurationSeconds } =
      incomingCall;

    console.log(LOG_TAG, "Astrologer accepted call:", consultationId);

    // Step 3: Astrologer Accepts Call via Socket
    emitEvent("astrologer_accept_call", { consultationId });
    emitEvent("accept_call_session", { consultationId });
    emitEvent("accept_consultation", { consultationId });

    dismissedIdsRef.current.add(consultationId);
    setIncomingCall(null);

    router.push({
      pathname: "/call",
      params: {
        consultationId,
        userId,
        userName,
        problem,
        maxDurationSeconds,
      },
    });
  };

  const handleDecline = () => {
    console.log(
      LOG_TAG,
      "Astrologer declined call:",
      incomingCall?.consultationId,
    );
    if (incomingCall?.consultationId) {
      dismissedIdsRef.current.add(incomingCall.consultationId);
    }
    setIncomingCall(null);
  };

  return (
    <>
      {children}
      <IncomingCallModal
        request={incomingCall}
        onAccept={handleAccept}
        onDecline={handleDecline}
      />
    </>
  );
}
