// utils/socket.js
// Call-Only Singleton Socket Service for Astrologer Application.
// Strictly isolated to voice/video call consultation signaling.

import AsyncStorage from "@react-native-async-storage/async-storage";
import { io } from "socket.io-client";
import { SOCKET_URL } from "../config/api";

const LOG_TAG = "[CallSocket]";

let socket = null;
let lastJoinParams = null;
let connectionStatus = "disconnected";
const statusListeners = new Set();
let currentJoinedConsultationId = null;

const setConnectionStatus = (status) => {
  if (status === connectionStatus) return;
  connectionStatus = status;
  console.log(LOG_TAG, "Connection status:", status);
  statusListeners.forEach((listener) => listener(status));
};

export const getConnectionStatus = () => connectionStatus;

export const onConnectionStatusChange = (listener) => {
  statusListeners.add(listener);
  listener(connectionStatus);
  return () => {
    statusListeners.delete(listener);
  };
};

export const connectSocket = async (initialToken) => {
  if (socket) {
    if (socket.connected) {
      console.log(LOG_TAG, "Reusing existing connected socket:", socket.id);
      return socket;
    }
    if (connectionStatus === "connecting") {
      console.log(LOG_TAG, "Socket connection already in progress...");
      return socket;
    }
  }

  let token = initialToken;
  if (!token) {
    const userData = await AsyncStorage.getItem("userData");
    token = userData ? JSON.parse(userData)?.token : null;
  }

  const cleanToken = token ? (token.startsWith("Bearer ") ? token.slice(7) : token) : null;
  const bearerToken = token ? (token.startsWith("Bearer ") ? token : `Bearer ${token}`) : null;

  console.log(LOG_TAG, "Connecting call socket to", SOCKET_URL, "tokenPresent:", !!cleanToken);
  setConnectionStatus("connecting");

  const instance = io(SOCKET_URL, {
    transports: ["polling", "websocket"],
    auth: {
      token: cleanToken,
      authorization: bearerToken,
    },
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 2000,
    timeout: 10000,
  });

  socket = instance;
  let emittedConnectJoin = false;

  instance.on("connect", () => {
    console.log(LOG_TAG, "Connected. Socket id:", instance?.id);
    setConnectionStatus("connected");

    if (lastJoinParams) {
      console.log(LOG_TAG, "Emitting room join on connect:", lastJoinParams);
      if (lastJoinParams.isChat) {
        instance.emit("join_chat_session", lastJoinParams);
      }
      instance.emit("join_consultation", lastJoinParams);
    }
  });

  // Handle server force-disconnect (prevents infinite reconnect loop when single session active)
  instance.on("force_disconnect", (data) => {
    console.warn(LOG_TAG, "⚠️ Disconnected by server:", data?.reason);
    if (socket === instance) {
      socket = null;
    }
    instance.removeAllListeners();
    instance.disconnect();
    lastJoinParams = null;
    currentJoinedConsultationId = null;
    setConnectionStatus("disconnected");
  });

  instance.on("disconnect", (reason) => {
    console.log(LOG_TAG, "Disconnected. Reason:", reason);
    emittedConnectJoin = false;
    if (reason === "io server disconnect") {
      if (socket === instance) {
        socket = null;
      }
      lastJoinParams = null;
      currentJoinedConsultationId = null;
      setConnectionStatus("disconnected");
    } else {
      setConnectionStatus(instance?.active ? "reconnecting" : "disconnected");
    }
  });

  instance.on("connect_error", (error) => {
    console.log(LOG_TAG, "Connect error:", error?.message || error);
    setConnectionStatus(instance?.active ? "reconnecting" : "disconnected");
  });

  instance.on("error", (error) => {
    console.log(LOG_TAG, "Socket error:", error);
  });

  return instance;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    console.log(LOG_TAG, "Disconnecting call socket:", socket.id);
    socket.disconnect();
    socket = null;
    lastJoinParams = null;
    currentJoinedConsultationId = null;
    setConnectionStatus("disconnected");
  }
};

export const joinCallConsultation = ({ consultationId, userId, role = "astrologer" }) => {
  if (currentJoinedConsultationId === consultationId && socket?.connected) {
    console.log(LOG_TAG, "Already joined call room:", consultationId);
    return;
  }

  currentJoinedConsultationId = consultationId;
  lastJoinParams = { consultationId, userId, role };

  if (!socket) {
    console.log(LOG_TAG, "joinCallConsultation saved params (socket not initialized yet)");
    return;
  }

  if (socket.connected) {
    console.log(LOG_TAG, "Emitting join_consultation immediately:", lastJoinParams);
    socket.emit("join_consultation", lastJoinParams);
  }
};

export const emitEvent = (eventName, payload) => {
  if (!socket) {
    console.log(LOG_TAG, "SOCKET EMIT SKIPPED (NOT CONNECTED):", eventName, payload);
    return false;
  }
  console.log(LOG_TAG, "SOCKET EMIT:", eventName, payload);
  socket.emit(eventName, payload);
  return true;
};

export const onEvent = (eventName, handler) => {
  if (!socket) {
    console.log(LOG_TAG, "SOCKET ON SKIPPED (NOT CONNECTED):", eventName);
    return () => {};
  }
  const wrapped = (data) => {
    console.log(LOG_TAG, "SOCKET EVENT RECEIVED:", eventName, data);
    handler(data);
  };
  socket.on(eventName, wrapped);
  return () => socket.off(eventName, wrapped);
};

export const joinChatSession = (params) => {
  const payload = { ...params, isChat: true };
  lastJoinParams = payload;
  if (!socket) return;
  if (socket.connected) {
    console.log(LOG_TAG, "Emitting join_chat_session on active socket:", payload);
    socket.emit("join_chat_session", payload);
    socket.emit("join_consultation", payload);
  } else {
    socket.once("connect", () => {
      console.log(LOG_TAG, "Connected, emitting delayed join_chat_session:", payload);
      socket.emit("join_chat_session", payload);
      socket.emit("join_consultation", payload);
    });
  }
};

export const sendChatMessage = (payload) => {
  if (!socket) return false;
  socket.emit("send_chat_message", payload);
  return true;
};

export const emitTypingIndicator = (payload) => {
  if (!socket) return;
  socket.emit("typing_indicator", payload);
};

export const endChatSession = (payload) => {
  if (!socket) return;
  socket.emit("end_chat_session", payload);
};

export const forceReconnectChatSocket = () => {
  if (socket) {
    socket.disconnect();
    setConnectionStatus("connecting");
    socket.connect();
  }
};
