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

  socket = io(SOCKET_URL, {
    transports: ["websocket", "polling"],
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

  let emittedConnectJoin = false;

  socket.on("connect", () => {
    console.log(LOG_TAG, "Connected. Socket id:", socket.id);
    setConnectionStatus("connected");

    if (lastJoinParams && !emittedConnectJoin) {
      emittedConnectJoin = true;
      console.log(LOG_TAG, "Emitting join_consultation on connect:", lastJoinParams);
      socket.emit("join_consultation", lastJoinParams);
    }
  });

  // Handle server force-disconnect (prevents infinite reconnect loop when single session active)
  socket.on("force_disconnect", (data) => {
    console.warn(LOG_TAG, "⚠️ Disconnected by server:", data?.reason);
    if (socket) {
      socket.removeAllListeners();
      socket.disconnect();
      socket = null;
      lastJoinParams = null;
      currentJoinedConsultationId = null;
      setConnectionStatus("disconnected");
    }
  });

  socket.on("disconnect", (reason) => {
    console.log(LOG_TAG, "Disconnected. Reason:", reason);
    emittedConnectJoin = false;
    if (reason === "io server disconnect") {
      socket = null;
      lastJoinParams = null;
      currentJoinedConsultationId = null;
      setConnectionStatus("disconnected");
    } else {
      setConnectionStatus(socket?.active ? "reconnecting" : "disconnected");
    }
  });

  socket.on("connect_error", (error) => {
    console.log(LOG_TAG, "Connect error:", error?.message || error);
    setConnectionStatus(socket?.active ? "reconnecting" : "disconnected");
  });

  socket.on("error", (error) => {
    console.log(LOG_TAG, "Socket error:", error);
  });

  return socket;
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
    return;
  }
  console.log(LOG_TAG, "SOCKET EMIT:", eventName, payload);
  socket.emit(eventName, payload);
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
