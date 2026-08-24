import { Ionicons } from "@expo/vector-icons";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Typography from "../../constants/Typography";
import { hp, RF, wp } from "../../utils/responsive";

const ORANGE = "#ff6a00";
const GREEN = "#16a34a";
const RED = "#dc2626";

export default function IncomingChatModal({ request, onAccept, onDecline }) {
  const visible = !!request;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.iconOuter}>
            <View style={styles.iconCircle}>
              <Ionicons name="chatbubble-ellipses" size={RF(30)} color="#fff" />
            </View>
            <View style={styles.onlineDot} />
          </View>

          <Text style={styles.title}>New Chat Request</Text>

          <Text style={styles.client}>
            From: <Text style={styles.bold}>{request?.userName || "User"}</Text>
          </Text>

          {!!request?.problem && (
            <Text style={styles.problem}>Topic: {request.problem}</Text>
          )}

          <View style={styles.actionRow}>
            <TouchableOpacity
              style={[styles.actionBtn, styles.declineBtn]}
              activeOpacity={0.85}
              onPress={onDecline}
            >
              <Ionicons name="close" size={RF(18)} color={RED} />
              <Text style={[styles.actionText, { color: RED }]}>Decline</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionBtn, styles.acceptBtn]}
              activeOpacity={0.85}
              onPress={onAccept}
            >
              <Ionicons name="checkmark" size={RF(18)} color="#fff" />
              <Text style={[styles.actionText, { color: "#fff" }]}>
                Accept Chat
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: wp(6),
  },
  card: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: wp(4),
    padding: wp(4.2),
    alignItems: "center",
  },
  iconOuter: {
    width: wp(20),
    height: wp(20),
    borderRadius: wp(10),
    backgroundColor: "#fff7ef",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: hp(1.5),
  },
  iconCircle: {
    width: wp(16),
    height: wp(16),
    borderRadius: wp(8),
    backgroundColor: ORANGE,
    alignItems: "center",
    justifyContent: "center",
  },
  onlineDot: {
    position: "absolute",
    right: wp(1.5),
    bottom: wp(1.5),
    width: wp(4),
    height: wp(4),
    borderRadius: wp(2),
    backgroundColor: GREEN,
    borderWidth: 2,
    borderColor: "#fff",
  },
  title: {
    fontSize: RF(22),
    color: "#111827",
    fontWeight: "900",
    fontFamily: Typography?.bold,
    marginBottom: hp(0.8),
  },
  client: {
    fontSize: RF(17.5),
    color: "#1f2937",
    fontWeight: "700",
    fontFamily: Typography?.bold,
  },
  bold: {
    fontWeight: "900",
    fontFamily: Typography?.bold,
  },
  problem: {
    marginTop: hp(0.6),
    fontSize: RF(16),
    color: "#607086",
    fontWeight: "700",
    fontFamily: Typography?.bold,
    textAlign: "center",
  },
  actionRow: {
    flexDirection: "row",
    marginTop: hp(2.5),
    width: "100%",
    gap: wp(3),
  },
  actionBtn: {
    flex: 1,
    height: hp(6),
    borderRadius: wp(3),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: wp(1.5),
  },
  declineBtn: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: RED,
  },
  acceptBtn: {
    backgroundColor: GREEN,
  },
  actionText: {
    fontSize: RF(18),
    fontWeight: "800",
    fontFamily: Typography?.bold,
  },
});
