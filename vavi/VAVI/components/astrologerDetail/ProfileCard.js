import { Ionicons } from "@expo/vector-icons";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { resolveImageUri } from "../../config/api";
import Colors from "../../constants/Colors";import { hp, RF, wp } from "../../utils/responsive";

import { useEffect, useState } from "react";
import { useFollowAstrologerMutation } from "../../redux/followerApi";

export default function ProfileCard({ astrologer = {} }) {
  const [followAstro] = useFollowAstrologerMutation();

  // Use parent passed following or backend value
  const [isFollowing, setIsFollowing] = useState(astrologer.following || false);

  // Sync local state if prop changes
  useEffect(() => {
    setIsFollowing(astrologer.following || false);
  }, [astrologer.following]);

  const expertises = Array.isArray(astrologer?.expertises)
    ? astrologer.expertises.map((e) => e?.name).filter(Boolean)
    : Array.isArray(astrologer?.skills)
      ? astrologer.skills.filter(Boolean)
      : [];

  const languages = Array.isArray(astrologer?.languages)
    ? astrologer.languages.join(", ")
    : astrologer?.languages || "Language not available";

  const profileImage = resolveImageUri(astrologer?.profilePic)
    || (astrologer?.image ? astrologer.image : require("../../assets/images/placeholder.jpeg"));

  const experienceText = astrologer?.experience
    ? String(astrologer.experience).toLowerCase().includes("year")
      ? astrologer.experience
      : `${astrologer.experience} Years`
    : "0 Years";

  const handleFollow = async () => {
    try {
      const response = await followAstro(astrologer.id).unwrap();
      console.log("Follow response:", response);

      // Update local state
      setIsFollowing(response.data.following);

      // Optional: update parent cache if needed (depends on how parent passes data)
      if (astrologer.updateFollowing) {
        astrologer.updateFollowing(response.data.following);
      }
    } catch (error) {
      console.log("Follow API error:", error);
    }
  };

  return (
    <View style={styles.card}>
      {/* Left Image */}
      <View style={styles.imageContainer}>
        <Image source={profileImage} style={styles.image} resizeMode="cover" />

        {/*    <View style={styles.ratingBadge}>
          <Ionicons name="star" size={RF(13)} color="#FDBA12" />
          <Text style={styles.ratingText}>{astrologer?.rating || "0.0"}</Text>
        </View> */}

        {astrologer?.isOnline && (
          <View style={styles.onlineBadge}>
            <View style={styles.onlineDot} />
            <Text style={styles.onlineText}>Online</Text>
          </View>
        )}
      </View>

      {/* Right Details */}
      <View style={styles.details}>
        <View style={styles.nameRow}>
          <Text style={styles.name} numberOfLines={2}>
            {astrologer?.name || "Astrologer"}
          </Text>

          {astrologer?.verified && (
            <Ionicons name="checkmark-circle" size={RF(18)} color="#14AE5C" />
          )}
        </View>

        {/* Expertise Chips */}
        <View style={styles.chipRow}>
          {expertises.length > 0 ? (
            expertises.slice(0, 4).map((expertise, index) => (
              <View key={`${expertise}-${index}`} style={styles.chip}>
                <Text style={styles.chipText}>{expertise}</Text>
              </View>
            ))
          ) : (
            <View style={styles.chip}>
              <Text style={styles.chipText}>General Astrology</Text>
            </View>
          )}
        </View>

        <Text style={styles.language}>{languages}</Text>

        <View style={styles.bottomRow}>
          <Text style={styles.exp}>Exp: {experienceText}</Text>

          <TouchableOpacity
            activeOpacity={0.8}
            style={[
              styles.followBtn,
              { backgroundColor: isFollowing ? "#888" : Colors.primary },
            ]}
            onPress={handleFollow}
          >
            <Text style={styles.followText}>
              {isFollowing ? "Following" : "Follow"}
            </Text>
          </TouchableOpacity>
        </View>

        {[astrologer?.city, astrologer?.state].filter(Boolean).length > 0 && (
          <View style={styles.locationRow}>
            <Ionicons
              name="location-outline"
              size={RF(14)}
              color={Colors.textGray}
            />
            <Text style={styles.locationText} numberOfLines={1}>
              {[astrologer?.city, astrologer?.state].filter(Boolean).join(", ")}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: wp(4),
    marginTop: hp(1.5),
    backgroundColor: Colors.white,
    borderRadius: wp(4),
    padding: wp(3),
    flexDirection: "row",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },

  imageContainer: {
    width: wp(27),
    alignItems: "center",
    position: "relative",
  },

  image: {
    width: wp(25),
    height: wp(30),
    borderRadius: wp(3),
    backgroundColor: "#EEEEEE",
  },

  ratingBadge: {
    position: "absolute",
    bottom: -hp(1),
    backgroundColor: Colors.white,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.4),
    borderRadius: wp(5),
    elevation: 2,
  },

  ratingText: {
    marginLeft: wp(1),
    color: Colors.darkBrown,
    fontSize: RF(14),
    fontWeight: "600",
  },

  onlineBadge: {
    position: "absolute",
    top: hp(0.8),
    left: wp(2),
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E8FFF0",
    paddingHorizontal: wp(2),
    paddingVertical: hp(0.3),
    borderRadius: wp(3),
  },

  onlineDot: {
    width: wp(1.5),
    height: wp(1.5),
    borderRadius: wp(0.75),
    backgroundColor: "#14AE5C",
    marginRight: wp(1),
  },

  onlineText: {
    color: "#14AE5C",
    fontSize: RF(9),
    fontWeight: "600",
  },

  details: {
    flex: 1,
    marginLeft: wp(4),
  },

  nameRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  name: {
    flex: 1,
    color: Colors.darkBrown,
    fontSize: RF(22),
    fontWeight: "600",
    marginRight: wp(1),
  },

  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: hp(1),
  },

  chip: {
    backgroundColor: "#FFF5EE",
    borderWidth: 1,
    borderColor: "#FFD9BF",
    borderRadius: wp(2),
    paddingHorizontal: wp(2),
    paddingVertical: hp(0.4),
    marginRight: wp(1),
    marginBottom: hp(0.6),
  },

  chipText: {
    color: Colors.primary,
    fontSize: RF(9.5),
    fontWeight: "500",
  },

  language: {
    color: Colors.textGray,
    fontSize: RF(12),
    marginTop: hp(0.5),
    fontWeight: "400",
  },

  bottomRow: {
    marginTop: hp(1.5),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  exp: {
    flex: 1,
    color: Colors.darkBrown,
    fontSize: RF(12),
    fontWeight: "500",
  },

  followBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: wp(4),
    paddingVertical: hp(0.7),
    borderRadius: wp(2),
  },

  followText: {
    color: Colors.white,
    fontSize: RF(12),
    fontWeight: "600",
  },

  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: hp(1),
  },

  locationText: {
    flex: 1,
    marginLeft: wp(1),
    color: Colors.textGray,
    fontSize: RF(11),
    fontWeight: "400",
  },
});
