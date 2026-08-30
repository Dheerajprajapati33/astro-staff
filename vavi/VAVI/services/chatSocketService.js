// services/chatSocketService.js
// Singleton socket service for 1:1 chat consultation in Vavi.

import AsyncStorage from "@react-native-async-storage/async-storage";
import { io } from "socket.io-client";
import { SOCKET_URL } from "../constants/SocketConfig";

const LOG_TAG = "[ChatSocket]";

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

export const getConnectionStatus = () => connectionStatus;

export const onConnectionStatusChange = (listener) => {
  statusListeners.add(listener);
  listener(connectionStatus);
  return () => {
    statusListeners.delete(listener);
  };
};

export const connectChatSocket = async () => {
  if (socket) {
    if (socket.connected) {
      console.log(LOG_TAG, "Reusing existing connected chat socket:", socket.id);
      return socket;
    }
    if (connectionStatus === "connecting") {
      console.log(LOG_TAG, "Chat socket connection in progress, reusing instance...");
      return socket;
    }
  }

  const userData = await AsyncStorage.getItem("userData");
  const token = userData ? JSON.parse(userData)?.token : null;
  const cleanToken = token ? (token.startsWith("Bearer ") ? token.slice(7) : token) : null;
  const bearerToken = token ? (token.startsWith("Bearer ") ? token : `Bearer ${token}`) : null;

  console.log(LOG_TAG, "Connecting chat socket to", SOCKET_URL, "tokenPresent:", !!cleanToken);
  setConnectionStatus("connecting");

  const instance = io(SOCKET_URL, {
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

  socket = instance;
  let emittedConnectJoin = false;

  instance.on("connect", () => {
    console.log(LOG_TAG, "Connected. Socket id:", instance?.id);
    setConnectionStatus("connected");

    if (lastJoinParams && !emittedConnectJoin) {
      emittedConnectJoin = true;
      console.log(LOG_TAG, "Emitting join_chat_session on connect:", lastJoinParams);
      instance.emit("join_chat_session", lastJoinParams);
    }
  });

  instance.on("force_disconnect", (data) => {
    console.warn(LOG_TAG, "⚠️ Disconnected by server:", data?.reason);
    if (socket === instance) socket = null;
    instance.removeAllListeners();
    instance.disconnect();
    lastJoinParams = null;
    setConnectionStatus("disconnected");
  });

  instance.on("disconnect", (reason) => {
    console.log(LOG_TAG, "Disconnected. Reason:", reason);
    emittedConnectJoin = false;
    if (reason === "io server disconnect") {
      if (socket === instance) socket = null;
      lastJoinParams = null;
      setConnectionStatus("disconnected");
    } else {
      setConnectionStatus(instance?.active ? "reconnecting" : "disconnected");
    }
  });

  instance.on("connect_error", (error) => {
    console.log(LOG_TAG, "Connect error:", error?.message || error);
    setConnectionStatus(instance?.active ? "reconnecting" : "disconnected");
  });

  return instance;
};

export const getChatSocket = () => socket;

export const joinChatSession = ({ consultationId, userId, role }) => {
  lastJoinParams = { consultationId, userId, role };
  if (!socket) return;
  if (socket.connected) {
    socket.emit("join_chat_session", lastJoinParams);
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

export const removeChatListeners = () => {
  if (!socket) return;
  socket.off("chat_session_joined");
  socket.off("chat_started");
  socket.off("new_chat_message");
  socket.off("user_typing");
  socket.off("chat_ended");
  socket.off("chat_error");
};

export const disconnectChatSocket = () => {
  if (socket) {
    removeChatListeners();
    socket.disconnect();
    socket = null;
    lastJoinParams = null;
    setConnectionStatus("disconnected");
  }
};
