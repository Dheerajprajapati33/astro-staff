import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Typography from "../../constants/Typography";
import { hp, RF, wp } from "../../utils/responsive";

const ORANGE = "#ff6a00";
const GREEN = "#16a34a";

export default function CurrentCallCard() {
  return (
    <View style={styles.card}>
      <View style={styles.iconOuter}>
        <View style={styles.iconCircle}>
          <Ionicons name="call" size={RF(30)} color="#fff" />
        </View>
        <View style={styles.onlineDot} />
      </View>

      <View style={{ flex: 1 }}>
        <Text style={styles.status}>You are currently on a call</Text>

        <Text style={styles.client}>
          Current Client: <Text style={styles.bold}>Riya Sharma</Text>
        </Text>

        <View style={styles.row}>
          <Ionicons name="time-outline" size={RF(13)} color={GREEN} />
          <Text style={styles.time}>Call Started: 10:25 AM</Text>
        </View>
      </View>

      <Text style={styles.sparkle}>✦</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: wp(4),
    marginTop: hp(2),
    borderWidth: 1,
    borderColor: "#ffd7b8",
    backgroundColor: "#fff7ef",
    borderRadius: wp(3),
    padding: wp(3.2),
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  iconOuter: {
    width: wp(17),
    height: wp(17),
    borderRadius: wp(8.5),
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginRight: wp(4),
  },
  iconCircle: {
    width: wp(14),
    height: wp(14),
    borderRadius: wp(7),
    backgroundColor: ORANGE,
    alignItems: "center",
    justifyContent: "center",
  },
  onlineDot: {
    position: "absolute",
    right: wp(1),
    bottom: wp(1.5),
    width: wp(3.5),
    height: wp(3.5),
    borderRadius: wp(2),
    backgroundColor: GREEN,
    borderWidth: 2,
    borderColor: "#fff",
  },
  status: {
    fontSize: RF(21),
    color: ORANGE,
    fontWeight: "900",
    fontFamily: Typography?.bold,
  },
  client: {
    marginTop: hp(0.8),
    fontSize: RF(17),
    color: "#1f2937",
    fontWeight: "700",
    fontFamily: Typography?.bold,
  },
  bold: {
    fontWeight: "900",
    fontFamily: Typography?.bold,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: hp(1),
  },
  time: {
    marginLeft: wp(1),
    fontSize: RF(17),
    color: "#1f2937",
    fontWeight: "700",
    fontFamily: Typography?.bold,
  },
  sparkle: {
    position: "absolute",
    right: wp(4),
    top: hp(1.5),
    color: "#ffb066",
    fontSize: RF(23.5),
  },
});