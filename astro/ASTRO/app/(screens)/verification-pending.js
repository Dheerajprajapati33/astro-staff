import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import Typography from "../../constants/Typography";
import { hp, RF, wp } from "../../utils/responsive";
import { performClientLogout } from "../../utils/auth";

import { useGetProfileQuery } from "../../redux/ProfileApi";

const ORANGE = "#ff6a00";

export default function VerificationPending() {
  const { data: profile, isFetching, refetch } = useGetProfileQuery();

  const handleCheckStatus = async () => {
    try {
      const result = await refetch();

      console.log("LATEST PROFILE:", result?.data);

      if (result?.data?.verified === true) {
        const oldUser = await AsyncStorage.getItem("userData");

        const parsedUser = oldUser ? JSON.parse(oldUser) : {};

        const updatedUser = {
          ...parsedUser,

          ...result.data,

          token: parsedUser?.token,
        };

        await AsyncStorage.setItem(
          "userData",

          JSON.stringify(updatedUser),
        );

        Alert.alert("Account Verified", "Your account has been approved.");

        router.replace("/(tabs)");
      } else {
        Alert.alert(
          "Pending",
          "Your account is still waiting for admin approval.",
        );
      }
    } catch (error) {
      console.log("CHECK STATUS ERROR:", error);
    }
  };

  const handleLogout = async () => {
    await performClientLogout();
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.iconBox}>
          <Ionicons
            name="shield-checkmark-outline"
            size={RF(55)}
            color={ORANGE}
          />
        </View>

        <Text style={styles.title}>Verification Pending</Text>

        <Text style={styles.description}>
          Your account has been created successfully.
          {"\n\n"}
          Our admin team will verify your profile.
          {"\n"}
          Once approved, you will get access to your dashboard.
        </Text>

        <View style={styles.infoCard}>
          <Ionicons name="time-outline" size={RF(22)} color={ORANGE} />

          <Text style={styles.infoText}>Waiting for admin approval...</Text>
        </View>

        <TouchableOpacity
          style={styles.refreshBtn}
          onPress={handleCheckStatus}
          disabled={isFetching}
        >
          {isFetching ? (
            <ActivityIndicator color={ORANGE} />
          ) : (
            <>
              <Ionicons name="refresh-outline" size={RF(18)} color={ORANGE} />

              <Text style={styles.refreshText}>Check Status</Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={RF(18)} color="#fff" />

          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#fff",
  },

  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: wp(6),
  },

  iconBox: {
    width: wp(28),
    height: wp(28),
    borderRadius: wp(14),
    backgroundColor: "#fff4ec",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: hp(3),
  },

  title: {
    fontSize: RF(19),
    color: "#111827",
    fontWeight: "900",
    fontFamily: Typography?.bold,
    textAlign: "center",
  },

  description: {
    marginTop: hp(1.5),
    fontSize: RF(11),
    color: "#6b7280",
    textAlign: "center",
    lineHeight: RF(20),
    fontWeight: "700",
    fontFamily: Typography?.bold,
  },

  infoCard: {
    marginTop: hp(3),
    width: "100%",
    padding: wp(3.2),
    borderRadius: wp(3),
    backgroundColor: "#fff8f2",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  infoText: {
    marginLeft: wp(2),
    color: ORANGE,
    fontSize: RF(12),
    fontWeight: "800",
    fontFamily: Typography?.bold,
  },

  refreshBtn: {
    marginTop: hp(2),
    height: hp(5.5),
    width: "100%",
    borderWidth: 1,
    borderColor: ORANGE,
    borderRadius: wp(3),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: wp(2),
  },

  refreshText: {
    color: ORANGE,
    fontSize: RF(14),
    fontWeight: "800",
    fontFamily: Typography?.bold,
  },

  logoutBtn: {
    marginTop: hp(2),
    width: "100%",
    height: hp(6),
    backgroundColor: ORANGE,
    borderRadius: wp(3),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: wp(2),
  },

  logoutText: {
    color: "#fff",
    fontSize: RF(14),
    fontWeight: "800",
    fontFamily: Typography?.bold,
  },

  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  loadingText: {
    marginTop: hp(2),
    color: "#777",
    fontSize: RF(11),
    fontWeight: "700",
    fontFamily: Typography?.bold,
  },
});
