import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useSegments } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Colors from "../../constants/Colors";
import { hp, wp, RF } from "../../utils/responsive";
import { useGetWalletBalanceQuery } from "../../redux/walletApi";

export default function ConsultHeader() {
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
      {/* Left Menu */}
      <TouchableOpacity activeOpacity={0.8} style={styles.menuButton}>
        <Ionicons name="menu" size={RF(28)} color={Colors.darkBrown} />
      </TouchableOpacity>

      {/* Logo */}
      <View style={styles.logoContainer}>
        <Text style={styles.logo}>VAVI</Text>
        <Text style={styles.tagline}>Your Future Guide</Text>
      </View>

      {/* Right Buttons */}
      <View style={styles.rightContainer}>
        {/* Wallet Pill Button */}
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.walletPill}
          onPress={() => router.push("/Wallet")}
        >
          <Ionicons name="wallet-outline" size={RF(17)} color="#ffffff" />
          <Text style={styles.walletBalanceText}>₹{balance}</Text>
        </TouchableOpacity>

        {/* Notification */}
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.bellButton}
          onPress={() => router.push("/Notification")}
        >
          <Ionicons
            name="notifications-outline"
            size={RF(23)}
            color={Colors.darkBrown}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: hp(1),
    paddingHorizontal: wp(4),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  menuButton: {
    width: wp(10),
    alignItems: "flex-start",
  },

  logoContainer: {
    flex: 1,
    alignItems: "center",
  },

  logo: {
    color: Colors.primary,
    fontSize: RF(24),
    fontWeight: "700",
  },

  tagline: {
    marginTop: -hp(0.5),
    color: "#63A04B",
    fontSize: RF(9),
    fontWeight: "500",
  },

  rightContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  walletPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#22c55e",
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.6),
    borderRadius: wp(5),
    marginRight: wp(2),
  },

  walletBalanceText: {
    marginLeft: wp(1.5),
    color: "#ffffff",
    fontSize: RF(13),
    fontWeight: "700",
  },

  bellButton: {
    position: "relative",
  },
});