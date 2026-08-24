import AsyncStorage from "@react-native-async-storage/async-storage";
import { io } from "socket.io-client";

import { SOCKET_URL } from "../constants/SocketConfig";

const LOG_TAG = "[ChatSocket]";

let socket;

// Params from the most recent joinChatSession() call, replayed on every
// reconnect (auto or forced) so the server re-adds us to the room. Reset
// whenever the socket is fully torn down via disconnectChatSocket().
let lastJoinParams = null;

// True once the socket has connected at least once. Used to tell an initial
// connect apart from a reconnect, since joinChatSession() already handles
// the initial join (its emit is buffered by socket.io until connected).
let hasConnectedOnce = false;

// "connecting" | "connected" | "reconnecting" | "disconnected"
// Exposed so screens can show a banner instead of failing silently — see
// getConnectionStatus() / onConnectionStatusChange().
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

/**
 * Subscribe to connection-status changes. Returns an unsubscribe function.
 * Fires immediately with the current status so callers don't need to also
 * call getConnectionStatus() to get the initial value.
 */
export const onConnectionStatusChange = (listener) => {
  statusListeners.add(listener);

  listener(connectionStatus);

  return () => {
    statusListeners.delete(listener);
  };
};

/**
 * Creates (or reuses) the socket connection used for 1:1 chat consultation.
 * Auth token is attached the same way RTK Query slices read it (AsyncStorage "userData").
 */
export const connectChatSocket = async () => {
  if (socket?.connected) {
    console.log(LOG_TAG, "Reusing existing connected socket:", socket.id);

    return socket;
  }

  const userData = await AsyncStorage.getItem("userData");

  const token = userData ? JSON.parse(userData)?.token : null;

  const cleanToken = token ? (token.startsWith("Bearer ") ? token.slice(7) : token) : null;
  const bearerToken = token ? (token.startsWith("Bearer ") ? token : `Bearer ${token}`) : null;

  console.log(LOG_TAG, "Connecting to", SOCKET_URL, "tokenPresent:", !!cleanToken);

  setConnectionStatus("connecting");

  socket = io(SOCKET_URL, {
    transports: ["polling", "websocket"],
    auth: {
      token: cleanToken,
      authorization: bearerToken,
    },
    query: {
      token: cleanToken,
    },
    extraHeaders: bearerToken ? { Authorization: bearerToken } : {},
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
  });

  socket.on("connect", () => {
    console.log(LOG_TAG, "Connected. Socket id:", socket.id);

    setConnectionStatus("connected");

    // The RN JS thread is suspended while backgrounded, so socket.io's own
    // reconnect loop (and ping/pong heartbeat) doesn't run until we're back
    // in the foreground — see forceReconnectChatSocket(). Whenever we do
    // land here again after the first connect, the server has no memory of
    // our old room membership, so replay the last join.
    if (lastJoinParams) {
      console.log(LOG_TAG, "Emitting join_chat_session on connect:", lastJoinParams);

      socket.emit("join_chat_session", lastJoinParams);
    }

    hasConnectedOnce = true;
  });

  socket.on("disconnect", (reason) => {
    console.log(LOG_TAG, "Disconnected. Reason:", reason);

    // socket.active is false only for disconnects socket.io won't retry on
    // its own (e.g. we called socket.disconnect(), or the server booted us).
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

  return socket;
};

export const getChatSocket = () => socket;

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

/**
 * Forces a fresh handshake instead of waiting on socket.io to notice the
 * transport died. Needed because after the app is backgrounded and resumed,
 * `socket.connected` can still read true (the ping/pong heartbeat that would
 * flip it was frozen along with the JS thread), so a plain `if
 * (!socket.connected) socket.connect()` check would skip reconnecting for
 * up to another ~20s (default pingTimeout) after resume.
 */
export const forceReconnectChatSocket = () => {
  if (!socket) {
    return;
  }

  console.log(LOG_TAG, "Forcing reconnect (app resumed)");

  // disconnect() synchronously fires the "disconnect" handler above, which
  // would set status to "disconnected" — set "connecting" after, so it
  // sticks until the next real transition.
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

  // clientTempId round-trips through the server if it echoes back unknown
  // fields (common with permissive schemas); the caller falls back to a
  // content-match heuristic if it doesn't. Either way this emit itself is
  // fire-and-forget — no ack, no delivery guarantee — so the caller is
  // responsible for its own timeout/retry (see ChatConsultation's
  // pendingSendTimers).
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
  if (!socket) {
    return;
  }

  socket.emit("typing_indicator", { consultationId, role, isTyping });
};

export const endChatSession = ({ consultationId, reason = "completed" }) => {
  if (!socket) {
    console.log(LOG_TAG, "endChatSession called before socket connected");

    return;
  }

  console.log(LOG_TAG, "Emitting end_chat_session:", {
    consultationId,
    reason,
  });

  socket.emit("end_chat_session", { consultationId, reason });
};

/**
 * Removes only the chat-flow listeners (chat_started, new_chat_message, etc.)
 * without killing the underlying transport, so a screen unmount is clean.
 */
export const removeChatListeners = () => {
  if (!socket) {
    return;
  }

  console.log(LOG_TAG, "Removing chat event listeners");

  socket.off("chat_started");
  socket.off("new_chat_message");
  socket.off("user_typing");
  socket.off("chat_ended");
};

export const disconnectChatSocket = () => {
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
