import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import Colors from "../../constants/Colors";import { hp, wp, RF } from "../../utils/responsive";

export default function WalletHeader() {
  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Ionicons
          name="arrow-back"
          size={RF(24)}
          color={Colors.darkBrown}
        />
      </TouchableOpacity>

      {/* Title */}
      <Text style={styles.title}>
        Wallet Transaction
      </Text>

      {/* Empty View for Center Alignment */}
      <View style={styles.placeholder} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: hp(7),
    paddingHorizontal: wp(4),

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    

    borderBottomWidth: 1,
    borderBottomColor: "#F2F2F2",
  },

  backButton: {
    width: wp(10),
    height: wp(10),

    justifyContent: "center",
    alignItems: "center",

    borderRadius: wp(5),
  },

  title: {
    flex: 1,

    textAlign: "center",

    color: Colors.darkBrown,

    fontSize: RF(18),

    fontWeight: "600",
  },

  placeholder: {
    width: wp(10),
  },
});