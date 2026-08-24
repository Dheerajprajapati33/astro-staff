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

export default function WalletBottomBanner() {
  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <View style={styles.iconBox}>
          <Ionicons
            name="wallet-outline"
            size={RF(24)}
            color={Colors.primary}
          />
        </View>

        <View>
          <Text style={styles.title}>
            Need More Balance?
          </Text>

          <Text style={styles.subtitle}>
            Recharge your wallet instantly.
          </Text>
        </View>
      </View>

     <TouchableOpacity
  style={styles.button}
  activeOpacity={0.8}
  onPress={() => router.push("/Refer")}
>
  <Text style={styles.buttonText}>
    Refer
  </Text>
</TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: wp(4),
    marginVertical: hp(2),

    backgroundColor: "#FFF4ED",

    borderRadius: wp(4),

    padding: wp(4),

    flexDirection: "row",

    justifyContent: "space-between",

    alignItems: "center",
  },

  left: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  iconBox: {
    width: wp(13),
    height: wp(13),

    borderRadius: wp(6.5),

    backgroundColor: "#FFE8DB",

    justifyContent: "center",
    alignItems: "center",

    marginRight: wp(3),
  },

  title: {
    fontSize: RF(15),
    color: Colors.darkBrown,
    fontWeight: "600",
  },

  subtitle: {
    marginTop: hp(0.3),

    fontSize: RF(12),

    color: Colors.textGray,

    fontWeight: "400",
  },

  button: {
    backgroundColor: Colors.primary,

    borderRadius: wp(3),

    paddingHorizontal: wp(5),

    paddingVertical: hp(1),
  },

  buttonText: {
    color: Colors.white,
    fontSize: RF(13),
    fontWeight: "600",
  },
});