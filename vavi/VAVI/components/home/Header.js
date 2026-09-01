import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import Colors from "../../constants/Colors";
import { hp, RF, wp } from "../../utils/responsive";
import { useGetWalletBalanceQuery } from "../../redux/walletApi";

export default function Header() {
  const { data: balanceData } = useGetWalletBalanceQuery(undefined, {
    pollingInterval: 10000,
  });

  const rawBalance = balanceData?.data?.balance ?? balanceData?.balance ?? 0;
  const balance = Number(rawBalance) || 0;

  return (
    <View style={styles.container}>
      {/* Wallet Pill Button (InstaAstro Style) */}
      <TouchableOpacity
        style={styles.walletPill}
        onPress={() => router.push("/Wallet")}
        activeOpacity={0.8}
      >
        <Ionicons name="wallet-outline" size={RF(22)} color="#ffffff" />
        <Text style={styles.walletBalanceText}>₹{balance}</Text>
      </TouchableOpacity>

      {/* Logo */}
      <View style={styles.logoContainer} pointerEvents="none">
        <Image
          source={require("../../assets/images/icon.png")}
          style={styles.logoMark}
          resizeMode="contain"
        />
      </View>

      {/* Right Icons */}
      <View style={styles.rightIcons}>
        {/* Notification */}
        <TouchableOpacity
          onPress={() => router.push("/Notification")}
          activeOpacity={0.8}
        >
          <Ionicons
            name="notifications-outline"
            size={RF(24)}
            color={Colors.darkBrown}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: hp(2),
    paddingHorizontal: wp(5),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  walletPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#22c55e",
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.9),
    borderRadius: wp(5),
    zIndex: 20,
  },

  walletBalanceText: {
    color: "#ffffff",
    fontSize: RF(16),
    fontWeight: "700",
    marginLeft: wp(1.5),
  },

  logoContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
  },

  logoMark: {
    width: RF(48),
    height: RF(48),
    borderRadius: 10,
  },

  rightIcons: {
    flexDirection: "row",
    alignItems: "center",
  },
});
