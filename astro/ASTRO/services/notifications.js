import notifee, {
  AndroidImportance,
  AndroidVisibility,
} from "@notifee/react-native";

export const CALL_CHANNEL_ID = "consultation_calls_v3";
export const CHAT_CHANNEL_ID = "consultation_chats_v3";

export async function setupNotificationChannels() {
  await notifee.createChannel({
    id: CALL_CHANNEL_ID,
    name: "Incoming Call Consultation Requests",
    importance: AndroidImportance.HIGH,
    visibility: AndroidVisibility.PUBLIC,
    sound: "ringtone",
    vibration: true,
    vibrationPattern: [300, 500, 300, 500],
  });

  await notifee.createChannel({
    id: CHAT_CHANNEL_ID,
    name: "Incoming Chat Consultation Requests",
    importance: AndroidImportance.HIGH,
    visibility: AndroidVisibility.PUBLIC,
    sound: "ringtone",
    vibration: true,
    vibrationPattern: [300, 500, 300, 500],
  });
}

export async function displayIncomingRequestNotification(remoteMessage) {
  await setupNotificationChannels();

  const data = remoteMessage?.data;
  const rawType = (data?.consultationType || data?.type || "").toUpperCase();
  const isCall =
    rawType === "CALL" ||
    rawType === "CALL_REQUEST" ||
    rawType === "VOICE" ||
    rawType === "VIDEO";
  const isChat = rawType === "CHAT" || rawType === "CHAT_REQUEST";

  if (!isCall && !isChat) return;

  const channelId = isCall ? CALL_CHANNEL_ID : CHAT_CHANNEL_ID;
  const notificationId =
    data.consultationId || data.id || (isCall ? "incoming_call" : "incoming_chat");

  await notifee.displayNotification({
    id: String(notificationId),
    title:
      remoteMessage.notification?.title ||
      data.title ||
      (isCall ? "📞 Incoming Call Consultation" : "💬 Incoming Chat Request"),
    body:
      remoteMessage.notification?.body ||
      data.body ||
      (isCall
        ? `${data.userName || data.name || "A client"} is requesting a call consultation.`
        : `${data.userName || data.name || "A client"} is requesting a chat consultation.`),
    data,
    android: {
      channelId,
      importance: AndroidImportance.HIGH,
      visibility: AndroidVisibility.PUBLIC,
      sound: "ringtone",
      pressAction: { id: "default" },
    },
  });
}

