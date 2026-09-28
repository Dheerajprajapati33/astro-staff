// utils/socket.js
// Call-Only Singleton Socket Service for Astrologer Application.
// Existing socket connection flow remains unchanged.

import AsyncStorage from "@react-native-async-storage/async-storage";
import { io } from "socket.io-client";
import { SOCKET_URL } from "../config/api";

const LOG_TAG = "[CallSocket]";

let socket = null;
let lastJoinParams = null;
let connectionStatus = "disconnected";
const statusListeners = new Set();

let currentJoinedConsultationId = null;

// ==========================
// CONNECTION STATUS
// ==========================

const setConnectionStatus = (
  status,
) => {
  if (
    status === connectionStatus
  ) {
    return;
  }

  connectionStatus = status;

  console.log(
    LOG_TAG,
    "Connection status:",
    status,
  );

  statusListeners.forEach(
    (listener) =>
      listener(status),
  );
};

export const getConnectionStatus =
  () => connectionStatus;

export const onConnectionStatusChange =
  (listener) => {
    statusListeners.add(listener);

    listener(connectionStatus);

    return () => {
      statusListeners.delete(
        listener,
      );
    };
  };

// ==========================
// CONNECT SOCKET
// ==========================

export const connectSocket = async (
  initialToken,
) => {
  if (socket) {
    if (socket.connected) {
      console.log(
        LOG_TAG,
        "Reusing existing connected socket:",
        socket.id,
      );

      return socket;
    }

    if (
      connectionStatus ===
      "connecting"
    ) {
      console.log(
        LOG_TAG,
        "Socket connection already in progress...",
      );

      return socket;
    }
  }

  let token =
    initialToken;

  if (!token) {
    const userData =
      await AsyncStorage.getItem(
        "userData",
      );

    token = userData
      ? JSON.parse(userData)?.token
      : null;
  }

  const cleanToken = token
    ? token.startsWith("Bearer ")
      ? token.slice(7)
      : token
    : null;

  const bearerToken = token
    ? token.startsWith("Bearer ")
      ? token
      : `Bearer ${token}`
    : null;

  console.log(
    LOG_TAG,
    "Connecting call socket to",
    SOCKET_URL,
    "tokenPresent:",
    !!cleanToken,
  );

  setConnectionStatus(
    "connecting",
  );

  const instance = io(
    SOCKET_URL,
    {
      transports: [
        "polling",
        "websocket",
      ],

      auth: {
        token: cleanToken,
        authorization:
          bearerToken,
      },

      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
      timeout: 10000,
    },
  );

  socket = instance;

  instance.on(
    "connect",
    () => {
      console.log(
        LOG_TAG,
        "Connected. Socket id:",
        instance?.id,
      );

      setConnectionStatus(
        "connected",
      );

      if (lastJoinParams) {
        console.log(
          LOG_TAG,
          "Emitting room join on connect:",
          lastJoinParams,
        );

        if (
          lastJoinParams.isChat
        ) {
          instance.emit(
            "join_chat_session",
            lastJoinParams,
          );
        }

        instance.emit(
          "join_consultation",
          lastJoinParams,
        );
      }
    },
  );

  // ==========================
  // FORCE DISCONNECT
  // ==========================

  instance.on(
    "force_disconnect",
    (data) => {
      console.warn(
        LOG_TAG,
        "Disconnected by server:",
        data?.reason,
      );

      if (
        socket === instance
      ) {
        socket = null;
      }

      instance.removeAllListeners();
      instance.disconnect();

      lastJoinParams = null;
      currentJoinedConsultationId =
        null;

      setConnectionStatus(
        "disconnected",
      );
    },
  );

  // ==========================
  // DISCONNECT
  // ==========================

  instance.on(
    "disconnect",
    (reason) => {
      console.log(
        LOG_TAG,
        "Disconnected. Reason:",
        reason,
      );

      if (
        reason ===
        "io server disconnect"
      ) {
        if (
          socket === instance
        ) {
          socket = null;
        }

        lastJoinParams = null;

        currentJoinedConsultationId =
          null;

        setConnectionStatus(
          "disconnected",
        );
      } else {
        setConnectionStatus(
          instance?.active
            ? "reconnecting"
            : "disconnected",
        );
      }
    },
  );

  // ==========================
  // CONNECT ERROR
  // ==========================

  instance.on(
    "connect_error",
    (error) => {
      console.log(
        LOG_TAG,
        "Connect error:",
        error?.message ||
          error,
      );

      setConnectionStatus(
        instance?.active
          ? "reconnecting"
          : "disconnected",
      );
    },
  );

  // ==========================
  // SOCKET ERROR
  // ==========================

  instance.on(
    "error",
    (error) => {
      console.log(
        LOG_TAG,
        "Socket error:",
        error,
      );
    },
  );

  return instance;
};

// ==========================
// GET SOCKET
// ==========================

export const getSocket = () =>
  socket;

// ==========================
// DISCONNECT SOCKET
// ==========================

export const disconnectSocket =
  () => {
    if (socket) {
      console.log(
        LOG_TAG,
        "Disconnecting call socket:",
        socket.id,
      );

      socket.disconnect();

      socket = null;

      lastJoinParams = null;

      currentJoinedConsultationId =
        null;

      setConnectionStatus(
        "disconnected",
      );
    }
  };

// ==========================
// CLEAR LAST JOIN PARAMS
// ==========================

