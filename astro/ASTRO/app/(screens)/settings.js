import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Typography from "../../constants/Typography";
import { hp, RF, wp } from "../../utils/responsive";
import { performClientLogout } from "../../utils/auth";

const ORANGE = "#ff6a00";
const RED = "#ff2d2d";

const settingsData = [
  { title: "About Us", icon: "information-circle-outline", route: "/about" },
  {
    title: "Terms & Conditions",
    icon: "document-text-outline",
    route: "/terms",
  },
  {
    title: "Privacy Policy",
    icon: "shield-checkmark-outline",
    route: "/privacy",
  },
  { title: "Refund Policy", icon: "refresh-circle-outline", route: "/refund" },
  // { title: "FAQs", icon: "help-circle-outline", route: "/faqs" },
  { title: "Contact Us", icon: "headset-outline", route: "/contact" },
];
const handleLogout = async () => {
  try {
    await performClientLogout();

    Alert.alert("Logout Successful", "You have been logged out.");
  } catch (error) {
    console.log("LOGOUT ERROR:", error);

    Alert.alert("Error", "Unable to logout");
  }
};

export default function Settings() {
  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={RF(24)} color={ORANGE} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.card}>
          {settingsData.map((item, index) => (
            <SettingItem
              key={item.title}
              item={item}
              isLast={index === settingsData.length - 1}
            />
          ))}
        </View>

        <View style={styles.logoutCard}>
          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.itemRow}
            onPress={handleLogout}
          >
            <View style={styles.iconCircle}>
              <Ionicons name="log-out-outline" size={RF(22)} color={RED} />
            </View>

            <Text style={[styles.itemText, { color: RED }]}>Logout</Text>

            <Ionicons name="chevron-forward" size={RF(18)} color="#111827" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const SettingItem = ({ item, isLast }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      style={[styles.itemRow, !isLast && styles.borderBottom]}
      onPress={() => router.push(item.route)}
    >
      <View style={styles.iconCircle}>
        <Ionicons name={item.icon} size={RF(22)} color={ORANGE} />
      </View>

      <Text style={styles.itemText}>{item.title}</Text>

      <Ionicons name="chevron-forward" size={RF(18)} color="#111827" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    height: hp(6.5),
    backgroundColor: "#fff",
    paddingHorizontal: wp(4),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  headerTitle: {
    color: "#1f2937",
    fontSize: RF(20),
    fontWeight: "900",
    fontFamily: Typography?.bold,
    marginLeft: wp(3),
  },
  content: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: wp(3.2),
    paddingTop: hp(2),
  },
  card: {
    borderWidth: 1,
    borderColor: "#f1f1f1",
    borderRadius: wp(3),
    backgroundColor: "#fff",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  logoutCard: {
    borderWidth: 1,
    borderColor: "#f1f1f1",
    borderRadius: wp(3),
    backgroundColor: "#fff",
    overflow: "hidden",
    marginTop: hp(2),
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  itemRow: {
    height: hp(7.4),
    paddingHorizontal: wp(4),
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: "#f1f1f1",
  },
  iconCircle: {
    width: wp(10),
    height: wp(10),
    borderRadius: wp(4.25),
    backgroundColor: "#fff3ec",
    alignItems: "center",
    justifyContent: "center",
    marginRight: wp(4),
  },
  itemText: {
    flex: 1,
    color: "#111827",
    fontSize: RF(16),
    fontWeight: "800",
    fontFamily: Typography?.bold,
  },
});
