import React from "react";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { router } from "expo-router";

import Colors from "../../constants/Colors";import { hp, wp, RF } from "../../utils/responsive";

export default function ConsultHeader() {
  return (
    <View style={styles.container}>

      {/* Left Menu */}

      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.menuButton}
      >
        <Ionicons
          name="menu"
          size={RF(28)}
          color={Colors.darkBrown}
        />
      </TouchableOpacity>

      {/* Logo */}

      <View style={styles.logoContainer}>

        <Text style={styles.logo}>
          VAVI
        </Text>

        <Text style={styles.tagline}>
          Your Future Guide
        </Text>

      </View>

      {/* Right Buttons */}

      <View style={styles.rightContainer}>

        {/* Add Cash */}

        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.cashButton}
          onPress={() => router.push("/Wallet")}
        >

          <Ionicons
            name="wallet-outline"
            size={RF(17)}
            color={Colors.primary}
          />

          <Text style={styles.cashText}>
            Add Cash
          </Text>

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

          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              3
            </Text>
          </View>

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

    fontSize: RF(28),

    fontWeight: "700",
  },

  tagline: {
    marginTop: -hp(0.5),

    color: "#63A04B",

    fontSize: RF(10),

    fontWeight: "500",
  },

  rightContainer: {
    flexDirection: "row",

    alignItems: "center",
  },

  cashButton: {
    flexDirection: "row",

    alignItems: "center",

    backgroundColor: "#FFF",

    borderWidth: 1,

    borderColor: "#FFD9BE",

    paddingHorizontal: wp(3),

    height: hp(4.8),

    borderRadius: wp(3),

    marginRight: wp(2),
  },

  cashText: {
    marginLeft: wp(1),

    color: Colors.darkBrown,

    fontSize: RF(12),

    fontWeight: "500",
  },

  bellButton: {
    position: "relative",
  },

  badge: {
    position: "absolute",

    top: -3,

    right: -4,

    width: wp(4),

    height: wp(4),

    borderRadius: wp(2),

    backgroundColor: "#FF3B30",

    justifyContent: "center",

    alignItems: "center",
  },

  badgeText: {
    color: "#FFF",

    fontSize: RF(8),

    fontWeight: "700",
  },
});