import { Stack } from "expo-router";
import { StatusBar } from "react-native";
import { Provider } from "react-redux";

import { store } from "../redux/store";
import ChatRequestProvider from "../components/chat/ChatRequestProvider";
import CallRequestProvider from "../components/call/CallRequestProvider";
import PushNotificationProvider from "../components/notifications/PushNotificationProvider";

export default function RootLayout() {
  return (
    <Provider store={store}>
      <PushNotificationProvider>
        <ChatRequestProvider>
          <CallRequestProvider>
            <StatusBar barStyle="dark-content" />
            <Stack
              screenOptions={{
                headerShown: false,
                gestureEnabled: true,
                fullScreenGestureEnabled: true,
                animation: "slide_from_right",
              }}
            />
          </CallRequestProvider>
        </ChatRequestProvider>
      </PushNotificationProvider>
    </Provider>
  );
}