export const clearLastJoinParams =
  () => {
    lastJoinParams = null;

    currentJoinedConsultationId =
      null;

    console.log(
      LOG_TAG,
      "Cleared last join consultation params",
    );
  };

// ==========================
// LIVE ROOM
// ==========================

export const joinLiveRoom = (
  payload,
) => {
  if (socket?.connected) {
    socket.emit(
      "join_live_room",
      payload,
    );
  }
};

export const leaveLiveRoom = (
  payload,
) => {
  if (socket?.connected) {
    socket.emit(
      "leave_live_room",
      payload,
    );
  }
};

// ==========================
// JOIN CALL CONSULTATION
// ==========================

export const joinCallConsultation =
  ({
    consultationId,
    userId,
    role = "astrologer",
  }) => {
    if (
      currentJoinedConsultationId ===
        consultationId &&
      socket?.connected
    ) {
      console.log(
        LOG_TAG,
        "Already joined call room:",
        consultationId,
      );

      return;
    }

    currentJoinedConsultationId =
      consultationId;

    lastJoinParams = {
      consultationId,
      userId,
      role,
    };

    if (!socket) {
      console.log(
        LOG_TAG,
        "joinCallConsultation saved params (socket not initialized yet)",
      );

      return;
    }

    if (socket.connected) {
      console.log(
        LOG_TAG,
        "Emitting join_consultation immediately:",
        lastJoinParams,
      );

      socket.emit(
        "join_consultation",
        lastJoinParams,
      );
    }
  };

// ==========================
// GENERIC EMIT
// ==========================

export const emitEvent = (
  eventName,
  payload,
) => {
  if (!socket) {
    console.log(
      LOG_TAG,
      "SOCKET EMIT SKIPPED (NOT CONNECTED):",
      eventName,
      payload,
    );

    return false;
  }

  console.log(
    LOG_TAG,
    "SOCKET EMIT:",
    eventName,
    payload,
  );

  socket.emit(
    eventName,
    payload,
  );

  return true;
};

// ==========================
// GENERIC LISTENER
// ==========================

export const onEvent = (
  eventName,
  handler,
) => {
  if (!socket) {
    console.log(
      LOG_TAG,
      "SOCKET ON SKIPPED (NOT CONNECTED):",
      eventName,
    );

    return () => {};
  }

  const wrapped = (data) => {
    console.log(
      LOG_TAG,
      "SOCKET EVENT RECEIVED:",
      eventName,
      data,
    );

    handler(data);
  };

  socket.on(
    eventName,
    wrapped,
  );

  return () =>
    socket.off(
      eventName,
      wrapped,
    );
};

// ==========================
// JOIN CHAT SESSION
// ==========================

export const joinChatSession =
  (params) => {
    const payload = {
      ...params,
      isChat: true,
    };

    lastJoinParams = payload;

    if (!socket) {
      return;
    }

    if (socket.connected) {
      console.log(
        LOG_TAG,
        "Emitting join_chat_session on active socket:",
        payload,
      );

      socket.emit(
        "join_chat_session",
        payload,
      );

      socket.emit(
        "join_consultation",
        payload,
      );
    } else {
      socket.once(
        "connect",
        () => {
          console.log(
            LOG_TAG,
            "Connected, emitting delayed join_chat_session:",
            payload,
          );

          socket.emit(
            "join_chat_session",
            payload,
          );

          socket.emit(
            "join_consultation",
            payload,
          );
        },
      );
    }
  };

// ==========================
// SEND CHAT MESSAGE
// ==========================

export const sendChatMessage = (
  payload,
) => {
  if (!socket) {
    return false;
  }

  socket.emit(
    "send_chat_message",
    payload,
  );

  return true;
};

// ==========================
// TYPING INDICATOR
// ==========================

export const emitTypingIndicator =
  (payload) => {
    if (!socket) {
      return;
    }

    socket.emit(
      "typing_indicator",
      payload,
    );
  };

// ==========================
// END CHAT SESSION
// ==========================

export const endChatSession = (
  payload,
) => {
  if (!socket) {
    return;
  }

  socket.emit(
    "end_chat_session",
    payload,
  );
};

// ==========================
// DELETE CHAT MESSAGE
// ==========================

export const deleteChatMessageSocket =
  ({
    consultationId,
    messageId,
    deleteType = "me",
  }) => {
    if (
      !socket ||
      !socket.connected
    ) {
      console.log(
        LOG_TAG,
        "deleteChatMessageSocket skipped: socket not connected",
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

    socket.emit(
      "delete_chat_message",
      payload,
    );

    return true;
  };

// ==========================
// CHAT MESSAGE DELETED
// ==========================

export const onChatMessageDeleted =
  (handler) => {
    if (!socket) {
      console.log(
        LOG_TAG,
        "onChatMessageDeleted skipped: socket not initialized",
      );

      return () => {};
    }

    const wrapped = (data) => {
      console.log(
        LOG_TAG,
        "chat_message_deleted:",
        data,
      );

      handler(data);
    };

    socket.on(
      "chat_message_deleted",
      wrapped,
    );

    return () => {
      socket.off(
        "chat_message_deleted",
        wrapped,
      );
    };
  };

// ==========================
// FORCE RECONNECT
// ==========================

export const forceReconnectChatSocket =
  () => {
    if (socket) {
      socket.disconnect();

      setConnectionStatus(
        "connecting",
      );

      socket.connect();
    }
  };