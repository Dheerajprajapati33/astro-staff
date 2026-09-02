// services/chatSocketService.js
// Unified Socket Service for VAVI Chat Consultations.
// Reuses the single active socket connection from callSocketService.js
// to enforce 1 User = 1 Socket rule per backend specifications.

import {
  connectCallSocket,
  getCallSocket,
  getCallConnectionStatus,
  onCallConnectionStatusChange,
  setLastJoinParams,
} from "./callSocketService";

const LOG_TAG = "[ChatSocket]";

export const getConnectionStatus = () => getCallConnectionStatus();

export const onConnectionStatusChange = (listener) => {
  return onCallConnectionStatusChange(listener);
};

/**
 * Reuses the single active socket connection for 1:1 chat consultation.
 */
export const connectChatSocket = async () => {
  console.log(LOG_TAG, "Reusing single unified socket connection for chat...");
  return await connectCallSocket();
};

export const getChatSocket = () => getCallSocket();

export const joinChatSession = ({ consultationId, userId, role = "user" }) => {
  const socket = getCallSocket();
  const payload = { consultationId, userId, role, isChat: true };
  setLastJoinParams(payload);

  if (!socket) {
    console.log(
      LOG_TAG,
      "joinChatSession saved params (socket not initialized yet)",
    );
    return;
  }
  if (socket.connected) {
    console.log(LOG_TAG, "Emitting room join on unified socket:", payload);
    socket.emit("join_chat_session", payload);
    socket.emit("join_consultation", payload);
  } else {
    console.log(
      LOG_TAG,
      "Socket connecting, attaching connect listener to join chat room:",
      payload,
    );
    socket.once("connect", () => {
      console.log(
        LOG_TAG,
        "Connected, emitting delayed room join on unified socket:",
        payload,
      );
      socket.emit("join_chat_session", payload);
      socket.emit("join_consultation", payload);
    });
  }
};

export const sendChatMessage = (payload) => {
  const socket = getCallSocket();
  if (!socket || !socket.connected) {
    console.log(
      LOG_TAG,
      "sendChatMessage called before unified socket connected",
    );
    return false;
  }
  console.log(
    LOG_TAG,
    "Emitting send_chat_message on unified socket:",
    payload,
  );
  socket.emit("send_chat_message", payload);
  return true;
};

export const emitTypingIndicator = (payload) => {
  const socket = getCallSocket();
  if (!socket || !socket.connected) return;
  socket.emit("typing_indicator", payload);
};

export const endChatSession = (payload) => {
  const socket = getCallSocket();
  if (!socket || !socket.connected) return;
  console.log(LOG_TAG, "Emitting end_chat_session on unified socket:", payload);
  socket.emit("end_chat_session", payload);
};

export const removeChatListeners = () => {
  const socket = getCallSocket();
  if (!socket) return;
  console.log(LOG_TAG, "Removing chat event listeners");
  socket.off("chat_session_joined");
  socket.off("chat_started");
  socket.off("new_chat_message");
  socket.off("user_typing");
  socket.off("chat_ended");
  socket.off("chat_error");
};

export const disconnectChatSocket = () => {
  removeChatListeners();
  // Do NOT disconnect the transport if user is still active in app;
  // listeners are cleaned up safely.
};
