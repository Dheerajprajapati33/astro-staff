import notifee, {
  AndroidImportance,
  AndroidVisibility,
} from "@notifee/react-native";

export const CALL_CHANNEL_ID = "consultation_calls";
export const CHAT_CHANNEL_ID = "consultation_chats";

export async function setupNotificationChannels() {
  await notifee.createChannel({
    id: CALL_CHANNEL_ID,
    name: "Consultation Call Requests",
    importance: AndroidImportance.HIGH,
    visibility: AndroidVisibility.PUBLIC,
    sound: "custom_ringtone",
    vibration: true,
    vibrationPattern: [300, 500, 300, 500],
  });

  await notifee.createChannel({
    id: CHAT_CHANNEL_ID,
    name: "Consultation Chat Requests",
    importance: AndroidImportance.HIGH,
    visibility: AndroidVisibility.PUBLIC,
    sound: "custom_ringtone",
    vibration: true,
    vibrationPattern: [300, 500, 300, 500],
  });
}

export async function displayIncomingRequestNotification(remoteMessage) {
  await setupNotificationChannels();

  const data = remoteMessage?.data;
  const type = data?.type?.toUpperCase();
  if (type !== "CALL_REQUEST" && type !== "CHAT_REQUEST") return;

  const isCall = type === "CALL_REQUEST";
  await notifee.displayNotification({
    id: data.consultationId,
    title:
      remoteMessage.notification?.title ||
      data.title ||
      (isCall ? "Incoming call consultation" : "Incoming chat request"),
    body:
      remoteMessage.notification?.body ||
      data.body ||
      (isCall
        ? "A client is requesting a call consultation."
        : "A client is requesting a chat consultation."),
    data,
    android: {
      channelId: isCall ? CALL_CHANNEL_ID : CHAT_CHANNEL_ID,
      importance: AndroidImportance.HIGH,
      visibility: AndroidVisibility.PUBLIC,
      pressAction: { id: "default" },
    },
  });
}
