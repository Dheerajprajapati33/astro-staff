import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import Colors from "../../constants/Colors";
import { resolveImageUri } from "../../config/api";
import { RF, hp, wp } from "../../utils/responsive";

const ORANGE = "#ff6a00";

export default function BookingCard({ item, onSelectDetails, onRate }) {
  const astrologer =
    item?.astrologer ||
    item?.astrologerUser ||
    item?.astrologerDetails ||
    item?.user ||
    {};
  const name =
    astrologer?.name ||
    astrologer?.fullName ||
    item?.astrologerName ||
    "Astrologer";
  const imageUri =
    astrologer?.profilePic ||
    astrologer?.profileImage ||
    astrologer?.image ||
    item?.astrologerImage ||
    "";
  const type = String(
    item?.type || item?.consultationType || item?.consultation_type || "call",
  ).toLowerCase();
  const status = String(item?.status || "completed").toLowerCase();
  const amount = item?.amount ?? item?.totalAmount ?? item?.fee ?? 0;
  const duration = item?.duration ?? item?.durationSeconds ?? 0;
  const problem =
    item?.problem ||
    item?.topic ||
    astrologer?.expertises?.[0]?.name ||
    "Consultation";
  const createdAt =
    item?.createdAt ||
    item?.date ||
    item?.updatedAt ||
    new Date().toISOString();

  // Format Date & Time
  const formatDate = (dateStr) => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return (
        d.toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }) +
        ", " +
        d.toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
      );
    } catch (e) {
      return dateStr;
    }
  };

  // Format Duration (e.g. 5m 30s or 15m)
  const formatDuration = (val) => {
    if (!val || isNaN(val)) return "0m";
    const num = Number(val);
    if (num <= 0) return "0m";
    if (num < 60) {
      return `${num}s`;
    }
    const mins = Math.floor(num / 60);
    const secs = num % 60;
    if (secs > 0 && mins < 60) {
      return `${mins}m ${secs}s`;
    }
    return `${mins}m`;
  };

  // Status Styling
  const getStatusBadge = () => {
    switch (status) {
      case "completed":
        return {
          label: "Completed",
          bg: "#E8F8EE",
          text: "#2E7D32",
          icon: "checkmark-circle",
        };
      case "ongoing":
        return {
          label: "Ongoing",
          bg: "#FFF4E5",
          text: ORANGE,
          icon: "radio-button-on",
        };
      case "missed":
      case "cancelled":
        return {
          label: "Cancelled",
          bg: "#FEECEB",
          text: "#D32F2F",
          icon: "close-circle",
        };
      default:
        return {
          label: status.toUpperCase(),
          bg: "#F0F0F0",
          text: "#666",
          icon: "information-circle",
        };
    }
  };

  const statusBadge = getStatusBadge();

  const handleReConsult = () => {
    if (astrologer?.id) {
      router.push({
        pathname: "/astrodetail",
        params: {
          id: astrologer.id,
          astrologerData: JSON.stringify(astrologer),
        },
      });
    } else {
      router.push("/(tabs)/");
    }
  };

  const imageSource =
    resolveImageUri(imageUri) ||
    require("../../assets/images/placeholder.jpeg");

  const userRating =
    item?.rating ||
    item?.review?.rating ||
    item?.userRating ||
    item?.reviewData?.rating;
  const userReviewText =
    item?.review?.review ||
    item?.review?.comment ||
    item?.reviewText ||
    item?.userReview;

  return (
    <View style={styles.card}>
      {/* Top Row: Astrologer Info & Status */}
      <View style={styles.topRow}>
        <View style={styles.astrologerInfo}>
          <Image source={imageSource} style={styles.avatar} />
          <View style={styles.nameBlock}>
            <View style={styles.nameRow}>
              <Text style={styles.name} numberOfLines={1}>
                {name}
              </Text>
              <Ionicons name="checkmark-circle" size={RF(14)} color="#4CAF50" />
            </View>
            <Text style={styles.problemText} numberOfLines={1}>
              {problem}
            </Text>
          </View>
        </View>

        {/* Status Badge */}
        <View style={[styles.statusBadge, { backgroundColor: statusBadge.bg }]}>
          <Ionicons
            name={statusBadge.icon}
            size={RF(11)}
            color={statusBadge.text}
          />
          <Text style={[styles.statusText, { color: statusBadge.text }]}>
            {statusBadge.label}
          </Text>
        </View>
      </View>

      <View style={styles.divider} />

      {/* Stats Details Row */}
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <View style={styles.statIconWrap}>
            <Ionicons
              name={
                type === "chat" ? "chatbubble-ellipses-outline" : "call-outline"
              }
              size={RF(13)}
              color={ORANGE}
            />
          </View>
          <View>
            <Text style={styles.statLabel}>Type</Text>
            <Text style={styles.statValue}>
              {type === "chat"
                ? "Chat"
                : type === "video_call"
                  ? "Video Call"
                  : "Voice Call"}
            </Text>
          </View>
        </View>

        <View style={styles.statItem}>
          <View style={styles.statIconWrap}>
            <Ionicons name="time-outline" size={RF(13)} color="#2196F3" />
          </View>
          <View>
            <Text style={styles.statLabel}>Duration</Text>
            <Text style={styles.statValue}>{formatDuration(duration)}</Text>
          </View>
        </View>

        <View style={styles.statItem}>
          <View style={styles.statIconWrap}>
            <Ionicons name="wallet-outline" size={RF(13)} color="#4CAF50" />
          </View>
          <View>
            <Text style={styles.statLabel}>Deducted</Text>
            <Text style={[styles.statValue, { color: "#2E7D32" }]}>
              ₹{amount}
            </Text>
          </View>
        </View>
      </View>

      {/* Date Row */}
      <View style={styles.dateRow}>
        <Ionicons name="calendar-outline" size={RF(11)} color="#888" />
        <Text style={styles.dateText}>{formatDate(createdAt)}</Text>
      </View>

      {/* Submitted Review Badge */}
      {!!userRating && (
        <View style={styles.reviewBanner}>
          <Ionicons name="star" size={RF(11)} color="#FFB300" />
          <Text style={styles.reviewRatingText}>{userRating}/5 ⭐</Text>
          {!!userReviewText && (
            <Text style={styles.reviewCommentText} numberOfLines={1}>
              "{userReviewText}"
            </Text>
          )}
        </View>
      )}

      {/* Bottom Actions Row */}
      <View style={styles.actionsRow}>
        <TouchableOpacity
          style={styles.detailsBtn}
          onPress={() => onSelectDetails?.(item)}
          activeOpacity={0.8}
        >
          <Ionicons name="receipt-outline" size={RF(13)} color="#555" />
          <Text style={styles.detailsBtnText}>Receipt</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.rateBtn, !!userRating && styles.ratedBtn]}
          onPress={() => onRate?.(item)}
          activeOpacity={0.8}
        >
          <Ionicons
            name={userRating ? "star" : "star-outline"}
            size={RF(13)}
            color={userRating ? "#2E7D32" : "#F57C00"}
          />
          <Text
            style={[styles.rateBtnText, !!userRating && styles.ratedBtnText]}
          >
            {userRating ? `${userRating}★ Rated` : "Rate"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.consultAgainBtn}
          onPress={handleReConsult}
          activeOpacity={0.85}
        >
          <Ionicons name="repeat-outline" size={RF(14)} color="#fff" />
          <Text style={styles.consultAgainText}>Consult Again</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: wp(4),
    padding: wp(4),
    marginBottom: hp(1.8),
    borderWidth: 1,
    borderColor: "#EFEFEF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  astrologerInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  avatar: {
    width: wp(12),
    height: wp(12),
    borderRadius: wp(6),
    backgroundColor: "#f5f5f5",
  },
  nameBlock: {
    marginLeft: wp(3),
    flex: 1,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(1),
  },
  name: {
    fontSize: RF(14),
    fontWeight: "700",
    color: "#222",
  },
  problemText: {
    fontSize: RF(11),
    color: "#777",
    marginTop: hp(0.2),
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: wp(2.5),
    paddingVertical: hp(0.5),
    borderRadius: wp(3),
    gap: wp(1),
  },
  statusText: {
    fontSize: RF(10),
    fontWeight: "700",
  },
  divider: {
    height: 1,
    backgroundColor: "#F2F2F2",
    marginVertical: hp(1.4),
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#F9F9FB",
    borderRadius: wp(3),
    paddingVertical: hp(1.2),
    paddingHorizontal: wp(3),
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(2),
  },
  statIconWrap: {
    width: wp(7.5),
    height: wp(7.5),
    borderRadius: wp(3.75),
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  statLabel: {
    fontSize: RF(9),
    color: "#888",
    fontWeight: "500",
  },
  statValue: {
    fontSize: RF(11.5),
    fontWeight: "700",
    color: "#333",
    marginTop: hp(0.1),
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(1.5),
    marginTop: hp(1.2),
  },
  dateText: {
    fontSize: RF(10.5),
    color: "#888",
    fontWeight: "500",
  },
  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: hp(1.5),
    gap: wp(2),
  },
  detailsBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: hp(1),
    borderRadius: wp(2.5),
    backgroundColor: "#F5F5F7",
    gap: wp(1),
  },
  detailsBtnText: {
    fontSize: RF(11),
    color: "#444",
    fontWeight: "600",
  },
  rateBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: hp(1),
    borderRadius: wp(2.5),
    backgroundColor: "#FFF8E1",
    gap: wp(1),
  },
  ratedBtn: {
    backgroundColor: "#E8F8EE",
  },
  rateBtnText: {
    fontSize: RF(11),
    color: "#E65100",
    fontWeight: "600",
  },
  ratedBtnText: {
    color: "#2E7D32",
  },
  reviewBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFBF0",
    paddingHorizontal: wp(2.5),
    paddingVertical: hp(0.6),
    borderRadius: wp(2),
    marginTop: hp(1),
    gap: wp(1.5),
    borderWidth: 1,
    borderColor: "#FFE082",
  },
  reviewRatingText: {
    fontSize: RF(10.5),
    fontWeight: "700",
    color: "#E65100",
  },
  reviewCommentText: {
    fontSize: RF(10),
    color: "#666",
    fontStyle: "italic",
    flex: 1,
  },
  consultAgainBtn: {
    flex: 1.5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: hp(1),
    borderRadius: wp(2.5),
    backgroundColor: ORANGE,
    gap: wp(1),
  },
  consultAgainText: {
    fontSize: RF(11),
    color: "#fff",
    fontWeight: "700",
  },
});
