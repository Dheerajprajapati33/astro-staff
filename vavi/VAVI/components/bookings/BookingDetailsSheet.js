import React, { useState } from "react";
import {
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { resolveImageUri } from "../../config/api";
import { RF, hp, wp } from "../../utils/responsive";

const ORANGE = "#ff6a00";

export default function BookingDetailsSheet({
  visible,
  onClose,
  booking,
  mode = "details", // "details" | "rate"
  onSubmitRating,
}) {
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!booking) return null;

  const astrologer = booking?.astrologer || booking?.astrologerUser || booking?.user || {};
  const name = astrologer?.name || booking?.astrologerName || "Astrologer";
  const imageUri = astrologer?.profilePic || booking?.astrologerImage || "";
  const type = (booking?.type || booking?.consultationType || "call").toLowerCase();
  const status = (booking?.status || "completed").toLowerCase();
  const amount = booking?.amount ?? booking?.totalAmount ?? booking?.fee ?? 0;
  const duration = booking?.duration ?? booking?.durationSeconds ?? 0;
  const ratePerMin = booking?.ratePerMinute || booking?.pricePerMinute || 25;
  const problem = booking?.problem || booking?.topic || astrologer?.expertises?.[0]?.name || "Horoscope Guidance";
  const consultationId = booking?.id || booking?.consultationId || `VAVI-${Date.now().toString().slice(-6)}`;

  const formatDuration = (secs) => {
    if (!secs || isNaN(secs)) return "00:00 mins";
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m} mins ${s > 0 ? `${s} secs` : ""}`;
  };

  const imageSource = imageUri
    ? resolveImageUri(imageUri)
    : require("../../assets/images/background.png");

  const handleSubmitReview = async () => {
    setIsSubmitting(true);
    try {
      await onSubmitRating?.({
        consultationId: booking?.id,
        astrologerId: astrologer?.id,
        rating,
        review: reviewText,
      });
      onClose();
    } catch (e) {
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />

        <View style={styles.sheetContainer}>
          {/* Handle bar */}
          <View style={styles.handleBar} />

          {/* Close button */}
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Ionicons name="close" size={RF(20)} color="#666" />
          </TouchableOpacity>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Header info */}
            <View style={styles.headerBlock}>
              <Image source={imageSource} style={styles.avatar} />
              <Text style={styles.astrologerName}>{name}</Text>
              <Text style={styles.problemTag}>{problem}</Text>
            </View>

            {mode === "details" ? (
              /* ==================================================
                 DETAILS / INVOICE VIEW
                 ================================================== */
              <View style={styles.detailsBody}>
                <Text style={styles.sectionTitle}>Consultation Receipt</Text>

                <View style={styles.receiptCard}>
                  <View style={styles.receiptRow}>
                    <Text style={styles.receiptLbl}>Booking ID</Text>
                    <Text style={styles.receiptValId} numberOfLines={1}>{consultationId}</Text>
                  </View>

                  <View style={styles.receiptDivider} />

                  <View style={styles.receiptRow}>
                    <Text style={styles.receiptLbl}>Consultation Mode</Text>
                    <Text style={styles.receiptVal}>
                      {type === "chat" ? "1:1 Live Chat" : type === "video_call" ? "2-Way Zoom Video Call" : "Voice Call"}
                    </Text>
                  </View>

                  <View style={styles.receiptRow}>
                    <Text style={styles.receiptLbl}>Duration</Text>
                    <Text style={styles.receiptVal}>{formatDuration(duration)}</Text>
                  </View>

                  <View style={styles.receiptRow}>
                    <Text style={styles.receiptLbl}>Rate per Minute</Text>
                    <Text style={styles.receiptVal}>₹{ratePerMin}/min</Text>
                  </View>

                  <View style={styles.receiptRow}>
                    <Text style={styles.receiptLbl}>Status</Text>
                    <Text style={[styles.receiptVal, { color: status === "completed" ? "#2E7D32" : ORANGE, fontWeight: "700" }]}>
                      {status.toUpperCase()}
                    </Text>
                  </View>

                  <View style={styles.receiptDivider} />

                  <View style={styles.receiptTotalRow}>
                    <Text style={styles.totalLbl}>Total Deducted</Text>
                    <Text style={styles.totalVal}>₹{amount}</Text>
                  </View>
                </View>

                <View style={styles.guaranteeBox}>
                  <Ionicons name="shield-checkmark" size={RF(18)} color="#4CAF50" />
                  <Text style={styles.guaranteeText}>
                    100% Confidential & Secure Consultation Guarantee.
                  </Text>
                </View>
              </View>
            ) : (
              /* ==================================================
                 RATE & REVIEW VIEW
                 ================================================== */
              <View style={styles.rateBody}>
                <Text style={styles.sectionTitle}>Rate Your Experience</Text>
                <Text style={styles.rateSub}>How was your session with {name}?</Text>

                {/* Stars */}
                <View style={styles.starsRow}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <TouchableOpacity
                      key={star}
                      onPress={() => setRating(star)}
                      activeOpacity={0.7}
                    >
                      <Ionicons
                        name={star <= rating ? "star" : "star-outline"}
                        size={RF(32)}
                        color="#FFB300"
                      />
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Review Text Input */}
                <TextInput
                  style={styles.reviewInput}
                  placeholder="Write feedback for the astrologer (optional)..."
                  placeholderTextColor="#999"
                  multiline
                  numberOfLines={4}
                  value={reviewText}
                  onChangeText={setReviewText}
                />

                <TouchableOpacity
                  style={[styles.submitBtn, isSubmitting && { opacity: 0.7 }]}
                  onPress={handleSubmitReview}
                  disabled={isSubmitting}
                  activeOpacity={0.88}
                >
                  <Text style={styles.submitBtnText}>
                    {isSubmitting ? "Submitting..." : "Submit Review"}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  sheetContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: wp(6),
    borderTopRightRadius: wp(6),
    paddingHorizontal: wp(5),
    paddingTop: hp(1.5),
    paddingBottom: hp(4),
    maxHeight: hp(75),
  },
  handleBar: {
    width: wp(12),
    height: hp(0.5),
    borderRadius: wp(1),
    backgroundColor: "#ddd",
    alignSelf: "center",
    marginBottom: hp(1),
  },
  closeBtn: {
    position: "absolute",
    top: hp(1.8),
    right: wp(4),
    width: wp(8),
    height: wp(8),
    borderRadius: wp(4),
    backgroundColor: "#f0f0f0",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  headerBlock: {
    alignItems: "center",
    marginVertical: hp(1.5),
  },
  avatar: {
    width: wp(16),
    height: wp(16),
    borderRadius: wp(8),
    borderWidth: 2,
    borderColor: ORANGE,
    marginBottom: hp(1),
  },
  astrologerName: {
    fontSize: RF(16),
    fontWeight: "700",
    color: "#222",
  },
  problemTag: {
    fontSize: RF(11.5),
    color: "#777",
    marginTop: hp(0.3),
  },
  sectionTitle: {
    fontSize: RF(14),
    fontWeight: "700",
    color: "#333",
    marginBottom: hp(1.5),
  },
  receiptCard: {
    backgroundColor: "#F9F9FB",
    borderRadius: wp(4),
    padding: wp(4),
    borderWidth: 1,
    borderColor: "#EAEAEA",
  },
  receiptRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: hp(0.8),
  },
  receiptLbl: {
    fontSize: RF(11.5),
    color: "#666",
  },
  receiptVal: {
    fontSize: RF(12),
    fontWeight: "600",
    color: "#222",
  },
  receiptValId: {
    fontSize: RF(11),
    fontWeight: "600",
    color: "#555",
    maxWidth: wp(45),
  },
  receiptDivider: {
    height: 1,
    backgroundColor: "#E5E5E5",
    marginVertical: hp(0.8),
  },
  receiptTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: hp(0.8),
  },
  totalLbl: {
    fontSize: RF(13),
    fontWeight: "700",
    color: "#222",
  },
  totalVal: {
    fontSize: RF(16),
    fontWeight: "800",
    color: ORANGE,
  },
  guaranteeBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E8F8EE",
    borderRadius: wp(3),
    padding: wp(3),
    marginTop: hp(2),
    gap: wp(2),
  },
  guaranteeText: {
    fontSize: RF(10.5),
    color: "#2E7D32",
    fontWeight: "500",
    flex: 1,
  },

  // Rating styles
  rateBody: {
    alignItems: "center",
    paddingVertical: hp(1),
  },
  rateSub: {
    fontSize: RF(12),
    color: "#777",
    marginBottom: hp(2),
  },
  starsRow: {
    flexDirection: "row",
    gap: wp(3),
    marginBottom: hp(2.5),
  },
  reviewInput: {
    width: "100%",
    backgroundColor: "#F9F9FB",
    borderRadius: wp(3),
    borderWidth: 1,
    borderColor: "#E5E5E5",
    padding: wp(3),
    fontSize: RF(12),
    color: "#333",
    textAlignVertical: "top",
    minHeight: hp(12),
    marginBottom: hp(2),
  },
  submitBtn: {
    width: "100%",
    backgroundColor: ORANGE,
    borderRadius: wp(3),
    paddingVertical: hp(1.6),
    alignItems: "center",
  },
  submitBtnText: {
    color: "#fff",
    fontSize: RF(13),
    fontWeight: "700",
  },
});
