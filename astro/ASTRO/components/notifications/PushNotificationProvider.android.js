import { useEffect, useRef } from "react";
import {
  getMessaging,
  getToken,
  onTokenRefresh,
} from "@react-native-firebase/messaging";
import notifee from "@notifee/react-native";
import { useSegments } from "expo-router";

import { getStoredUser } from "../../utils/auth";
import { BASE_URL } from "../../config/api";
import { setupNotificationChannels } from "../../services/notifications";

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
  const setupPromiseRef = useRef(null);
  const registeredFcmTokenRef = useRef(null);

  useEffect(() => {
    let unsubscribeTokenRefresh;

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
