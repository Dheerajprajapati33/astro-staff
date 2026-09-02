import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { router } from "expo-router";
import TopAstrologers from "../../constants/TopAstrologers";
import Colors from "../../constants/Colors";
import { resolveImageUri } from "../../config/api";
import { hp, RF, wp } from "../../utils/responsive";

export default function TopAstrologerCard({ data }) {
  const astrologersList =
    Array.isArray(data) && data.length > 0 ? data : TopAstrologers;

  const handleCardPress = (item) => {
    if (item?.id) {
      router.push({
        pathname: "/astrodetail",
        params: {
          id: item.id,
          astrologerData: JSON.stringify(item),
        },
      });
    }
  };

  const renderItem = ({ item }) => {
    const isOnline = Boolean(
      item?.online ??
      item?.isOnline ??
      item?.isCallOnline ??
      item?.isChatOnline,
    );

    const imageSource =
      typeof item?.image === "number" ||
      (typeof item?.image === "object" &&
        item?.image?.uri === undefined &&
        !item?.profilePic)
        ? item.image
        : item?.profilePic ||
            (typeof item?.image === "string" ? item.image : null)
          ? resolveImageUri(item.profilePic || item.image)
          : require("../../assets/images/placeholder.jpeg");

    const speciality =
      item?.speciality ||
      (Array.isArray(item?.expertises)
        ? item.expertises
            .map((e) => (typeof e === "string" ? e : e?.name))
            .filter(Boolean)
            .join(", ")
        : "") ||
      "Vedic Astrologer";

    const experience = item?.experience
      ? String(item.experience).includes("Year")
        ? item.experience
        : `${item.experience}+ Years`
      : "5+ Years";

    const rating = item?.rating || "4.8";

    return (
      <TouchableOpacity
        activeOpacity={0.9}
        style={styles.card}
        onPress={() => handleCardPress(item)}
      >
        {/* Profile Image */}
        <View style={styles.imageWrapper}>
          <Image source={imageSource} style={styles.image} resizeMode="cover" />
          {isOnline && <View style={styles.onlineDot} />}
        </View>

        {/* Rating */}
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={RF(10)} color="#FFB100" />
          <Text style={styles.rating}>{rating}</Text>
        </View>

        {/* Name */}
        <Text numberOfLines={2} style={styles.name}>
          {item?.name || "Astrologer"}
        </Text>

        {/* Expertise */}
        <Text numberOfLines={1} style={styles.speciality}>
          {speciality}
        </Text>

        {/* Experience */}
        <Text style={styles.experience}>Exp. {experience}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      data={astrologersList}
      renderItem={renderItem}
      keyExtractor={(item) => (item.id || Math.random()).toString()}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.listContainer}
    />
  );
}

const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: wp(4),
    paddingBottom: hp(1),
  },

  card: {
    width: wp(40),

    backgroundColor: Colors.white,

    borderRadius: wp(4),

    alignItems: "center",

    paddingVertical: hp(1.6),

    paddingHorizontal: wp(2),

    marginRight: wp(3),

    borderWidth: 1,

    borderColor: "#F2E6DD",

    shadowColor: "#000",

    shadowOpacity: 0.05,

    shadowRadius: 6,

    shadowOffset: {
      width: 0,
      height: 2,
    },

    elevation: 2,
  },

  imageWrapper: {
    position: "relative",

    marginBottom: hp(0.8),
  },

  image: {
    width: wp(16),

    height: wp(16),

    borderRadius: wp(8),

    backgroundColor: "#F5F5F5",
  },

  onlineDot: {
    position: "absolute",

    right: 1,

    top: 1,

    width: wp(3),

    height: wp(3),

    borderRadius: wp(1.5),

    backgroundColor: "#18C23E",

    borderWidth: 1.5,

    borderColor: "#FFF",
  },

  ratingContainer: {
    flexDirection: "row",

    alignItems: "center",

    backgroundColor: "#FFF5E5",

    borderRadius: wp(5),

    paddingHorizontal: wp(2),

    paddingVertical: hp(0.25),

    marginBottom: hp(0.6),
  },

  rating: {
    marginLeft: wp(1),

    color: "#FF9800",

    fontSize: RF(10),

    fontWeight: "600",
  },
  name: {
    color: Colors.darkBrown,

    fontSize: RF(16),

    fontWeight: "800",

    textAlign: "center",

    lineHeight: RF(15) * 1.5,

    //paddingHorizontal: wp(0.5),
  },

  speciality: {
    color: "#6F6F6F",

    fontSize: RF(12),

    fontWeight: "600",

    textAlign: "center",

    marginTop: hp(0.3),

    minHeight: hp(0.2),
  },

  experience: {
    color: "#9A9A9A",

    fontSize: RF(10),

    fontWeight: "600",

    textAlign: "center",

    marginTop: hp(0.4),
  },
});
