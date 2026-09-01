import { Stack } from "expo-router";

import { Provider } from "react-redux";

import { store } from "../store/store";

export default function RootLayout() {
  return (
    <Provider store={store}>
      <Stack
        screenOptions={{
          headerShown: false,
          gestureEnabled: true,
          fullScreenGestureEnabled: true,
          animation: "slide_from_right",
        }}
      />
    </Provider>
  );
}
