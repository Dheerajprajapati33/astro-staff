import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import Colors from "../../constants/Colors";
import { hp, RF, wp } from "../../utils/responsive";

export default function MessageBubble({ message, isOwnMessage, onRetry }) {
  const status = message?.status;
  const isFailed = status === "failed";

  const Wrapper = isFailed ? TouchableOpacity : View;

  return (
    <Wrapper
      style={isOwnMessage ? styles.rightBubble : styles.leftBubble}
      {...(isFailed
        ? { activeOpacity: 0.7, onPress: () => onRetry?.(message) }
        : {})}
    >
      <Text style={styles.text}>{message?.message}</Text>

      {isFailed ? (
        <Text style={styles.failedText}>Failed to send · Tap to retry</Text>
      ) : status === "sending" ? (
        <Text style={isOwnMessage ? styles.rightTime : styles.leftTime}>
          Sending…
        </Text>
      ) : (
        <Text style={isOwnMessage ? styles.rightTime : styles.leftTime}>
          {message?.createdAt
            ? new Date(message.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            : ""}
        </Text>
      )}
    </Wrapper>
  );
}

const styles = StyleSheet.create({
  leftBubble: {
    maxWidth: "85%",
    alignSelf: "flex-start",
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    borderRadius: wp(3),
    padding: wp(4),
    marginBottom: hp(1.5),
  },

  rightBubble: {
    maxWidth: "85%",
    alignSelf: "flex-end",
    backgroundColor: "#fff6f0",
    borderRadius: wp(3),
    padding: wp(4),
    marginBottom: hp(1.5),
  },

  text: {
    fontSize: RF(16),
    color: Colors.darkBrown,
    lineHeight: RF(16) * 1.35,
    fontWeight: "700",
  },

  leftTime: {
    color: Colors.textGray,
    fontSize: RF(12),
    marginTop: hp(0.6),
    fontWeight: "700",
  },

  rightTime: {
    color: Colors.textGray,
    fontSize: RF(12),
    marginTop: hp(0.6),
    textAlign: "right",
    fontWeight: "700",
  },

  failedText: {
    color: "#dc2626",
    fontSize: RF(12),
    marginTop: hp(0.6),
    textAlign: "right",
    fontWeight: "700",
  },
});
