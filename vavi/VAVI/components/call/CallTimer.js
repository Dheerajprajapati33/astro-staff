// components/call/CallTimer.js
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Colors from "../../constants/Colors";
import { RF, wp, hp } from "../../utils/responsive";

export default function CallTimer({ secondsLeft }) {
  const formatTime = (seconds) => {
    if (seconds == null || isNaN(seconds)) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const isLowTime = secondsLeft != null && secondsLeft <= 60;

  return (
    <View style={[styles.container, isLowTime && styles.lowTimeContainer]}>
      <View style={[styles.dot, isLowTime && styles.lowTimeDot]} />
      <Text style={[styles.timerText, isLowTime && styles.lowTimeText]}>
        {formatTime(secondsLeft)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.06)",
    paddingHorizontal: wp(3.5),
    paddingVertical: hp(0.6),
    borderRadius: wp(5),
    alignSelf: "center",
  },
  lowTimeContainer: {
    backgroundColor: "rgba(220, 38, 38, 0.12)",
  },
  dot: {
    width: wp(2),
    height: wp(2),
    borderRadius: wp(1),
    backgroundColor: "#16a34a",
    marginRight: wp(1.8),
  },
  lowTimeDot: {
    backgroundColor: "#dc2626",
  },
  timerText: {
    fontSize: RF(16),
    fontWeight: "700",
    color: Colors.darkBrown || "#333",
  },
  lowTimeText: {
    color: "#dc2626",
  },
});
