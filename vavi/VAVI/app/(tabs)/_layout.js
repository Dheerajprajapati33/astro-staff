import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Colors from "../../constants/Colors";
import { hp, RF } from "../../utils/responsive";

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      initialRouteName="consult"
      screenOptions={{
        headerShown: false,

        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: "#A0A0A0",

        tabBarStyle: {
          height: hp(8) + insets.bottom,

          paddingTop: hp(1),
          paddingBottom: insets.bottom + 5,

          backgroundColor: Colors.white,

          borderTopWidth: 0,

          elevation: 15,
          shadowOpacity: 0.1,

          borderTopLeftRadius: 25,
          borderTopRightRadius: 25,
        },

        tabBarLabelStyle: {
          fontSize: RF(11),
        },
      }}
    >
      {/* TAB 1 → DISCOVER */}
      <Tabs.Screen
        name="consult"
        options={{
          title: "Discover",

          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="compass-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />

      {/* TAB 2 → CONSULT */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Consult",

          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />

      {/* TAB 3 → BOOKINGS */}
      <Tabs.Screen
        name="bookings"
        options={{
          title: "Bookings",

          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="calendar-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />

      {/* TAB 4 → PROFILE */}
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",

          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="person-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}