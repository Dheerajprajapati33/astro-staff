import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useGetContentQuery } from "../../redux/contentApi";
import Typography from "../../constants/Typography";
import { hp, RF, wp } from "../../utils/responsive";

const ORANGE = "#ff6a00";

export default function Refund() {
  const { data, isLoading } = useGetContentQuery("refund_policy");

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safe}>
        <ActivityIndicator size="large" color={ORANGE} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={RF(24)} color={ORANGE} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>{data?.title || "Refund Policy"}</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        <View style={styles.iconBox}>
          <Ionicons
            name="refresh-circle-outline"
            size={RF(42)}
            color={ORANGE}
          />
        </View>

        <Text style={styles.title}>{data?.title}</Text>

        <View style={styles.card}>
          <Text style={styles.content}>
            {data?.content || "Refund policy content not available"}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#fff",
  },

  header: {
    height: hp(6.5),
    backgroundColor: "#fff",
    paddingHorizontal: wp(4),
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },

  headerTitle: {
    color: "#1f2937",
    fontSize: RF(18),
    fontWeight: "900",
    fontFamily: Typography?.bold,
    marginLeft: wp(3),
  },

  container: {
    padding: wp(3.2),
    paddingBottom: hp(5),
  },

  iconBox: {
    width: wp(22),
    height: wp(22),
    borderRadius: wp(11),
    backgroundColor: "#fff3ea",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginTop: hp(2),
  },

  title: {
    textAlign: "center",
    marginTop: hp(1.5),
    fontSize: RF(16),
    color: "#111827",
    fontWeight: "900",
    fontFamily: Typography?.bold,
  },

  card: {
    marginTop: hp(2),
    padding: wp(3.2),
    backgroundColor: "#fff8f3",
    borderRadius: wp(3),
    borderWidth: 1,
    borderColor: "#ffe1cc",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },

  content: {
    fontSize: RF(11),
    color: "#374151",
    lineHeight: hp(2.4),
    fontWeight: "700",
    fontFamily: Typography?.bold,
  },
});
