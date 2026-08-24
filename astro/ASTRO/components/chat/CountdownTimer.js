import { StyleSheet, Text } from "react-native";

import { RF } from "../../utils/responsive";

// Purely presentational: formats a secondsLeft value owned and ticked by the
// parent (Chat). The countdown itself lives up there because it needs to be
// resynced from wall-clock (consultation start + maxDuration) whenever
// history refetches, not just decremented locally — a local-only interval
// understates the remaining time after any period the JS thread was frozen
// (backgrounded app), since setInterval doesn't fire during that time but
// real time keeps passing.
const formatTime = (totalSeconds) => {
  if (totalSeconds == null || totalSeconds < 0) return "--";

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const parts = [];
  if (hours > 0) parts.push(`${hours} hr`);
  if (hours > 0 || minutes > 0) parts.push(`${minutes} min${minutes === 1 ? "" : "s"}`);
  parts.push(`${seconds} sec${seconds === 1 ? "" : "s"}`);

  return parts.join(" ");
};

export default function CountdownTimer({ secondsLeft }) {
  return <Text style={styles.text}>{formatTime(secondsLeft)}</Text>;
}

const styles = StyleSheet.create({
  text: {
    fontSize: RF(11),
    fontWeight: "700",
    color: "#ff6a00",
  },
});
