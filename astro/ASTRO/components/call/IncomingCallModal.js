// components/call/IncomingCallModal.js
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import Typography from "../../constants/Typography";
import { RF, hp, wp } from "../../utils/responsive";

const GREEN = "#16a34a";
const RED = "#dc2626";

export default function IncomingCallModal({ request, onAccept, onDecline }) {
  const visible = !!request;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (visible) {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.15,
            duration: 700,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 700,
            useNativeDriver: true,
          }),
        ]),
      );
      pulse.start();
      return () => pulse.stop();
    }
  }, [visible, pulseAnim]);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.iconOuter}>
            <Animated.View
              style={[
                styles.pulseRing,
                {
                  transform: [{ scale: pulseAnim }],
                },
              ]}
            />
            <View style={styles.iconCircle}>
              <Ionicons name="call" size={RF(32)} color="#fff" />
            </View>
          </View>

          <Text style={styles.callBadge}>INCOMING VOICE CALL</Text>
          <Text style={styles.title}>{request?.userName || "Client"}</Text>

          {!!request?.problem && (
            <Text style={styles.problem}>Topic: {request.problem}</Text>
          )}

          <Text style={styles.subtext}>
            Estimated Max Duration: {Math.floor((request?.maxDurationSeconds || 1500) / 60)} mins
          </Text>

          <View style={styles.actionRow}>
            <TouchableOpacity
              style={[styles.actionBtn, styles.declineBtn]}
              activeOpacity={0.85}
              onPress={onDecline}
            >
              <Ionicons name="call" size={RF(20)} color="#fff" style={styles.declineIcon} />
              <Text style={styles.declineText}>Decline</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionBtn, styles.acceptBtn]}
              activeOpacity={0.85}
              onPress={onAccept}
            >
              <Ionicons name="call" size={RF(20)} color="#fff" />
              <Text style={styles.acceptText}>Accept Call</Text>
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
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: wp(6),
  },
  card: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: wp(5),
    padding: wp(6),
    alignItems: "center",
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },
  iconOuter: {
    width: wp(24),
    height: wp(24),
    borderRadius: wp(12),
    alignItems: "center",
    justifyContent: "center",
    marginBottom: hp(2),
    position: "relative",
  },
  pulseRing: {
    position: "absolute",
    width: wp(24),
    height: wp(24),
    borderRadius: wp(12),
    backgroundColor: "rgba(22, 163, 74, 0.2)",
  },
  iconCircle: {
    width: wp(18),
    height: wp(18),
    borderRadius: wp(9),
    backgroundColor: GREEN,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
  },
  callBadge: {
    fontSize: RF(12),
    fontWeight: "700",
    color: "#6B7280",
    letterSpacing: 1.2,
    marginBottom: hp(0.5),
  },
  title: {
    fontSize: RF(24),
    color: "#111827",
    fontWeight: "900",
    fontFamily: Typography?.bold,
    marginBottom: hp(0.5),
  },
  problem: {
    fontSize: RF(15),
    color: "#4B5563",
    fontWeight: "600",
    textAlign: "center",
    marginBottom: hp(0.5),
  },
  subtext: {
    fontSize: RF(13),
    color: "#9CA3AF",
    marginBottom: hp(2.5),
  },
  actionRow: {
    flexDirection: "row",
    width: "100%",
    gap: wp(4),
  },
  actionBtn: {
    flex: 1,
    height: hp(6.5),
    borderRadius: wp(3.5),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: wp(2),
  },
  declineBtn: {
    backgroundColor: RED,
  },
  declineIcon: {
    transform: [{ rotate: "135deg" }],
  },
  declineText: {
    fontSize: RF(16),
    fontWeight: "800",
    color: "#fff",
  },
  acceptBtn: {
    backgroundColor: GREEN,
  },
  acceptText: {
    fontSize: RF(16),
    fontWeight: "800",
    color: "#fff",
  },
});
