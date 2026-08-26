import React, { useState } from "react";
import {
  ActivityIndicator,
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

const QUICK_TAGS = [
  "Accurate Prediction 🎯",
  "Helpful Remedies 🪔",
  "Polite & Patient 😇",
  "Clear Explanation 💡",
  "Life Changing Guidance ✨",
];

export default function PostConsultationReviewModal({
  visible,
  onClose,
  astrologer,
  consultationId,
  onSubmitReview,
}) {
  const [rating, setRating] = useState(5);
  const [selectedTags, setSelectedTags] = useState([]);
  const [reviewText, setReviewText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!astrologer && !consultationId) return null;

  const name = astrologer?.name || astrologer?.astrologerName || "Astrologer";
  const imageUri = astrologer?.profilePic || astrologer?.astrologerImage || "";

  const imageSource = imageUri
    ? resolveImageUri(imageUri)
    : require("../../assets/images/background.png");

  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const fullReview = selectedTags.length > 0
        ? `${selectedTags.join(", ")}${reviewText ? ` - ${reviewText.trim()}` : ""}`
        : reviewText.trim() || "Great consultation session!";

      await onSubmitReview?.({
        astrologerId: astrologer?.id || astrologer?.astrologerId,
        consultationId,
        rating,
        review: fullReview,
      });
      onClose();
    } catch (e) {
      console.log("[PostConsultationReviewModal] Error submitting review:", e);
      onClose();
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

          {/* Close / Skip button */}
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Ionicons name="close" size={RF(18)} color="#666" />
          </TouchableOpacity>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            {/* Header info */}
            <View style={styles.headerBlock}>
              <Image source={imageSource} style={styles.avatar} />
              <Text style={styles.title}>Rate Your Consultation</Text>
              <Text style={styles.subTitle}>How was your session with {name}?</Text>
            </View>

            {/* Stars Row */}
            <View style={styles.starsRow}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity
                  key={star}
                  onPress={() => setRating(star)}
                  activeOpacity={0.7}
                  style={styles.starBtn}
                >
                  <Ionicons
                    name={star <= rating ? "star" : "star-outline"}
                    size={RF(34)}
                    color="#FFB300"
                  />
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.ratingLabel}>
              {rating === 5
                ? "Excellent Consultation! 🌟"
                : rating === 4
                ? "Very Good Session 👍"
                : rating === 3
                ? "Good / Average 👌"
                : rating === 2
                ? "Below Expectations 👎"
                : "Poor Experience 😞"}
            </Text>

            {/* Quick Feedback Tags */}
            <Text style={styles.sectionLabel}>What did you like most?</Text>
            <View style={styles.tagsContainer}>
              {QUICK_TAGS.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <TouchableOpacity
                    key={tag}
                    style={[styles.tagChip, isSelected && styles.tagChipActive]}
                    onPress={() => toggleTag(tag)}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.tagChipText, isSelected && styles.tagChipTextActive]}>
                      {tag}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Feedback Input */}
            <Text style={styles.sectionLabel}>Write Feedback (Optional)</Text>
            <TextInput
              style={styles.reviewInput}
              placeholder="Share your experience to help the astrologer..."
              placeholderTextColor="#999"
              multiline
              numberOfLines={3}
              value={reviewText}
              onChangeText={setReviewText}
            />

            {/* Submit and Skip buttons */}
            <TouchableOpacity
              style={[styles.submitBtn, isSubmitting && { opacity: 0.75 }]}
              onPress={handleSubmit}
              disabled={isSubmitting}
              activeOpacity={0.88}
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.submitBtnText}>Submit Rating & Review</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity style={styles.skipBtn} onPress={onClose} activeOpacity={0.7}>
              <Text style={styles.skipBtnText}>Skip for now</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
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
    paddingBottom: hp(3.5),
    maxHeight: hp(85),
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
    width: wp(7.5),
    height: wp(7.5),
    borderRadius: wp(3.75),
    backgroundColor: "#f0f0f0",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  scrollContent: {
    paddingBottom: hp(2),
  },
  headerBlock: {
    alignItems: "center",
    marginVertical: hp(1),
  },
  avatar: {
    width: wp(16),
    height: wp(16),
    borderRadius: wp(8),
    borderWidth: 2,
    borderColor: ORANGE,
    marginBottom: hp(1),
  },
  title: {
    fontSize: RF(17),
    fontWeight: "800",
    color: "#222",
  },
  subTitle: {
    fontSize: RF(12),
    color: "#666",
    marginTop: hp(0.3),
  },
  starsRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: wp(3),
    marginVertical: hp(1.5),
  },
  starBtn: {
    padding: wp(1),
  },
  ratingLabel: {
    textAlign: "center",
    fontSize: RF(12),
    fontWeight: "700",
    color: ORANGE,
    marginBottom: hp(1.5),
  },
  sectionLabel: {
    fontSize: RF(11.5),
    fontWeight: "700",
    color: "#444",
    marginBottom: hp(0.8),
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: wp(2),
    marginBottom: hp(1.5),
  },
  tagChip: {
    backgroundColor: "#F5F5F7",
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.7),
    borderRadius: wp(4),
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },
  tagChipActive: {
    backgroundColor: "#FFF3E0",
    borderColor: ORANGE,
  },
  tagChipText: {
    fontSize: RF(10.5),
    fontWeight: "600",
    color: "#555",
  },
  tagChipTextActive: {
    color: ORANGE,
    fontWeight: "700",
  },
  reviewInput: {
    backgroundColor: "#F9F9FB",
    borderRadius: wp(3),
    borderWidth: 1,
    borderColor: "#E5E5E5",
    padding: wp(3),
    fontSize: RF(12),
    color: "#222",
    textAlignVertical: "top",
    minHeight: hp(8),
    marginBottom: hp(2),
  },
  submitBtn: {
    backgroundColor: ORANGE,
    borderRadius: wp(3.5),
    paddingVertical: hp(1.6),
    alignItems: "center",
    justifyContent: "center",
  },
  submitBtnText: {
    color: "#fff",
    fontSize: RF(13.5),
    fontWeight: "800",
  },
  skipBtn: {
    alignItems: "center",
    paddingVertical: hp(1.2),
    marginTop: hp(0.5),
  },
  skipBtnText: {
    fontSize: RF(11.5),
    color: "#888",
    fontWeight: "600",
  },
});
