import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import Colors from "../../constants/Colors";import { hp, RF, wp } from "../../utils/responsive";

export default function AboutCard({ astrologer = {} }) {
  const [expanded, setExpanded] = useState(false);

 const aboutText =
  astrologer?.about?.trim() ||
  astrologer?.shortBio?.trim() ||
  (Array.isArray(astrologer?.expertises) && astrologer.expertises.length > 0
    ? `Expert in ${astrologer.expertises.map((e) => e.name).join(", ")}` 
    : astrologer?.experience 
      ? `Experience: ${astrologer.experience} years` 
      : "No additional information available.");

  const toolsUsed = Array.isArray(astrologer?.toolsUsed)
    ? astrologer.toolsUsed.filter(Boolean)
    : [];

  return (
    <>
      <View style={styles.banner}>
        <View style={styles.bannerLeft}>
          <Ionicons
            name="shield-checkmark"
            size={RF(18)}
            color="#2E7D32"
          />

          <Text style={styles.bannerTitle}>
            100% Private & Confidential
          </Text>
        </View>

        <Ionicons
          name="lock-closed"
          size={RF(18)}
          color="#2E7D32"
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.heading}>
          About Astrologer
        </Text>

        <Text
          style={styles.description}
          numberOfLines={expanded ? undefined : 4}
        >
          {aboutText}
        </Text>

        {aboutText.length > 140 && (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setExpanded((previous) => !previous)}
          >
            <Text style={styles.readMore}>
              {expanded ? "Read Less" : "Read More"}
            </Text>
          </TouchableOpacity>
        )}

        {astrologer?.availability ? (
          <View style={styles.infoRow}>
            <Ionicons
              name="time-outline"
              size={RF(17)}
              color={Colors.primary}
            />

            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>
                Availability
              </Text>

              <Text style={styles.infoValue}>
                {astrologer.availability}
              </Text>
            </View>
          </View>
        ) : null}

        {toolsUsed.length > 0 && (
          <View style={styles.toolsContainer}>
            <Text style={styles.toolsHeading}>
              Tools Used
            </Text>

            <View style={styles.toolsRow}>
              {toolsUsed.map((tool, index) => (
                <View
                  key={`${String(tool)}-${index}`}
                  style={styles.toolChip}
                >
                  <Text style={styles.toolText}>
                    {typeof tool === "object"
                      ? tool?.name || "Astrology Tool"
                      : tool}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  banner: {
    marginHorizontal: wp(4),
    marginTop: hp(2),
    backgroundColor: "#EAF9EF",
    borderRadius: wp(3),
    paddingVertical: hp(1.4),
    paddingHorizontal: wp(4),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  bannerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  bannerTitle: {
    marginLeft: wp(2),
    color: "#2E7D32",
    fontSize: RF(13),
    fontWeight: "600",
  },

  card: {
    marginHorizontal: wp(4),
    marginTop: hp(2),
    backgroundColor: Colors.white,
    borderRadius: wp(4),
    padding: wp(4),
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 5,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },

  heading: {
    color: Colors.darkBrown,
    fontSize: RF(17),
    fontWeight: "600",
    marginBottom: hp(1),
  },

  description: {
    color: Colors.textGray,
    fontSize: RF(13.5),
    lineHeight: RF(22),
    fontWeight: "400",
  },

  readMore: {
    marginTop: hp(1.5),
    color: Colors.primary,
    fontSize: RF(13),
    fontWeight: "600",
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: hp(2),
    paddingTop: hp(1.5),
    borderTopWidth: 1,
    borderTopColor: "#F1F1F1",
  },

  infoContent: {
    flex: 1,
    marginLeft: wp(2),
  },

  infoTitle: {
    color: Colors.darkBrown,
    fontSize: RF(13),
    fontWeight: "600",
  },

  infoValue: {
    color: Colors.textGray,
    fontSize: RF(12),
    fontWeight: "400",
    marginTop: hp(0.3),
  },

  toolsContainer: {
    marginTop: hp(2),
  },

  toolsHeading: {
    color: Colors.darkBrown,
    fontSize: RF(14),
    fontWeight: "600",
  },

  toolsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: hp(1),
  },

  toolChip: {
    backgroundColor: "#FFF5EE",
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.6),
    borderRadius: wp(3),
    marginRight: wp(2),
    marginBottom: hp(0.8),
  },

  toolText: {
    color: Colors.primary,
    fontSize: RF(11),
    fontWeight: "500",
  },
});