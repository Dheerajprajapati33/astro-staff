// components/call/CallRequestProvider.js
// Mounted in app/_layout.js alongside ChatRequestProvider.
// Manages incoming voice call alerts and accept/decline flows for the Astrologer.
// Follows Section B (Steps 1-3) of the Voice & Video Call Consultation Guide.

import { useEffect, useRef, useState } from "react";
import { router, useSegments } from "expo-router";

import IncomingCallModal from "./IncomingCallModal";
import { getStoredUser } from "../../utils/auth";
import { connectSocket, emitEvent, getSocket } from "../../utils/socket";
import { useGetConsultationHistoryQuery } from "../../redux/ChatApi";

const LOG_TAG = "[CallRequestProvider]";
const POLL_INTERVAL_MS = 6000;

export default function CallRequestProvider({ children }) {
  const segments = useSegments();
  const [incomingCall, setIncomingCall] = useState(null);
  const [hasToken, setHasToken] = useState(false);
  const listenerAttachedRef = useRef(false);
  const dismissedIdsRef = useRef(new Set());

  useEffect(() => {
    let isMounted = true;

    const setupCallSocket = async () => {
      const user = await getStoredUser();

      if (isMounted) setHasToken(!!user?.token);

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

      // Listen for socket push event if pushed directly from backend
      socket.on("incoming_call_request", (data) => {
        console.log(
          LOG_TAG,
          "incoming_call_request RECEIVED:",
          JSON.stringify(data),
        );
        if (isMounted) {
          setIncomingCall({
            consultationId: data?.consultationId,
            userId: data?.userId,
            userName: data?.userName || "Client",
            problem: data?.problem || "Voice Call Consultation",
            maxDurationSeconds: data?.maxDurationSeconds || 1500,
          });
        }
      });
    };

    setupCallSocket();

    return () => {
      isMounted = false;
    };
  }, [segments]);

  // Working fallback: poll waiting consultations filtered by consultationType === "call"
  const { data: waitingData, error: waitingError } =
    useGetConsultationHistoryQuery(
      { page: 1, limit: 10, status: "waiting" },
      { pollingInterval: POLL_INTERVAL_MS, skip: !hasToken },
    );

  useEffect(() => {
    if (waitingError) return;

    const waitingCalls = (waitingData?.consultations ?? []).filter(
      (c) => c.consultationType === "call",
    );

    if (incomingCall) return; // already showing incoming call

    const nextCall = waitingCalls.find(
      (c) => !dismissedIdsRef.current.has(c.id),
    );

    if (nextCall) {
      console.log(LOG_TAG, "Surfacing incoming call request:", nextCall.id);
      setIncomingCall({
        consultationId: nextCall.id,
        userId: nextCall.userId,
        userName: nextCall?.user?.name || "Client",
        problem: nextCall.problem || "Voice Call Consultation",
        maxDurationSeconds: nextCall.maxDuration || 1500,
      });
    }
  }, [waitingData, waitingError, incomingCall]);

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
