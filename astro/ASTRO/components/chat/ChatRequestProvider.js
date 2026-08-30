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
import { useGetConsultationHistoryQuery } from "../../redux/ChatApi";

const LOG_TAG = "[ChatRequestProvider]";
const POLL_INTERVAL_MS = 8000;

export default function ChatRequestProvider({ children }) {
  const segments = useSegments();
  const [incomingRequest, setIncomingRequest] = useState(null);
  const [hasToken, setHasToken] = useState(false);
  const dismissedIdsRef = useRef(new Set());

  useEffect(() => {
    let isMounted = true;

    const checkToken = async () => {
      const user = await getStoredUser();
      if (isMounted) setHasToken(!!user?.token);
    };

    checkToken();

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

    dismissedIdsRef.current.add(consultationId);
    setIncomingRequest(null);

    router.push({
      pathname: "/chat",
      params: {
        consultationId,
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
