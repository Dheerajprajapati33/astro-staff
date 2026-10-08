import { Stack } from "expo-router";
import { StatusBar } from "react-native";
import { Provider } from "react-redux";

import { store } from "../redux/store";
import { SocketProvider } from "../src/context/SocketContext";
import PushNotificationProvider from "../components/notifications/PushNotificationProvider";

export default function RootLayout() {
  return (
    <Provider store={store}>
      <SocketProvider>
        <PushNotificationProvider>
          <StatusBar barStyle="dark-content" />
          <Stack
            screenOptions={{
              headerShown: false,
              gestureEnabled: true,
              fullScreenGestureEnabled: true,
              animation: "slide_from_right",
            }}
          />
        </PushNotificationProvider>
      </SocketProvider>
    </Provider>
  );
}
