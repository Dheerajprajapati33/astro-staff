// utils/socket.js
// Singleton socket.io connection for the Astrologer app.
// Ported and aligned with the robust, reconnect-resilient design of VAVI's chatSocketService.js.

import AsyncStorage from "@react-native-async-storage/async-storage";
import { io } from "socket.io-client";
import { SOCKET_URL } from "../config/api";

const LOG_TAG = "[ChatSocket]";

let socket = null;
let lastJoinParams = null;
let hasConnectedOnce = false;

// "connecting" | "connected" | "reconnecting" | "disconnected"
let connectionStatus = "disconnected";
const statusListeners = new Set();

const setConnectionStatus = (status) => {
  if (status === connectionStatus) {
    return;
  }

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
  if (socket?.connected) {
    console.log(LOG_TAG, "Reusing existing connected socket:", socket.id);
    return socket;
  }

  let token = initialToken;
  if (!token) {
    const userData = await AsyncStorage.getItem("userData");
    token = userData ? JSON.parse(userData)?.token : null;
  }

  const cleanToken = token ? (token.startsWith("Bearer ") ? token.slice(7) : token) : null;
  const bearerToken = token ? (token.startsWith("Bearer ") ? token : `Bearer ${token}`) : null;

  console.log(LOG_TAG, "Connecting to", SOCKET_URL, "tokenPresent:", !!cleanToken);
  setConnectionStatus("connecting");

  socket = io(SOCKET_URL, {
    transports: ["websocket", "polling"],
    auth: {
      token: cleanToken,
      authorization: bearerToken,
    },
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
  });

  socket.on("connect", () => {
    console.log(LOG_TAG, "Connected. Socket id:", socket.id);
    setConnectionStatus("connected");

    if (lastJoinParams) {
      console.log(LOG_TAG, "Emitting join_chat_session on connect:", lastJoinParams);
      socket.emit("join_chat_session", lastJoinParams);
    }
    hasConnectedOnce = true;
  });

  socket.on("disconnect", (reason) => {
    console.log(LOG_TAG, "Disconnected. Reason:", reason);
    setConnectionStatus(socket.active ? "reconnecting" : "disconnected");
  });

  socket.on("connect_error", (error) => {
    console.log(LOG_TAG, "Connect error:", error?.message || error);
    setConnectionStatus(socket.active ? "reconnecting" : "disconnected");
  });

  socket.on("reconnect_attempt", (attempt) => {
    console.log(LOG_TAG, "Reconnect attempt:", attempt);
    setConnectionStatus("reconnecting");
  });

  socket.on("error", (error) => {
    console.log(LOG_TAG, "Socket error:", error);
  });

  socket.onAny((eventName, ...args) => {
    console.log(LOG_TAG, "ANY EVENT RECEIVED:", eventName, ...args);
  });

  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    console.log(LOG_TAG, "Disconnecting socket:", socket.id);
    removeChatListeners();
    socket.disconnect();
    socket = null;
    lastJoinParams = null;
    hasConnectedOnce = false;
    setConnectionStatus("disconnected");
  }
};

export const joinChatSession = ({ consultationId, userId, role }) => {
  lastJoinParams = { consultationId, userId, role };

  if (!socket) {
    console.log(LOG_TAG, "joinChatSession saved params (socket instance not created yet)");
    return;
  }

  if (socket.connected) {
    console.log(LOG_TAG, "Emitting join_chat_session immediately:", lastJoinParams);
    socket.emit("join_chat_session", lastJoinParams);
  } else {
    console.log(LOG_TAG, "Saved join_chat_session params (will emit on connect):", lastJoinParams);
  }
};

export const forceReconnectChatSocket = () => {
  if (!socket) return;
  console.log(LOG_TAG, "Forcing reconnect (app resumed)");
  socket.disconnect();
  setConnectionStatus("connecting");
  socket.connect();
};

export const sendChatMessage = ({
  consultationId,
  senderId,
  senderRole,
  message,
  messageType = "TEXT",
  clientTempId,
}) => {
  if (!socket) {
    console.log(LOG_TAG, "sendChatMessage called before socket connected");
    return false;
  }

  console.log(LOG_TAG, "Emitting send_chat_message:", {
    consultationId,
    senderId,
    senderRole,
    messageType,
    clientTempId,
  });

  socket.emit("send_chat_message", {
    consultationId,
    senderId,
    senderRole,
    message,
    messageType,
    clientTempId,
  });

  return true;
};

export const emitTypingIndicator = ({ consultationId, role, isTyping }) => {
  if (!socket) return;
  socket.emit("typing_indicator", { consultationId, role, isTyping });
};

export const endChatSession = ({ consultationId, reason = "completed" }) => {
  if (!socket) {
    console.log(LOG_TAG, "endChatSession called before socket connected");
    return;
  }

  console.log(LOG_TAG, "Emitting end_chat_session:", { consultationId, reason });
  socket.emit("end_chat_session", { consultationId, reason });
};

export const acceptChatSession = ({ consultationId }) => {
  if (!socket) {
    console.log(LOG_TAG, "acceptChatSession called before socket connected");
    return;
  }
  console.log(LOG_TAG, "Emitting accept_chat_session:", { consultationId });
  socket.emit("accept_chat_session", { consultationId });
};

export const leaveChatSession = ({ consultationId, userId }) => {
  if (!socket) {
    console.log(LOG_TAG, "leaveChatSession called before socket connected");
    return;
  }
  console.log(LOG_TAG, "Emitting leave_chat_session:", { consultationId, userId });
  socket.emit("leave_chat_session", { consultationId, userId });
};

export const removeChatListeners = () => {
  if (!socket) return;
  console.log(LOG_TAG, "Removing chat event listeners");
  socket.off("chat_session_joined");
  socket.off("chat_started");
  socket.off("new_chat_message");
  socket.off("user_typing");
  socket.off("chat_ended");
  socket.off("chat_error");
};

// Compatible legacy thin wrappers
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
