import { Ionicons } from "@expo/vector-icons";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import Colors from "../../constants/Colors";import { hp, RF, wp } from "../../utils/responsive";

export default function ReviewCard({
  astrologer = {},
}) {
  const reviews = Array.isArray(astrologer?.reviewsList)
    ? astrologer.reviewsList
    : Array.isArray(astrologer?.reviews)
      ? astrologer.reviews
      : [];

  const rating = Number(astrologer?.rating || 0);
  const totalReviews = Number(
    astrologer?.totalReviews || 0,
  );

  const ratingData = Array.isArray(
    astrologer?.ratingBreakdown,
  )
    ? astrologer.ratingBreakdown
    : [
        {
          star: 5,
          percent: rating >= 4.5 ? "100%" : "0%",
          width: rating >= 4.5 ? "100%" : "0%",
        },
        {
          star: 4,
          percent:
            rating >= 3.5 && rating < 4.5
              ? "100%"
              : "0%",
          width:
            rating >= 3.5 && rating < 4.5
              ? "100%"
              : "0%",
        },
        {
          star: 3,
          percent:
            rating >= 2.5 && rating < 3.5
              ? "100%"
              : "0%",
          width:
            rating >= 2.5 && rating < 3.5
              ? "100%"
              : "0%",
        },
        {
          star: 2,
          percent:
            rating >= 1.5 && rating < 2.5
              ? "100%"
              : "0%",
          width:
            rating >= 1.5 && rating < 2.5
              ? "100%"
              : "0%",
        },
        {
          star: 1,
          percent:
            rating > 0 && rating < 1.5
              ? "100%"
              : "0%",
          width:
            rating > 0 && rating < 1.5
              ? "100%"
              : "0%",
        },
      ];

  const renderStars = (value = 0, size = 12) => {
    const numericRating = Number(value || 0);

    return [1, 2, 3, 4, 5].map((star) => (
      <Ionicons
        key={star}
        name={
          star <= Math.round(numericRating)
            ? "star"
            : "star-outline"
        }
        size={RF(size)}
        color="#FDBA12"
      />
    ));
  };

  const renderReview = ({ item, index }) => {
    const reviewImage = item?.image
      ? typeof item.image === "string"
        ? {
            uri: item.image,
          }
        : item.image
      : require("../../assets/images/placeholder.jpeg");

    return (
      <View style={styles.reviewCard}>
        <View style={styles.userRow}>
          <Image
            source={reviewImage}
            style={styles.avatar}
          />

          <View style={styles.reviewUserInfo}>
            <Text style={styles.userName}>
              {item?.name || "Vavi User"}
            </Text>

            <View style={styles.starRow}>
              {renderStars(item?.rating || 0, 12)}
            </View>
          </View>

          <Text style={styles.date}>
            {item?.date || ""}
          </Text>
        </View>

        <Text style={styles.reviewText}>
          {item?.review ||
            item?.comment ||
            "No review text available."}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>
        Ratings & Reviews
      </Text>

      <View style={styles.ratingContainer}>
        <View style={styles.left}>
          <Text style={styles.bigRating}>
            {rating.toFixed(1)}
          </Text>

          <View style={styles.starRow}>
            {renderStars(rating, 15)}
          </View>

          <Text style={styles.total}>
            {totalReviews}{" "}
            {totalReviews === 1 ? "Rating" : "Ratings"}
          </Text>
        </View>

        <View style={styles.right}>
          {ratingData.map((item, index) => (
            <View
              key={`${item?.star || index}-${index}`}
              style={styles.progressRow}
            >
              <Text style={styles.starNumber}>
                {item?.star || 0}
              </Text>

              <Ionicons
                name="star"
                size={RF(11)}
                color="#FDBA12"
              />

              <View style={styles.progressBackground}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: item?.width || "0%",
                    },
                  ]}
                />
              </View>

              <Text style={styles.percent}>
                {item?.percent || "0%"}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {reviews.length > 0 ? (
        <>
          <FlatList
            data={reviews}
            keyExtractor={(item, index) =>
              item?.id?.toString() ||
              `review-${index}`
            }
            renderItem={renderReview}
            scrollEnabled={false}
          />

          <TouchableOpacity style={styles.viewBtn}>
            <Text style={styles.viewText}>
              View All Reviews
            </Text>
          </TouchableOpacity>
        </>
      ) : (
        <View style={styles.emptyReviews}>
          <Ionicons
            name="chatbox-ellipses-outline"
            size={RF(38)}
            color="#CCCCCC"
          />

          <Text style={styles.emptyTitle}>
            No reviews yet
          </Text>

          <Text style={styles.emptyText}>
            This astrologer has not received any reviews yet.
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: wp(4),
    marginTop: hp(2),
    backgroundColor: Colors.white,
    borderRadius: wp(4),
    padding: wp(4),
    marginBottom: hp(3),
    elevation: 2,
  },

  heading: {
    fontSize: RF(17),
    color: Colors.darkBrown,
    fontWeight: "600",
  },

  ratingContainer: {
    flexDirection: "row",
    marginTop: hp(2),
  },

  left: {
    width: wp(24),
    alignItems: "center",
  },

  bigRating: {
    fontSize: RF(34),
    color: Colors.primary,
    fontWeight: "600",
  },

  total: {
    marginTop: hp(1),
    color: Colors.textGray,
    fontSize: RF(12),
    fontWeight: "400",
  },

  right: {
    flex: 1,
    marginLeft: wp(4),
  },

  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hp(0.8),
  },

  starNumber: {
    width: wp(4),
    fontSize: RF(12),
    color: Colors.darkBrown,
  },

  progressBackground: {
    flex: 1,
    height: hp(0.8),
    backgroundColor: "#ECECEC",
    borderRadius: 10,
    marginHorizontal: wp(2),
    overflow: "hidden",
  },

  progressFill: {
    height: hp(0.8),
    borderRadius: 10,
    backgroundColor: "#FDBA12",
  },

  percent: {
    width: wp(10),
    textAlign: "right",
    fontSize: RF(11),
    color: Colors.textGray,
  },

  reviewCard: {
    marginTop: hp(2),
    borderTopWidth: 1,
    borderTopColor: "#F3F3F3",
    paddingTop: hp(2),
  },

  userRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  avatar: {
    width: wp(12),
    height: wp(12),
    borderRadius: wp(6),
    marginRight: wp(3),
  },

  reviewUserInfo: {
    flex: 1,
  },

  userName: {
    fontSize: RF(14),
    color: Colors.darkBrown,
    fontWeight: "600",
  },

  starRow: {
    flexDirection: "row",
    marginTop: hp(0.3),
  },

  date: {
    color: Colors.textGray,
    fontSize: RF(11),
  },

  reviewText: {
    marginTop: hp(1),
    color: Colors.textGray,
    fontSize: RF(13),
    lineHeight: RF(20),
    fontWeight: "400",
  },

  viewBtn: {
    marginTop: hp(3),
    alignSelf: "center",
  },

  viewText: {
    color: Colors.primary,
    fontSize: RF(14),
    fontWeight: "600",
  },

  emptyReviews: {
    alignItems: "center",
    paddingVertical: hp(4),
  },

  emptyTitle: {
    marginTop: hp(1),
    color: Colors.darkBrown,
    fontSize: RF(15),
    fontWeight: "600",
  },

  emptyText: {
    marginTop: hp(0.7),
    textAlign: "center",
    color: Colors.textGray,
    fontSize: RF(12),
    fontWeight: "400",
  },
});