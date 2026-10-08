import { useEffect, useRef } from "react";
import {
  getInitialNotification,
  getMessaging,
  getToken,
  onMessage,
  onNotificationOpenedApp,
  onTokenRefresh,
} from "@react-native-firebase/messaging";
import notifee, { EventType } from "@notifee/react-native";
import { useSegments } from "expo-router";

import { getStoredUser } from "../../utils/auth";
import { BASE_URL } from "../../config/api";
import { chatApi } from "../../redux/ChatApi";
import { store } from "../../redux/store";
import { setupNotificationChannels } from "../../services/notifications";
import { useSocket } from "../../src/context/SocketContext";

const LOG_TAG = "[PushNotificationProvider]";
const messagingInstance = getMessaging();

async function syncFcmToken(fcmToken, userToken) {
  const authorization = userToken.startsWith("Bearer ")
    ? userToken
    : `Bearer ${userToken}`;
  const response = await fetch(`${BASE_URL}/api/notifications/fcm-token`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: authorization,
    },
    body: JSON.stringify({ fcmToken }),
  });

  if (!response.ok) {
    const responseBody = await response.text();
    throw new Error(
      `FCM token registration failed (${response.status}): ${responseBody}`,
    );
  }
}

export default function PushNotificationProvider({ children }) {
  const segments = useSegments();
  const segmentsRef = useRef(segments);
  segmentsRef.current = segments;

  const { setIncomingRequest } = useSocket?.() || {};
  const setIncomingRequestRef = useRef(setIncomingRequest);
  setIncomingRequestRef.current = setIncomingRequest;

  const setupPromiseRef = useRef(null);
  const registeredFcmTokenRef = useRef(null);

  const handleIncomingPayload = (data) => {
    if (!data) return;
    const consultationId = data.consultationId || data.id;
    if (!consultationId) return;

    const currentSegments = segmentsRef.current || [];
    const isBusyOnScreen = currentSegments.some(
      (s) => s === "golive" || s === "call" || s === "chat",
    );
    if (isBusyOnScreen) return;

    const rawType = String(
      data.consultationType || data.type || "CALL_REQUEST",
    ).toUpperCase();
    const isCall =
      rawType === "CALL" ||
      rawType === "CALL_REQUEST" ||
      rawType === "VOICE" ||
      rawType === "VIDEO";

    if (isCall) {
      setIncomingRequestRef.current?.({
        type: "call",
        consultationId,
        user: data.user || {
          id: data.userId,
          name: data.userName || data.name || "Client",
          phone: data.phone,
          profilePic: data.profilePic,
        },
        userName: data.userName || data.name || "Client",
        channelName: data.channelName,
        token: data.token || data.agoraToken,
        uid: Number(data.uid || data.agoraUid) || 2,
        userId: data.userId || data.user?.id,
        problem: data.problem || "Voice Call Consultation",
        maxDurationSeconds:
          Number(data.maxDurationSeconds || data.maxDuration) || 1500,
      });
    } else {
      setIncomingRequestRef.current?.({
        type: "chat",
        consultationId,
        roomId: data.roomId || consultationId,
        user: data.user || {
          id: data.userId,
          name: data.userName || data.name || "Client",
          profilePic: data.profilePic,
        },
        userId: data.userId || data.user?.id,
        userName: data.userName || data.name || "Client",
        problem: data.problem || "Chat Consultation",
        amount: data.amount,
        maxDurationMinutes: data.maxDurationMinutes,
        maxDurationSeconds:
          Number(
            data.maxDurationSeconds ||
              (data.maxDurationMinutes ? data.maxDurationMinutes * 60 : 900),
          ),
        birthDetails: data.birthDetails || data.clientBirthDetails || null,
        gender: data?.gender || data?.user?.gender,
        dob: data?.dob || data?.user?.dob,
        tob: data?.tob || data?.user?.tob,
        pob: data?.pob || data?.birthPlace || data?.user?.pob || data?.user?.city,
        lat: data?.lat || data?.user?.lat,
        lon: data?.lon || data?.user?.lon,
        timezone: data?.timezone || data?.user?.timezone,
      });
    }
  };

  useEffect(() => {
    let unsubscribeTokenRefresh;
    let unsubscribeNotificationOpened;

    // 1. Foreground FCM push received
    const unsubscribeForegroundMessage = onMessage(
      messagingInstance,
      async (remoteMessage) => {
        const type = remoteMessage?.data?.type?.toUpperCase();
        if (type !== "CALL_REQUEST" && type !== "CHAT_REQUEST") return;

        try {
          await store
            .dispatch(
              chatApi.endpoints.getConsultationHistory.initiate(
                { page: 1, limit: 10, status: "waiting" },
                { forceRefetch: true, subscribe: false },
              ),
            )
            .unwrap();
        } catch (error) {
          console.error(
            LOG_TAG,
            "Could not refresh incoming requests after foreground push:",
            error,
          );
        }
      },
    );

    // 2. Notifee Foreground Notification Click Listener
    const unsubscribeNotifeeForeground = notifee.onForegroundEvent(
      ({ type, detail }) => {
        if (type === EventType.PRESS && detail.notification?.data) {
          console.log(LOG_TAG, "Notifee notification pressed:", detail.notification.data);
          handleIncomingPayload(detail.notification.data);
        }
      },
    );

    // 3. Notifee Cold Start (App launched from killed state by clicking notification)
    notifee.getInitialNotification().then((initial) => {
      if (initial?.notification?.data) {
        console.log(LOG_TAG, "Notifee initial notification pressed:", initial.notification.data);
        setTimeout(() => handleIncomingPayload(initial.notification.data), 800);
      }
    });

    // 4. Firebase Messaging Notification Opened App Listener
    try {
      unsubscribeNotificationOpened = onNotificationOpenedApp(
        messagingInstance,
        (remoteMessage) => {
          if (remoteMessage?.data) {
            console.log(LOG_TAG, "FCM notification opened app:", remoteMessage.data);
            handleIncomingPayload(remoteMessage.data);
          }
        },
      );

      getInitialNotification(messagingInstance).then((remoteMessage) => {
        if (remoteMessage?.data) {
          console.log(LOG_TAG, "FCM initial notification opened app:", remoteMessage.data);
          setTimeout(() => handleIncomingPayload(remoteMessage.data), 800);
        }
      });
    } catch (_err) {}

    setupPromiseRef.current = (async () => {
      await setupNotificationChannels();
      await notifee.requestPermission();
    })();

    const setupTokenRefreshListener = async () => {
      try {
        await setupPromiseRef.current;
        unsubscribeTokenRefresh = onTokenRefresh(
          messagingInstance,
          async (fcmToken) => {
            const user = await getStoredUser();
            if (!user?.token) return;

            try {
              await syncFcmToken(fcmToken, user.token);
              registeredFcmTokenRef.current = fcmToken;
            } catch (error) {
              console.error(LOG_TAG, "Could not sync refreshed FCM token:", error);
            }
          },
        );
      } catch (error) {
        console.error(LOG_TAG, "Push notification setup failed:", error);
      }
    };

    setupTokenRefreshListener();

    return () => {
      unsubscribeTokenRefresh?.();
      unsubscribeForegroundMessage();
      unsubscribeNotifeeForeground();
      unsubscribeNotificationOpened?.();
    };
  }, []);

  useEffect(() => {
    let active = true;

    const registerToken = async () => {
      try {
        await setupPromiseRef.current;

        const user = await getStoredUser();
        if (!active) return;
        if (!user?.token) {
          registeredFcmTokenRef.current = null;
          return;
        }

        const fcmToken = await getToken(messagingInstance);
        if (!active || !fcmToken || fcmToken === registeredFcmTokenRef.current) {
          return;
        }

        await syncFcmToken(fcmToken, user.token);
        if (active) registeredFcmTokenRef.current = fcmToken;
      } catch (error) {
        console.error(LOG_TAG, "Could not register FCM token:", error);
      }
    };

    registerToken();

    return () => {
      active = false;
    };
  }, [segments]);

  return children;
}
