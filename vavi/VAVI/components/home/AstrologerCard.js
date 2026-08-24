import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { BASE_URL, resolveImageUri } from "../../config/api";
import Colors from "../../constants/Colors";
import { useCreateConsultationMutation } from "../../redux/consultationApi";
import { hp, RF, wp } from "../../utils/responsive";
import Shadows from "../../utils/shadows";

const LOG_TAG = "[AstrologerCard]";

export default function AstrologerCard({ item = {} }) {
  const [isStartingChat, setIsStartingChat] = useState(false);

  const [createConsultation] = useCreateConsultationMutation();

  // API me expertises array hai.
  // Array na hone par empty array use hogi.
  const skills = Array.isArray(item?.expertises)
    ? item.expertises.map((expertise) => expertise?.name).filter(Boolean)
    : [];

  const isOnline = Boolean(
    item?.isOnline || item?.isCallOnline || item?.isChatOnline,
  );

  const profileImage = resolveImageUri(item?.profilePic) || require("../../assets/images/placeholder.jpeg");

  const handleCardPress = () => {
    if (!item?.id) {
      return;
    }

    router.push({
      pathname: "/astrodetail",
      params: {
        id: item.id,
        astrologerData: JSON.stringify(item),
      },
    });
  };

  const handleFavourite = (event) => {
    event?.stopPropagation?.();

    console.log("Favourite astrologer:", item?.id);
  };

  const [isStartingCall, setIsStartingCall] = useState(false);

  const handleInternetCall = async (event) => {
    event?.stopPropagation?.();

    if (!item?.isCallOnline) {
      Alert.alert(
        "Astrologer Not Available",
        "Astrologer is currently not available for call. Please try again later.",
        [{ text: "OK" }],
      );
      return;
    }

    if (isStartingCall) return;
    setIsStartingCall(true);

    console.log(LOG_TAG, "Creating call consultation for astrologer:", item?.id);

    try {
      const response = await createConsultation({
        astrologerId: item?.id,
        type: "call",
        problem: item?.expertises?.[0]?.name || "Horoscope Reading",
      }).unwrap();

      console.log(LOG_TAG, "Call Consultation created:", response);

      const consultation = response?.data?.consultation || response?.data;
      const consultationId =
        consultation?.id ||
        response?.data?.consultationId ||
        response?.consultationId;
      const maxDuration =
        consultation?.maxDuration ||
        response?.data?.maxDuration ||
        1500;

      if (!consultationId) {
        Alert.alert("Error", "Could not start call. Please try again.");
        return;
      }

      router.push({
        pathname: "/CallConsultation",
        params: {
          consultationId,
          maxDuration: String(maxDuration),
          astrologerName: item?.name || "",
          astrologerImage: item?.profilePic || "",
        },
      });
    } catch (error) {
      console.log(LOG_TAG, "Create call consultation failed:", error);
      Alert.alert(
        "Unable to Start Call",
        error?.data?.message || "Something went wrong. Please try again.",
      );
    } finally {
      setIsStartingCall(false);
    }
  };

  const handleChat = async (event) => {
    event?.stopPropagation?.();

    if (!item?.isChatOnline) {
      Alert.alert(
        "Astrologer Not Available",
        "Astrologer is currently not available for chat. Please try again later.",
        [{ text: "OK" }],
      );

      return;
    }

    if (isStartingChat) {
      return;
    }

    setIsStartingChat(true);

    console.log(
      LOG_TAG,
      "Creating chat consultation for astrologer:",
      item?.id,
    );

    try {
      const response = await createConsultation({
        astrologerId: item?.id,
        type: "chat",
        problem: item?.expertises?.[0]?.name || "General Consultation",
      }).unwrap();

      console.log(LOG_TAG, "Consultation created:", response);

      const consultation = response?.data?.consultation || response?.data;

      const consultationId =
        consultation?.id ||
        response?.data?.consultationId ||
        response?.consultationId;
      const maxDuration =
        consultation?.maxDuration ||
        response?.data?.maxDuration ||
        1500;

      if (!consultationId) {
        console.log(LOG_TAG, "No consultationId returned from create API");

        Alert.alert("Error", "Could not start chat. Please try again.");

        return;
      }

      router.push({
        pathname: "/ChatConsultation",
        params: {
          consultationId,
          maxDuration: String(maxDuration),
          astrologerName: item?.name || "",
        },
      });
    } catch (error) {
      console.log(LOG_TAG, "Create consultation failed:", error);

      Alert.alert(
        "Unable to Start Chat",
        error?.data?.message || "Something went wrong. Please try again.",
      );
    } finally {
      setIsStartingChat(false);
    }
  };

  return (
    <TouchableOpacity activeOpacity={0.9} onPress={handleCardPress}>
      <View style={styles.card}>
        {/* Top Section */}
        <View style={styles.topRow}>
          <View style={styles.imageContainer}>
            {isOnline && (
              <View style={styles.onlineBadge}>
                <View style={styles.onlineDot} />

                <Text style={styles.onlineText}>Online</Text>
              </View>
            )}

            <Image
              source={profileImage}
              style={styles.image}
              resizeMode="cover"
            />
          </View>

          <View style={styles.info}>
            <View style={styles.nameRow}>
              <View style={styles.nameContainer}>
                <Text style={styles.name} numberOfLines={2}>
                  {item?.name || "Astrologer"}
                </Text>

                {/* {item?.verified === true && (
                  <Ionicons
                    name="checkmark-circle"
                    size={RF(18)}
                    color="#14AE5C"
                  />
                )} */}
              </View>

              {/* <TouchableOpacity activeOpacity={0.7} onPress={handleFavourite}>
                <Ionicons name="heart-outline" size={RF(24)} color="#333333" />
              </TouchableOpacity> */}
            </View>

            <View style={styles.chipRow}>
              {skills.length > 0 ? (
                skills.slice(0, 4).map((expertise, index) => (
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

            <Text style={styles.exp}>
              {item?.experience || "0"} Years Experience
            </Text>

            {/* <View style={styles.skillRow}>
              {skills.length > 0 ? (
                <View style={styles.skillBadge}>
                  <Text style={styles.skill}>
                    {skills.length > 1
                      ? `${skills[0]} + ${skills.length - 1} more`
                      : skills[0]}
                  </Text>
                </View>
              ) : (
                <Text style={styles.noSkillText}>General Astrology</Text>
              )}
            </View> */}

            <View style={styles.ratingRow}>
              <Ionicons name="star" size={RF(16)} color="#FDBA12" />

              <Text style={styles.rating}>{item?.rating || "0.0"}</Text>

              <Text style={styles.review}>({item?.totalReviews || 0})</Text>
            </View>

            <Text style={styles.people}>
              Rated by {item?.totalReviews || 0} people
            </Text>
          </View>
        </View>

        {item?.availability ? (
          <View style={styles.availabilityRow}>
            <Ionicons
              name="time-outline"
              size={RF(15)}
              color={Colors.primary}
            />

            <Text style={styles.availabilityText}>
              Available: {item.availability}
            </Text>
          </View>
        ) : null}

        {/* Bottom Buttons */}
        <View style={styles.bottomRow}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={[
              styles.internetBtn,
              !item?.isCallOnline && styles.offlineButton,
            ]}
            onPress={handleInternetCall}
          >
            <Ionicons
              name="wifi"
              size={RF(18)}
              color={item?.isCallOnline ? "#2E7D32" : "#999999"}
            />

            <View style={styles.buttonContent}>
              <Text
                style={[
                  styles.internetTitle,
                  !item?.isCallOnline && styles.offlineText,
                ]}
              >
                Call
              </Text>

              <Text style={styles.price}>
                ₹{item?.internetCallPrice || "0"}/min
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            style={[
              styles.chatBtn,
              !item?.isChatOnline && styles.offlineButton,
            ]}
            onPress={handleChat}
            disabled={isStartingChat}
          >
            {isStartingChat ? (
              <ActivityIndicator size="small" color="#2E7D32" />
            ) : (
              <Ionicons
                name="chatbubble-outline"
                size={RF(18)}
                color={item?.isChatOnline ? "#2E7D32" : "#999999"}
              />
            )}

            <View style={styles.buttonContent}>
              <Text
                style={[
                  styles.chatTitle,
                  !item?.isChatOnline && styles.offlineText,
                ]}
              >
                {isStartingChat ? "Connecting..." : "Chat"}
              </Text>

              <Text style={styles.price}>₹{item?.chatPrice || "0"}/min</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    marginHorizontal: wp(2.67),
    marginTop: hp(1),
    borderRadius: wp(4),
    padding: wp(2),
    ...Shadows.md,
  },

  topRow: {
    flexDirection: "row",
  },

  imageContainer: {
    position: "relative",
  },

  image: {
    width: wp(20),
    height: wp(23),
    borderRadius: wp(3),
    backgroundColor: "#EEEEEE",
  },

  onlineBadge: {
    position: "absolute",
    top: wp(25),
    left: wp(2),
    zIndex: 10,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E8FFF0",
    paddingHorizontal: wp(1.33),
    paddingVertical: hp(0.2),
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
    fontSize: RF(15),
    fontWeight: "600",
  },

  info: {
    flex: 1,
    marginLeft: wp(2),
  },

  nameRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  nameContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginRight: wp(1.33),
  },

  name: {
    flexShrink: 1,
    fontSize: RF(25),
    fontWeight: 600,
    color: Colors.darkBrown,
    marginRight: wp(0.67),
  },

  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: hp(0.67),
  },

  chip: {
    backgroundColor: "#FFF5EE",
    borderWidth: 1,
    borderColor: "#FFD9BF",
    borderRadius: wp(2),
    paddingHorizontal: wp(2),
    paddingVertical: hp(0.4),
    marginRight: wp(1),
    marginBottom: hp(0.4),
  },

  chipText: {
    color: Colors.primary,
    fontSize: RF(14),
    fontWeight: "500",
  },

  exp: {
    color: Colors.textGray,
    fontSize: RF(18),
    fontWeight: "400",
    marginTop: hp(0.33),
  },

  skillRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: hp(0.67),
  },

  skillBadge: {
    backgroundColor: "#FFF5EF",
    paddingHorizontal: wp(1.33),
    paddingVertical: hp(0.27),
    borderRadius: wp(2),
    marginRight: wp(0.67),
    marginBottom: hp(0.33),
  },

  skill: {
    fontSize: RF(15),
    color: Colors.darkBrown,
    fontWeight: "400",
  },

  noSkillText: {
    fontSize: RF(15),
    color: Colors.textGray,
    fontWeight: "400",
  },

  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: hp(0.53),
  },

  rating: {
    marginLeft: wp(0.67),
    color: Colors.darkBrown,
    fontSize: RF(18),
    fontWeight: "600",
  },

  review: {
    marginLeft: wp(0.67),
    color: Colors.textGray,
    fontSize: RF(17),
    fontWeight: "400",
  },

  people: {
    marginTop: hp(0.2),
    color: Colors.textGray,
    fontSize: RF(15),
    fontWeight: "400",
  },

  availabilityRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: hp(1),
    backgroundColor: "#FFF8F3",
    borderRadius: wp(2),
    paddingHorizontal: wp(1.33),
    paddingVertical: hp(0.53),
  },

  availabilityText: {
    flex: 1,
    marginLeft: wp(1),
    color: Colors.darkBrown,
    fontSize: RF(17),
    fontWeight: "400",
  },

  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: hp(1),
  },

  internetBtn: {
    flex: 1,
    minHeight: hp(6),
    backgroundColor: "#F3F9F2",
    marginRight: wp(0.67),
    borderRadius: wp(3),
    paddingHorizontal: wp(1.33),
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  chatBtn: {
    flex: 1,
    minHeight: hp(6),
    backgroundColor: "#F3F9F2",
    marginLeft: wp(0.67),
    borderRadius: wp(3),
    paddingHorizontal: wp(1.33),
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  buttonContent: {
    marginLeft: wp(1.33),
  },

  internetTitle: {
    color: "#2E7D32",
    fontSize: RF(17),
    fontWeight: "600",
  },

  chatTitle: {
    color: "#2E7D32",
    fontSize: RF(17),
    fontWeight: "600",
  },

  price: {
    marginTop: hp(0.13),
    color: Colors.darkBrown,
    fontSize: RF(15),
    fontWeight: "600",
  },

  offlineButton: {
    backgroundColor: "#F1F1F1",
  },

  offlineText: {
    color: "#999999",
  },
});
