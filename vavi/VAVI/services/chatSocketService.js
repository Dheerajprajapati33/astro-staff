// services/chatSocketService.js
// Unified Socket Service for VAVI Chat Consultations.
// Reuses the single active socket connection from callSocketService.js.
// Existing socket connection flow remains unchanged.

import {
  connectCallSocket,
  getCallSocket,
  getCallConnectionStatus,
  onCallConnectionStatusChange,
  setLastJoinParams,
} from "./callSocketService";

const LOG_TAG = "[ChatSocket]";

export const getConnectionStatus = () =>
  getCallConnectionStatus();

export const onConnectionStatusChange = (listener) => {
  return onCallConnectionStatusChange(listener);
};

// ==========================
// CONNECT CHAT SOCKET
// ==========================

export const connectChatSocket = async () => {
  console.log(
    LOG_TAG,
    "Reusing single unified socket connection for chat...",
  );

  return await connectCallSocket();
};

// ==========================
// GET CHAT SOCKET
// ==========================

export const getChatSocket = () => {
  return getCallSocket();
};

// ==========================
// JOIN CHAT SESSION
// ==========================

export const joinChatSession = ({
  consultationId,
  userId,
  role = "user",
}) => {
  const socket = getCallSocket();

  const payload = {
    consultationId,
    userId,
    role,
    isChat: true,
  };

  setLastJoinParams(payload);

  if (!socket) {
    console.log(
      LOG_TAG,
      "joinChatSession saved params (socket not initialized yet)",
    );

    return;
  }

  if (socket.connected) {
    console.log(
      LOG_TAG,
      "Emitting room join on unified socket:",
      payload,
    );

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

// ==========================
// SEND CHAT MESSAGE
// ==========================

export const sendChatMessage = (payload) => {
  const socket = getCallSocket();

  if (!socket || !socket.connected) {
    console.log(
      LOG_TAG,
      "sendChatMessage called before unified socket connected",
    );

    return false;
  }

  const isPrivateKundliDetails =
    typeof payload?.message === "string" &&
    payload.message.startsWith("__VAVI_KUNDLI_DETAILS_V1__:");
  const isImageMessage =
    String(payload?.messageType || "").toUpperCase() === "IMAGE";

  console.log(
    LOG_TAG,
    "Emitting send_chat_message on unified socket:",
    isPrivateKundliDetails
      ? {
          consultationId: payload.consultationId,
          senderRole: payload.senderRole,
          messageType: payload.messageType,
          privateKundliDetails: true,
        }
      : isImageMessage
        ? {
            consultationId: payload.consultationId,
            senderRole: payload.senderRole,
            messageType: payload.messageType,
            imagePayload: {
              kind:
                typeof payload.message === "string" &&
                payload.message.startsWith("data:image/")
                  ? "data-uri"
                  : typeof payload.message,
              length:
                typeof payload.message === "string"
                  ? payload.message.length
                  : undefined,
            },
          }
      : payload,
  );

  socket.emit("send_chat_message", payload);

  return true;
};

// ==========================
// DELETE CHAT MESSAGE SOCKET
// ==========================

export const deleteChatMessageSocket = ({
  consultationId,
  messageId,
  deleteType = "me",
}) => {
  const socket = getCallSocket();

  if (!socket || !socket.connected) {
    console.log(
      LOG_TAG,
      "deleteChatMessageSocket called before socket connected",
    );

    return false;
  }

  const payload = {
    consultationId,
    messageId,
    deleteType,
  };

  console.log(
    LOG_TAG,
    "Emitting delete_chat_message:",
    payload,
  );

  socket.emit("delete_chat_message", payload);

  return true;
};

// ==========================
// TYPING INDICATOR
// ==========================

export const emitTypingIndicator = (payload) => {
  const socket = getCallSocket();

  if (!socket || !socket.connected) {
    return;
  }

  socket.emit("typing_indicator", payload);
};

// ==========================
// END CHAT SESSION
// ==========================

export const endChatSession = (payload) => {
  const socket = getCallSocket();

  if (!socket || !socket.connected) {
    return;
  }

  console.log(
    LOG_TAG,
    "Emitting end_chat_session on unified socket:",
    payload,
  );

  socket.emit("end_chat_session", payload);
};

// ==========================
// CHAT MESSAGE DELETE LISTENER
// ==========================

export const onChatMessageDeleted = (handler) => {
  const socket = getCallSocket();

  if (!socket) {
    console.log(
      LOG_TAG,
      "onChatMessageDeleted: socket not initialized",
    );

    return () => {};
  }

  socket.on("chat_message_deleted", handler);

  return () => {
    socket.off("chat_message_deleted", handler);
  };
};

// ==========================
// REMOVE CHAT LISTENERS
// ==========================

export const removeChatListeners = () => {
  const socket = getCallSocket();

  if (!socket) {
    return;
  }

  console.log(
    LOG_TAG,
    "Removing chat event listeners",
  );

  socket.off("chat_session_joined");
  socket.off("chat_started");
  socket.off("new_chat_message");
  socket.off("user_typing");
  socket.off("chat_ended");
  socket.off("chat_error");
  socket.off("chat_message_deleted");
};

// ==========================
// DISCONNECT CHAT SOCKET
// ==========================

export const disconnectChatSocket = () => {
  removeChatListeners();

  // IMPORTANT:
  // Do NOT disconnect the transport.
  // Existing VAVI single-socket architecture remains unchanged.
};