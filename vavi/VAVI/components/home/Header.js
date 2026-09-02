import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { router, useSegments } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import Colors from "../../constants/Colors";
import { hp, RF, wp } from "../../utils/responsive";
import { useGetWalletBalanceQuery } from "../../redux/walletApi";

export default function Header() {
  const segments = useSegments();
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const checkToken = async () => {
      try {
        const raw = await AsyncStorage.getItem("userData");
        const parsed = raw ? JSON.parse(raw) : null;
        if (isMounted) setHasToken(!!parsed?.token);
      } catch (_e) {
        if (isMounted) setHasToken(false);
      }
    };
    checkToken();
    return () => {
      isMounted = false;
    };
  }, [segments]);

  const { data: balanceData } = useGetWalletBalanceQuery(undefined, {
    skip: !hasToken || segments?.[0] === "(auth)",
  });

  const rawBalance =
    balanceData?.data?.balance ??
    balanceData?.balance ??
    balanceData?.data?.walletBalance ??
    0;
  const balance = Number(rawBalance) || 0;

  return (
    <View style={styles.container}>
      {/* Wallet Button */}
      <TouchableOpacity
        style={styles.walletPill}
        onPress={() => router.push("/Wallet")}
        activeOpacity={0.8}
      >
        <Ionicons name="wallet-outline" size={RF(20)} color="#ffffff" />
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
    paddingHorizontal: wp(3.5),
    paddingVertical: hp(0.8),
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
