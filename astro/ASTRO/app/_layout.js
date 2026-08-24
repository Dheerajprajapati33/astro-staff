import { Stack } from "expo-router";
import { StatusBar } from "react-native";
import { Provider } from "react-redux";

import { store } from "../redux/store";
import ChatRequestProvider from "../components/chat/ChatRequestProvider";
import CallRequestProvider from "../components/call/CallRequestProvider";

export default function RootLayout() {
  return (
    <Provider store={store}>
      <ChatRequestProvider>
        <CallRequestProvider>
          <StatusBar barStyle="dark-content" />
          <Stack screenOptions={{ headerShown: false }} />
        </CallRequestProvider>
      </ChatRequestProvider>
    </Provider>
  );
}
