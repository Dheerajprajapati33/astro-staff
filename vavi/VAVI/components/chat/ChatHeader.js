import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import Colors from "../../constants/Colors";
import { hp, RF, wp } from "../../utils/responsive";
import CountdownTimer from "./CountdownTimer";

const getInitials = (name) => {
  if (!name) return "A";

  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
};

export default function ChatHeader({
  astrologerName,
  isChatActive,
  chatEnded,
  secondsLeft,
  connectionStatus,
  onEndChat,
  onBack,
}) {
  const isReconnecting = connectionStatus && connectionStatus !== "connected";

  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.backButton}
        onPress={onBack}
      >
        <Ionicons name="chevron-back" size={RF(24)} color={Colors.primary} />
      </TouchableOpacity>

      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{getInitials(astrologerName)}</Text>
      </View>

      <View style={styles.titleContainer}>
        <Text style={styles.title} numberOfLines={1}>
          {astrologerName || "Astrologer"}
        </Text>

        <View style={styles.statusRow}>
          {chatEnded ? (
            <Text style={styles.subtitle}>Chat ended</Text>
          ) : isReconnecting ? (
            <Text style={styles.subtitle}>
              {connectionStatus === "reconnecting"
                ? "Reconnecting..."
                : "Connecting..."}
            </Text>
          ) : isChatActive ? (
            <Text style={styles.subtitle}>
              Live · <CountdownTimer secondsLeft={secondsLeft} /> left
            </Text>
          ) : (
            <Text style={styles.subtitle}>Waiting to connect...</Text>
          )}
        </View>
      </View>

      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.iconButton}
        onPress={onEndChat}
        disabled={chatEnded}
      >
        <Ionicons
          name="close-circle-outline"
          size={RF(22)}
          color={chatEnded ? "#c9c9c9" : "#dc2626"}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: hp(7),
    paddingHorizontal: wp(4),
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: "#f2f2f2",
  },

  backButton: {
    width: wp(8),
    height: wp(8),
    justifyContent: "center",
    alignItems: "center",
  },

  iconButton: {
    width: wp(10),
    height: wp(10),
    justifyContent: "center",
    alignItems: "center",
  },

  avatar: {
    width: wp(11),
    height: wp(11),
    borderRadius: wp(5.5),
    backgroundColor: "#fff1e8",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: wp(2),
    marginRight: wp(3),
  },

  avatarText: {
    color: Colors.primary,
    fontSize: RF(11.5),
    fontWeight: "900",
  },

  titleContainer: {
    flex: 1,
  },

  title: {
    fontSize: RF(16),
    color: Colors.darkBrown,
    fontWeight: "900",
  },

  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: hp(0.3),
  },

  subtitle: {
    fontSize: RF(10),
    color: Colors.textGray,
    marginLeft: wp(1),
    fontWeight: "700",
  },
});
