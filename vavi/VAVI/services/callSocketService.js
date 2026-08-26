// services/callSocketService.js
// Dedicated singleton socket service for 1:1 voice/video call consultations in Vavi.
// Fully separated from chat socket service to prevent event cross-talk and code mixing.

import AsyncStorage from "@react-native-async-storage/async-storage";
import { io } from "socket.io-client";

import { SOCKET_URL } from "../constants/SocketConfig";

const LOG_TAG = "[CallSocket]";

let socket = null;
let lastJoinParams = null;
let connectionStatus = "disconnected";

const statusListeners = new Set();

const setConnectionStatus = (status) => {
  if (status === connectionStatus) return;
  connectionStatus = status;
  console.log(LOG_TAG, "Connection status:", status);
  statusListeners.forEach((listener) => listener(status));
};

export const getCallConnectionStatus = () => connectionStatus;

export const onCallConnectionStatusChange = (listener) => {
  statusListeners.add(listener);
  listener(connectionStatus);
  return () => {
    statusListeners.delete(listener);
  };
};

/**
 * Creates (or reuses) the socket connection for call consultations.
 */
export const connectCallSocket = async () => {
  if (socket?.connected) {
    console.log(LOG_TAG, "Reusing existing connected socket:", socket.id);
    return socket;
  }

  const userData = await AsyncStorage.getItem("userData");
  const token = userData ? JSON.parse(userData)?.token : null;

  console.log(LOG_TAG, "Connecting call socket to", SOCKET_URL, "tokenPresent:", !!token);
  setConnectionStatus("connecting");

  socket = io(SOCKET_URL, {
    transports: ["polling", "websocket"],
    auth: { token },
    query: { token },
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
  });

  socket.on("connect", () => {
    console.log(LOG_TAG, "Connected. Socket id:", socket.id);
    setConnectionStatus("connected");

    if (lastJoinParams) {
      console.log(LOG_TAG, "Emitting join_consultation on connect:", lastJoinParams);
      socket.emit("join_consultation", lastJoinParams);
      socket.emit("join_call_session", lastJoinParams);
    }
  });

  socket.on("disconnect", (reason) => {
    console.log(LOG_TAG, "Disconnected. Reason:", reason);
    setConnectionStatus(socket?.active ? "reconnecting" : "disconnected");
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

export const getCallSocket = () => socket;

/**
 * Emits join_consultation per backend specification (Section A, Step 2)
 */
export const joinCallConsultation = ({ consultationId, userId, role = "user" }) => {
  lastJoinParams = { consultationId, userId, role };

  if (!socket) {
    console.log(LOG_TAG, "joinCallConsultation saved params (socket not initialized yet)");
    return;
  }

  if (socket.connected) {
    console.log(LOG_TAG, "Emitting join_consultation immediately:", lastJoinParams);
    socket.emit("join_consultation", lastJoinParams);
    socket.emit("join_call_session", lastJoinParams);
  } else {
    console.log(LOG_TAG, "Saved join_consultation params (will emit on connect):", lastJoinParams);
  }
};

/**
 * Hangs up the call consultation per backend specification (Section A, Step 4)
 */
export const endCallConsultation = (params, defaultReason = "completed") => {
  if (!socket) {
    console.log(LOG_TAG, "endCallConsultation skipped (socket not connected)");
    return;
  }

  let consultationId;
  let reason = defaultReason;

  if (typeof params === "object" && params !== null) {
    consultationId = params.consultationId;
    reason = params.reason || defaultReason;
  } else {
    consultationId = params;
  }

  console.log(LOG_TAG, "Emitting client_end_call:", { consultationId, reason });
  socket.emit("client_end_call", { consultationId, reason });
  socket.emit("end_call_session", { consultationId, reason });
};

/**
 * Cleans up call listeners without destroying the socket instance
 */
export const removeCallListeners = () => {
  if (!socket) return;
  console.log(LOG_TAG, "Removing call listeners");
  socket.off("call_started");
  socket.off("consultation_started");
  socket.off("call_accepted");
  socket.off("call_ended");
};

/**
 * Disconnects and resets call socket
 */
export const disconnectCallSocket = () => {
  if (socket) {
    console.log(LOG_TAG, "Disconnecting call socket:", socket.id);
    removeCallListeners();
    socket.disconnect();
    socket = null;
    lastJoinParams = null;
    setConnectionStatus("disconnected");
  }
};
