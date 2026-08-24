import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";

import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { resolveImageUri } from "../../config/api";
import Typography from "../../constants/Typography";
import { hp, RF, wp } from "../../utils/responsive";

import {
  useAddReviewReplyMutation,
  useGetReviewsQuery,
} from "../../redux/ReviewApi";

const ORANGE = "#ff6a00";
const GREEN = "#22a855";

export default function Reviews() {
  const [activeReplyId, setActiveReplyId] = useState(null);
  const [showInfo, setShowInfo] = useState(false);

  const {
    data,

    isLoading,

    refetch,
  } = useGetReviewsQuery();

  const [addReply, { isLoading: replyLoading }] = useAddReviewReplyMutation();

  const reviews = data?.reviews || [];

  const astrologer = data?.astrologer || {};

  const ratingSummary = data?.ratingSummary || {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  };

  const handleReply = async (reviewId, reply) => {
    if (!reply.trim()) return;

    try {
      await addReply({
        reviewId,

        reply,
      }).unwrap();

      setActiveReplyId(null);

      refetch();
    } catch (error) {
      console.log("REPLY ERROR", error);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ActivityIndicator size="large" color={ORANGE} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={RF(24)} color={ORANGE} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>My Reviews</Text>

        <TouchableOpacity
          style={styles.helpButton}
          onPress={() => setShowInfo((prev) => !prev)}
        >
          <Ionicons name="help-circle-outline" size={RF(22)} color={ORANGE} />
        </TouchableOpacity>
      </View>

      {showInfo && (
        <View style={styles.infoDropdown}>
          <View style={styles.infoDropdownIcon}>
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={RF(20)}
              color={ORANGE}
            />
          </View>
          <Text style={styles.infoDropdownText}>
            Reviews from your clients. Reply to build trust and show{"\n"}
            you value their feedback.
          </Text>
        </View>
      )}

      <FlatList
        data={reviews}
        keyExtractor={(item) => item.id.toString()}
        refreshing={isLoading}
        onRefresh={refetch}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <>
            <RatingCard
              rating={astrologer?.rating || "0.0"}
              total={astrologer?.totalReviews || 0}
              ratingSummary={ratingSummary}
            />

            <View style={styles.filterRow}>
              <TouchableOpacity style={styles.filterBox}>
                <Ionicons
                  name="calendar-outline"
                  size={RF(16)}
                  color="#607086"
                />

                <Text style={styles.filterText}>All Time</Text>

                <Ionicons name="chevron-down" size={RF(16)} color="#607086" />
              </TouchableOpacity>

              {/* <TouchableOpacity style={styles.filterBox}>
                <Ionicons name="filter-outline" size={RF(16)} color={ORANGE} />

                <Text
                  style={[
                    styles.filterText,
                    {
                      color: ORANGE,
                    },
                  ]}
                >
                  Filter
                </Text>
              </TouchableOpacity> */}
            </View>
          </>
        }
        renderItem={({ item }) => (
          <ReviewCard
            item={item}
            activeReplyId={activeReplyId}
            setActiveReplyId={setActiveReplyId}
            handleReply={handleReply}
            replyLoading={replyLoading}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={RF(45)}
              color="#ccc"
            />

            <Text style={styles.emptyText}>No Reviews Yet</Text>

            <Text style={styles.emptySub}>
              Your client reviews will appear here
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}
const RatingCard = ({ rating, total, ratingSummary }) => {
  const bars = [
    ["5", ratingSummary?.[5] || 0],

    ["4", ratingSummary?.[4] || 0],

    ["3", ratingSummary?.[3] || 0],

    ["2", ratingSummary?.[2] || 0],

    ["1", ratingSummary?.[1] || 0],
  ];

  return (
    <View style={styles.ratingCard}>
      <View style={styles.ratingLeft}>
        <View style={styles.starCircle}>
          <Ionicons name="star" size={RF(38)} color={ORANGE} />
        </View>
      </View>

      <View style={styles.ratingMid}>
        <Text style={styles.overall}>Overall Rating</Text>

        <View style={styles.ratingNumberRow}>
          <Text style={styles.ratingNumber}>{rating}</Text>

          <View style={{ marginLeft: wp(2) }}>
            <StarRow rating={Math.round(Number(rating))} size={RF(14)} />
          </View>
        </View>

        <Text style={styles.based}>Based on {total} reviews</Text>
      </View>

      <View style={styles.barBox}>
        {bars.map((item) => {
          return (
            <View key={item[0]} style={styles.barRow}>
              <Text style={styles.barLabel}>{item[0]}</Text>

              <Ionicons name="star" size={RF(9)} color={ORANGE} />

              <View style={styles.barTrack}>
                <View
                  style={[
                    styles.barFill,

                    {
                      width: total ? `${(item[1] / total) * 100}%` : "0%",
                    },
                  ]}
                />
              </View>

              <Text style={styles.barCount}>{item[1]}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const ReviewCard = ({
  item,
  activeReplyId,
  setActiveReplyId,
  handleReply,
  replyLoading,
}) => {
  const [replyText, setReplyText] = useState("");

  const isReplyOpen = activeReplyId === item.id;

  return (
    <View style={styles.reviewCard}>
      <View style={styles.reviewTop}>
        <Image
          source={resolveImageUri(item?.profilePic) || require("../../assets/images/banner.png")}
          style={styles.avatar}
        />

        <View style={styles.reviewContent}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>
              {item?.user?.name || item?.name || "User"}
            </Text>

            <Text style={styles.date}>
              {item?.createdAt
                ? new Date(item.createdAt).toLocaleDateString()
                : ""}
            </Text>
          </View>

          <View style={styles.reviewMeta}>
            <StarRow rating={item?.rating || 0} size={RF(13)} />

            <View style={styles.verifiedBadge}>
              <Ionicons name="shield-checkmark" size={RF(10)} color={GREEN} />

              <Text style={styles.verifiedText}>Verified Client</Text>
            </View>

            <Ionicons name="ellipsis-vertical" size={RF(16)} color="#607086" />
          </View>

          <Text style={styles.reviewText}>
            {item?.comment || item?.review || "No review"}
          </Text>
        </View>
      </View>

      {item?.reply ? (
        <View style={styles.replyBox}>
          <View style={styles.replyHeader}>
            <Text style={styles.replyTitle}>Reply by You</Text>

            <Text style={styles.replyDate}>
              {item?.updatedAt
                ? new Date(item.updatedAt).toLocaleDateString()
                : ""}
            </Text>
          </View>

          <Text style={styles.replyText}>{item.reply}</Text>

          <TouchableOpacity
            style={styles.editReplyRow}
            onPress={() => setActiveReplyId(item.id)}
          >
            <Ionicons name="pencil-outline" size={RF(12)} color={GREEN} />

            <Text style={styles.editReplyText}>Edit Reply</Text>
          </TouchableOpacity>
        </View>
      ) : isReplyOpen ? (
        <ReplyInput
          value={replyText}
          setValue={setReplyText}
          loading={replyLoading}
          onPost={() => {
            handleReply(
              item.id,

              replyText,
            );
          }}
        />
      ) : (
        <TouchableOpacity
          style={styles.writeReplyBtn}
          onPress={() => setActiveReplyId(item.id)}
        >
          <Text style={styles.writeReplyText}>Write a Reply</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const ReplyInput = ({ value, setValue, onPost, loading }) => {
  return (
    <View style={styles.inputReplyBox}>
      <Text style={styles.writeReplyText}>Write a Reply</Text>

      <TextInput
        placeholder="Type your reply..."
        placeholderTextColor="#9ca3af"
        multiline
        value={value}
        onChangeText={setValue}
        style={styles.replyInput}
      />

      <View style={styles.inputFooter}>
        <Text style={styles.charCount}>{value.length}/500 characters</Text>

        <TouchableOpacity
          style={styles.postBtn}
          disabled={loading}
          onPress={onPost}
        >
          <Text style={styles.postText}>
            {loading ? "Posting..." : "Post Reply"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const StarRow = ({ rating, size }) => {
  return (
    <View style={styles.starRow}>
      {Array.from({
        length: 5,
      }).map((_, index) => (
        <Ionicons
          key={index}
          name="star"
          size={size}
          color={index < rating ? ORANGE : "#d1d5db"}
        />
      ))}
    </View>
  );
};
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
    alignItems: "center",
    justifyContent: "flex-start",
  },

  headerTitle: {
    color: "#1f2937",
    fontSize: RF(20),
    fontWeight: "900",
    fontFamily: Typography?.bold,
    marginLeft: wp(3),
  },

  helpButton: {
    marginLeft: "auto",
  },

  infoDropdown: {
    marginHorizontal: wp(4),
    marginTop: hp(1),
    marginBottom: hp(0.5),
    borderWidth: 1,
    borderColor: "#ffe1cc",
    borderRadius: wp(3),
    backgroundColor: "#fff8f3",
    padding: wp(3.2),
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },

  infoDropdownIcon: {
    width: wp(9),
    height: wp(9),
    borderRadius: wp(4.5),
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginRight: wp(3),
  },

  infoDropdownText: {
    flex: 1,
    fontSize: RF(10.5),
    color: "#4b5563",
    lineHeight: hp(1.9),
    fontWeight: "700",
    fontFamily: Typography?.bold,
  },

  list: {
    backgroundColor: "#fff",
    paddingHorizontal: wp(3.2),
    paddingTop: hp(2),
    paddingBottom: hp(4),
    minHeight: hp(92),
  },

  ratingCard: {
    minHeight: hp(13),
    borderWidth: 1,
    borderColor: "#ffe1cc",
    borderRadius: wp(3),
    backgroundColor: "#fffaf5",
    padding: wp(2.5),
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hp(1.5),
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },

  ratingLeft: {
    marginRight: wp(3),
  },

  starCircle: {
    width: wp(16),
    height: wp(16),
    borderRadius: wp(8),
    backgroundColor: "#fff1e6",
    alignItems: "center",
    justifyContent: "center",
  },

  ratingMid: {
    flex: 1,
  },

  overall: {
    fontSize: RF(16),
    color: "#111827",
    fontWeight: "900",
    fontFamily: Typography?.bold,
  },

  ratingNumberRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: hp(0.4),
  },

  ratingNumber: {
    fontSize: RF(24.5),
    color: ORANGE,
    fontWeight: "900",
    fontFamily: Typography?.bold,
  },

  based: {
    fontSize: RF(14),
    color: "#607086",
    marginTop: hp(0.4),
    fontWeight: "700",
    fontFamily: Typography?.bold,
  },

  barBox: {
    width: wp(28),
  },

  barRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hp(0.45),
  },

  barLabel: {
    fontSize: RF(9.5),
    color: "#111827",
    fontWeight: "700",
    fontFamily: Typography?.bold,
  },

  barTrack: {
    flex: 1,
    height: hp(0.6),
    backgroundColor: "#e5e7eb",
    borderRadius: wp(2),
    marginHorizontal: wp(1),
    overflow: "hidden",
  },

  barFill: {
    height: "100%",
    backgroundColor: ORANGE,
    borderRadius: wp(2),
  },

  barCount: {
    width: wp(7),
    fontSize: RF(9.5),
    color: "#111827",
    textAlign: "right",
    fontWeight: "700",
    fontFamily: Typography?.bold,
  },

  starRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  filterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: hp(1.5),
  },

  filterBox: {
    width: wp(43.5),
    height: hp(5),
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: wp(2),
    paddingHorizontal: wp(3),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  filterText: {
    flex: 1,
    marginLeft: wp(2),
    color: "#374151",
    fontSize: RF(11),
    fontWeight: "700",
    fontFamily: Typography?.bold,
  },

  reviewCard: {
    borderWidth: 1,
    borderColor: "#f1f1f1",
    borderRadius: wp(3),
    backgroundColor: "#fff",
    padding: wp(2.5),
    marginBottom: hp(1.5),
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },

  reviewTop: {
    flexDirection: "row",
  },

  avatar: {
    width: wp(12),
    height: wp(12),
    borderRadius: wp(6),
    marginRight: wp(3),
  },

  reviewContent: {
    flex: 1,
  },

  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  name: {
    fontSize: RF(13),
    color: "#111827",
    fontWeight: "900",
    fontFamily: Typography?.bold,
  },

  date: {
    fontSize: RF(9.5),
    color: "#607086",
    fontWeight: "700",
    fontFamily: Typography?.bold,
  },

  reviewMeta: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: hp(0.5),
    gap: wp(2),
  },

  verifiedBadge: {
    marginLeft: "auto",
    backgroundColor: "#eaffef",
    borderRadius: wp(1),
    paddingHorizontal: wp(2.5),
    paddingVertical: hp(0.8),
    flexDirection: "row",
    alignItems: "center",
    gap: wp(0.8),
  },

  verifiedText: {
    color: GREEN,
    fontSize: RF(9.5),
    fontWeight: "900",
    fontFamily: Typography?.bold,
  },

  reviewText: {
    fontSize: RF(11),
    color: "#374151",
    lineHeight: hp(1.9),
    marginTop: hp(1),
    fontWeight: "700",
    fontFamily: Typography?.bold,
  },

  replyBox: {
    marginLeft: wp(15),
    marginTop: hp(1.5),
    borderWidth: 1,
    borderColor: "#c8f5d4",
    backgroundColor: "#f2fff5",
    borderRadius: wp(2),
    padding: wp(2.5),
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },

  replyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: hp(0.8),
  },

  replyTitle: {
    color: GREEN,
    fontSize: RF(11),
    fontWeight: "900",
    fontFamily: Typography?.bold,
  },

  replyDate: {
    color: "#607086",
    fontSize: RF(9.5),
    fontWeight: "700",
    fontFamily: Typography?.bold,
  },

  replyText: {
    color: "#374151",
    fontSize: RF(11),
    lineHeight: hp(1.8),
    fontWeight: "700",
    fontFamily: Typography?.bold,
  },

  editReplyRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: hp(1),
  },

  editReplyText: {
    color: GREEN,
    fontSize: RF(10),
    fontWeight: "800",
    marginLeft: wp(1),
    fontFamily: Typography?.bold,
  },

  writeReplyBtn: {
    marginLeft: wp(15),
    marginTop: hp(1.2),
  },

  writeReplyText: {
    color: ORANGE,
    fontSize: RF(11),
    fontWeight: "900",
    fontFamily: Typography?.bold,
  },

  inputReplyBox: {
    marginLeft: wp(15),
    marginTop: hp(1.5),
    borderWidth: 1,
    borderColor: "#ffe1cc",
    backgroundColor: "#fff8f3",
    borderRadius: wp(2),
    padding: wp(2.5),
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },

  replyInput: {
    height: hp(9),
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: wp(1.5),
    backgroundColor: "#fff",
    marginTop: hp(1),
    padding: wp(2.5),
    textAlignVertical: "top",
    fontSize: RF(11),
    color: "#111827",
    fontWeight: "700",
    fontFamily: Typography?.bold,
  },

  inputFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: hp(0.8),
  },

  charCount: {
    color: "#607086",
    fontSize: RF(9.5),
    fontWeight: "700",
    fontFamily: Typography?.bold,
  },

  postBtn: {
    backgroundColor: ORANGE,
    borderRadius: wp(1.5),
    paddingHorizontal: wp(3),
    paddingVertical: hp(1),
  },

  postText: {
    color: "#fff",
    fontSize: RF(11),
    fontWeight: "900",
    fontFamily: Typography?.bold,
  },

  emptyBox: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: hp(6),
  },

  emptyText: {
    marginTop: hp(1),
    fontSize: RF(16),
    color: "#111827",
    fontWeight: "900",
    fontFamily: Typography?.bold,
  },

  emptySub: {
    marginTop: hp(0.5),
    fontSize: RF(14),
    color: "#607086",
    textAlign: "center",
    fontWeight: "700",
    fontFamily: Typography?.bold,
  },
});
