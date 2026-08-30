// services/chatSocketService.js
// Disabled background chat sockets per project specification.
// Sockets are strictly restricted to Call Consultations only (see callSocketService.js).

const LOG_TAG = "[ChatSocket]";

export const getConnectionStatus = () => "disconnected";
export const onConnectionStatusChange = (listener) => {
  listener?.("disconnected");
  return () => {};
};

export const connectChatSocket = async () => {
  console.log(LOG_TAG, "Chat socket disabled per call-only specification.");
  return null;
};

export const getChatSocket = () => null;
export const joinChatSession = () => {};
export const forceReconnectChatSocket = () => {};
export const sendChatMessage = () => false;
export const emitTypingIndicator = () => {};
export const endChatSession = () => {};
export const acceptChatSession = () => {};
export const leaveChatSession = () => {};
export const removeChatListeners = () => {};
export const disconnectChatSocket = () => {};
