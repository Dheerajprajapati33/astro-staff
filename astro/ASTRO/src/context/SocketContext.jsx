import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { io } from "socket.io-client";
import { router, useSegments } from "expo-router";

import { SOCKET_URL } from "../../config/api";
import { getStoredUser } from "../../utils/auth";
import {
  emitEvent,
  setConnectionStatus,
  setSocket as setGlobalSocket,
} from "../../utils/socket";
import useIncomingRequestRingtone from "../../hooks/useIncomingRequestRingtone";
import IncomingCallModal from "../../components/call/IncomingCallModal";
import IncomingChatModal from "../../components/chat/IncomingChatModal";

const SocketContext = createContext();
const LOG_TAG = "[SocketContext]";

export const SocketProvider = ({ children, authToken: propAuthToken }) => {
  const segments = useSegments();
  const segmentsRef = useRef(segments);
  segmentsRef.current = segments;

  const [socket, setSocket] = useState(null);
  const [token, setToken] = useState(propAuthToken || null);
  const [incomingRequest, setIncomingRequest] = useState(null);
  const dismissedIdsRef = useRef(new Set());

  // Ringtone for incoming call/chat
  useIncomingRequestRingtone(!!incomingRequest);

  // 1. Fetch token from AsyncStorage if not passed directly via props
  useEffect(() => {
    if (propAuthToken) {
      setToken(propAuthToken);
      return;
    }

    let isMounted = true;
    const fetchToken = async () => {
      try {
        const stored = await getStoredUser();
        if (isMounted && stored?.token) {
          setToken(stored.token);
        }
      } catch (err) {
        console.warn(LOG_TAG, "Error reading stored token:", err);
      }
    };

    fetchToken();
    return () => {
      isMounted = false;
    };
  }, [propAuthToken]);

  // 2. Socket Connection & Event Listeners
  useEffect(() => {
    if (!token) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
        setGlobalSocket(null);
        setConnectionStatus("disconnected");
      }
      return;
    }

    const cleanToken = token.startsWith("Bearer ") ? token.slice(7) : token;
    const bearerToken = token.startsWith("Bearer ") ? token : `Bearer ${token}`;

    console.log(LOG_TAG, "Connecting socket to", SOCKET_URL);
    setConnectionStatus("connecting");

    // Authenticated Socket Connection
    const newSocket = io(SOCKET_URL, {
      auth: {
        token: cleanToken,
        authorization: bearerToken,
      },
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 2000,
    });

    newSocket.on("connect", () => {
      console.log("🔌 [Socket Connected] ID:", newSocket.id);
      setConnectionStatus("connected");
    });

    newSocket.on("disconnect", (reason) => {
      console.log("🔌 [Socket Disconnected] Reason:", reason);
      setConnectionStatus("disconnected");
    });

    newSocket.on("connect_error", (err) => {
      console.log(LOG_TAG, "Socket connect_error:", err?.message || err);
      setConnectionStatus("disconnected");
    });

    // -------------------------------------------------------------
    // 📞 EVENT 1: INCOMING CALL (Voice / Video Call Request)
    // -------------------------------------------------------------
    const handleIncomingCall = (data) => {
      console.log("📞 Incoming Call Request:", data);
      if (!data) return;

      const consultationId = data.consultationId || data.id;
      if (!consultationId || dismissedIdsRef.current.has(consultationId)) return;

      // Don't show popup if astrologer is already on a call, live, or chat screen
      const currentSegments = segmentsRef.current || [];
      const isBusyOnScreen = currentSegments.some(
        (s) => s === "golive" || s === "call" || s === "chat"
      );
      if (isBusyOnScreen) return;

      setIncomingRequest({
        type: "call",
        consultationId,
        user: data.user || {
          id: data.userId,
          name: data.userName || "Client",
          phone: data.phone,
          profilePic: data.profilePic,
        },
        userName: data.userName || data.user?.name || "Client",
        channelName: data.channelName,
        token: data.token, // Astrologer Agora RTC Token
        uid: data.uid || 2,
        userId: data.userId || data.user?.id || data.user?._id,
        problem: data.problem || "Voice Call Consultation",
        maxDurationSeconds: data.maxDurationSeconds || data.maxDuration || 1500,
      });
    };

    newSocket.on("incoming_call", handleIncomingCall);
    newSocket.on("incoming_call_request", handleIncomingCall);

    // -------------------------------------------------------------
    // 💬 EVENT 2: INCOMING CHAT CONSULTATION (Chat Request)
    // -------------------------------------------------------------
    const handleIncomingConsultation = (data) => {
      console.log("💬 Incoming Consultation Request:", data);
      if (!data) return;

      const type = data.consultationType || data.type || "chat";
      if (type === "call" || type === "CALL" || type === "voice" || type === "video") {
        handleIncomingCall(data);
        return;
      }

      const consultationId = data.consultationId || data.id;
      if (!consultationId || dismissedIdsRef.current.has(consultationId)) return;

      // Don't show popup if astrologer is busy on active screen
      const currentSegments = segmentsRef.current || [];
      const isBusyOnScreen = currentSegments.some(
        (s) => s === "golive" || s === "call" || s === "chat"
      );
      if (isBusyOnScreen) return;

      setIncomingRequest({
        type: "chat",
        consultationId,
        roomId: data.roomId || consultationId,
        user: data.user || {
          id: data.userId,
          name: data.userName || "Client",
          profilePic: data.profilePic,
        },
        userId: data.userId || data.user?.id || data.user?._id,
        userName: data.userName || data.user?.name || "Client",
        problem: data.problem || "Chat Consultation",
        amount: data.amount,
        maxDurationMinutes: data.maxDurationMinutes,
        maxDurationSeconds: data.maxDurationSeconds || (data.maxDurationMinutes ? data.maxDurationMinutes * 60 : 900),
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
      });
    };

    newSocket.on("incoming_consultation", handleIncomingConsultation);
    newSocket.on("incoming_chat_request", handleIncomingConsultation);
    newSocket.on("incoming_consultation_request", handleIncomingConsultation);

    // -------------------------------------------------------------
    // ❌ EVENT 3: CLIENT CANCELLED (User ne ring par cancel kar diya)
    // -------------------------------------------------------------
    newSocket.on("consultation_cancelled", (data) => {
      console.log("⚠️ Client cancelled request:", data);
      setIncomingRequest(null);
    });

    // -------------------------------------------------------------
    // ⏱️ EVENT 4: CALL MISSED (60 seconds tak astrologer ne receive nahi kiya)
    // -------------------------------------------------------------
    newSocket.on("consultation_missed", (data) => {
      console.log("⏱️ Call was missed / not answered:", data);
      setIncomingRequest(null);
    });

    // -------------------------------------------------------------
    // 🔴 EVENT 5: CALL / CHAT ENDED
    // -------------------------------------------------------------
    newSocket.on("call_ended", () => setIncomingRequest(null));
    newSocket.on("chat_ended", () => setIncomingRequest(null));

    setSocket(newSocket);
    setGlobalSocket(newSocket);

    return () => {
      newSocket.disconnect();
      setSocket(null);
      setGlobalSocket(null);
    };
  }, [token]);

  // Accept / Decline Handlers
  const handleAcceptCall = () => {
    if (!incomingRequest) return;
    const { consultationId, userId, userName, problem, maxDurationSeconds, channelName, token: agoraToken, uid } =
      incomingRequest;

    console.log(LOG_TAG, "Astrologer accepted call:", consultationId);
    emitEvent("astrologer_accept_call", { consultationId });
    emitEvent("accept_call_session", { consultationId });
    emitEvent("accept_consultation", { consultationId });

    dismissedIdsRef.current.add(consultationId);
    setIncomingRequest(null);

    router.push({
      pathname: "/call",
      params: {
        consultationId,
        userId,
        userName,
        problem,
        maxDurationSeconds,
        channelName,
        token: agoraToken,
        uid,
      },
    });
  };

  const handleDeclineCall = () => {
    console.log(LOG_TAG, "Astrologer declined call:", incomingRequest?.consultationId);
    if (incomingRequest?.consultationId) {
      dismissedIdsRef.current.add(incomingRequest.consultationId);
      emitEvent("astrologer_reject_call", { consultationId: incomingRequest.consultationId });
      emitEvent("reject_consultation", { consultationId: incomingRequest.consultationId });
    }
    setIncomingRequest(null);
  };

  const handleAcceptChat = () => {
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

    console.log(LOG_TAG, "Astrologer accepted chat:", consultationId);
    emitEvent("accept_chat_session", { consultationId });
    emitEvent("accept_consultation", { consultationId });

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

  const handleDeclineChat = () => {
    console.log(LOG_TAG, "Astrologer declined chat:", incomingRequest?.consultationId);
    if (incomingRequest?.consultationId) {
      dismissedIdsRef.current.add(incomingRequest.consultationId);
      emitEvent("reject_chat_session", { consultationId: incomingRequest.consultationId });
      emitEvent("reject_consultation", { consultationId: incomingRequest.consultationId });
    }
    setIncomingRequest(null);
  };

  const isCall = incomingRequest?.type === "call" || incomingRequest?.type === "voice" || incomingRequest?.type === "video";
  const isChat = incomingRequest?.type === "chat";

  return (
    <SocketContext.Provider value={{ socket, incomingRequest, setIncomingRequest }}>
      {children}

      <IncomingCallModal
        request={isCall ? incomingRequest : null}
        onAccept={handleAcceptCall}
        onDecline={handleDeclineCall}
      />

      <IncomingChatModal
        request={isChat ? incomingRequest : null}
        onAccept={handleAcceptChat}
        onDecline={handleDeclineChat}
      />
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
export default SocketContext;

