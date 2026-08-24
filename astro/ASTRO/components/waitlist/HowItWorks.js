import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Typography from "../../constants/Typography";
import { hp, RF, wp } from "../../utils/responsive";

const GREEN = "#16a34a";

export default function HowItWorks() {
  return (
    <View style={styles.card}>
      <View style={styles.left}>
        <View style={styles.titleRow}>
          <Ionicons name="information-circle-outline" size={RF(22)} color={GREEN} />
          <Text style={styles.title}>How Waitlist Works</Text>
        </View>

        <Text style={styles.text}>
          When you are on a call, clients who want to connect with you will join
          the waitlist.
        </Text>

        <Text style={styles.text}>You can notify them once you are free.</Text>
      </View>

      <Text style={styles.hourglass}>⌛</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: hp(0.5),
    borderWidth: 1,
    marginHorizontal: wp(4),
    borderColor: "#d8f3df",
    backgroundColor: "#f2fff5",
    borderRadius: wp(3),
    padding: wp(3.2),
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hp(1.5),
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  left: {
    flex: 1,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hp(0.8),
  },
  title: {
    marginLeft: wp(2),
    color: GREEN,
    fontSize: RF(18),
    fontWeight: "900",
    fontFamily: Typography?.bold,
  },
  text: {
    fontSize: RF(16),
    color: "#1f2937",
    lineHeight: hp(1.9),
    fontWeight: "700",
    fontFamily: Typography?.bold,
  },
  hourglass: {
    fontSize: RF(73),
    marginLeft: wp(2),
  },
});