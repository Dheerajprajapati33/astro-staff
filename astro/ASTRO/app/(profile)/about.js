import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useMemo } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useGetContentQuery } from "../../redux/contentApi";
import Colors from "../../constants/Colors";
import Typography from "../../constants/Typography";
import { hp, RF, wp } from "../../utils/responsive";

const ORANGE = Colors?.primary || "#ff6a00";
const DARK = Colors?.darkBrown || "#3b2418";

/* =========================================================
   HARDCODED ABOUT US DATA
   ========================================================= */

const ABOUT_DATA = [
  {
    type: "about",
    title: "About VAVI",
    icon: "information-circle-outline",
    content:
      "VAVI is your trusted astrology platform connecting users with experienced astrologers through chat and voice consultations. Our mission is to provide accurate guidance, personalized Kundli, horoscope analysis and spiritual solutions in one secure platform.",
  },

  {
    type: "mission",
    title: "Our Mission",
    icon: "rocket-outline",
    content:
      "To make authentic astrology accessible to everyone with trusted experts and modern technology.",
  },

  {
    type: "vision",
    title: "Our Vision",
    icon: "eye-outline",
    content:
      "To become India's most trusted astrology platform delivering guidance, positivity and clarity to millions of users.",
  },

  {
    type: "features",
    title: "Why Choose VAVI?",
    icon: "star-outline",
    features: [
      "Verified Astrologers",
      "Instant Chat & Voice Call",
      "Free Kundli",
      "Secure Wallet",
      "Fast Customer Support",
    ],
  },

  {
    type: "contact",
    title: "Contact Us",
    icon: "call-outline",
    contacts: [
      {
        icon: "mail-outline",
        text: "support@vavi.com",
      },
      {
        icon: "call-outline",
        text: "+91 98765 43210",
      },
      {
        icon: "globe-outline",
        text: "www.vavi.com",
      },
    ],
  },
];

/* =========================================================
   API CONTENT PARSER
   ========================================================= */

const parseAboutContent = (content) => {
  if (!content) {
    return [];
  }

  /*
   * If API returns structured array
   */
  if (Array.isArray(content)) {
    return content;
  }

  const text = String(content)
    .replace(/\r\n/g, "\n")
    .trim();

  if (!text) {
    return [];
  }

  /*
   * API may return:
   *
   * 1. About Vavi
   * Vavi is...
   *
   * 2. Our Mission
   * To make...
   *
   * etc.
   */

  const regex =
    /(?:^|\n)\s*(?:##\s*)?(\d+)\.\s+([^\n]+)\n([\s\S]*?)(?=\n\s*(?:##\s*)?\d+\.\s+|$)/g;

  const sections = [];

  let match;

  while ((match = regex.exec(text)) !== null) {
    sections.push({
      type: "api",
      number: match[1],
      title: match[2].trim(),
      content: match[3].trim(),
    });
  }

  /*
   * If API is plain content without numbered sections,
   * don't use it here because hardcoded structured data
   * gives us the proper About UI.
   */
  return sections;
};

/* =========================================================
   ABOUT US SCREEN
   ========================================================= */

export default function AboutUs() {
  const {
    data,
    isLoading,
    isError,
  } = useGetContentQuery("about_us");

  /*
   * API priority:
   *
   * API structured content available
   *          ↓
   *       Use API
   *
   * API empty/error
   *          ↓
   *    Use hardcoded data
   */
  const aboutSections = useMemo(() => {
    const apiSections = parseAboutContent(data?.content);

    if (apiSections.length > 0) {
      return apiSections;
    }

    return ABOUT_DATA;
  }, [data?.content]);

  return (
    <SafeAreaView
      style={styles.safe}
      edges={["top"]}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        {/* =================================================
            HEADER
            ================================================= */}

        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            activeOpacity={0.8}
            onPress={() => router.back()}
          >
            <Ionicons
              name="chevron-back"
              size={RF(24)}
              color={ORANGE}
            />
          </TouchableOpacity>

          <Text
            style={styles.headerTitle}
            numberOfLines={1}
          >
            About Us
          </Text>

          <View style={styles.headerSpacer} />
        </View>

        {/* =================================================
            LOGO / APP INTRO
            ================================================= */}

        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <Ionicons
              name="sparkles"
              size={RF(42)}
              color={ORANGE}
            />
          </View>

          <Text style={styles.appName}>
            VAVI
          </Text>

          <Text style={styles.version}>
            Version 1.0.0
          </Text>
        </View>

        {/* =================================================
            API FALLBACK NOTICE
            ================================================= */}

        {isError && (
          <View style={styles.offlineNotice}>
            <Ionicons
              name="information-circle-outline"
              size={RF(16)}
              color={ORANGE}
            />

            <Text style={styles.offlineText}>
              Showing the latest available About Us information.
            </Text>
          </View>
        )}

        {/* =================================================
            ABOUT SECTIONS
            ================================================= */}

        {aboutSections.map((item, index) => {
          /*
           * API structured section
           */
          if (item.type === "api") {
            return (
              <View
                key={`api-${item.number}-${index}`}
                style={styles.card}
              >
                <View style={styles.row}>
                  <View style={styles.iconBoxSmall}>
                    <Text style={styles.numberText}>
                      {item.number}
                    </Text>
                  </View>

                  <Text style={styles.rowTitle}>
                    {item.title}
                  </Text>
                </View>

                <Text style={styles.cardText}>
                  {item.content}
                </Text>
              </View>
            );
          }

          /*
           * ABOUT
           */
          if (item.type === "about") {
            return (
              <View
                key={item.type}
                style={styles.card}
              >
                <View style={styles.row}>
                  <Ionicons
                    name={item.icon}
                    size={RF(22)}
                    color={ORANGE}
                  />

                  <Text style={styles.rowTitle}>
                    {item.title}
                  </Text>
                </View>

                <Text style={styles.cardText}>
                  {item.content}
                </Text>
              </View>
            );
          }

          /*
           * MISSION / VISION
           */
          if (
            item.type === "mission" ||
            item.type === "vision"
          ) {
            return (
              <View
                key={item.type}
                style={styles.card}
              >
                <View style={styles.row}>
                  <Ionicons
                    name={item.icon}
                    size={RF(22)}
                    color={ORANGE}
                  />

                  <Text style={styles.rowTitle}>
                    {item.title}
                  </Text>
                </View>

                <Text style={styles.cardText}>
                  {item.content}
                </Text>
              </View>
            );
          }

          /*
           * FEATURES
           */
          if (item.type === "features") {
            return (
              <View
                key={item.type}
                style={styles.card}
              >
                <View style={styles.row}>
                  <Ionicons
                    name={item.icon}
                    size={RF(22)}
                    color={ORANGE}
                  />

                  <Text style={styles.rowTitle}>
                    {item.title}
                  </Text>
                </View>

                <View style={styles.featureContainer}>
                  {item.features.map(
                    (feature, featureIndex) => (
                      <View
                        key={featureIndex}
                        style={styles.featureRow}
                      >
                        <Ionicons
                          name="checkmark-circle"
                          size={RF(17)}
                          color={ORANGE}
                        />

                        <Text style={styles.feature}>
                          {feature}
                        </Text>
                      </View>
                    )
                  )}
                </View>
              </View>
            );
          }

          /*
           * CONTACT
           */
          if (item.type === "contact") {
            return (
              <View
                key={item.type}
                style={styles.card}
              >
                <View style={styles.row}>
                  <Ionicons
                    name={item.icon}
                    size={RF(22)}
                    color={ORANGE}
                  />

                  <Text style={styles.rowTitle}>
                    {item.title}
                  </Text>
                </View>

                <View style={styles.contactContainer}>
                  {item.contacts.map(
                    (contact, contactIndex) => (
                      <View
                        key={contactIndex}
                        style={styles.contactRow}
                      >
                        <Ionicons
                          name={contact.icon}
                          size={RF(18)}
                          color={ORANGE}
                        />

                        <Text style={styles.contact}>
                          {contact.text}
                        </Text>
                      </View>
                    )
                  )}
                </View>
              </View>
            );
          }

          return null;
        })}

        {/* =================================================
            FOOTER
            ================================================= */}

        <Text style={styles.footer}>
          © 2026 VAVI. All Rights Reserved.
        </Text>

        <View style={{ height: hp(3) }} />
      </ScrollView>
    </SafeAreaView>
  );
}

/* =========================================================
   STYLES
   ========================================================= */

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#FFF8F4",
  },

  container: {
    paddingHorizontal: wp(4),
    paddingBottom: hp(4),
  },

  /* ================= HEADER ================= */

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    marginTop: hp(1),
    marginBottom: hp(2),
  },

  backButton: {
    width: wp(10),
    height: wp(10),
    borderRadius: wp(5),

    backgroundColor: "#FFF4EA",

    alignItems: "center",
    justifyContent: "center",
  },

  headerTitle: {
    flex: 1,

    marginLeft: wp(3),

    fontSize: RF(20),
    color: DARK,
    fontWeight: "700",
    fontFamily: Typography?.bold,
  },

  headerSpacer: {
    width: wp(10),
  },

  /* ================= LOGO ================= */

  logoContainer: {
    alignItems: "center",
    marginBottom: hp(3),
  },

  logoCircle: {
    width: wp(26),
    height: wp(26),

    borderRadius: wp(13),

    backgroundColor: "#FFF4EA",

    justifyContent: "center",
    alignItems: "center",

    elevation: 3,

    shadowColor: "#000",

    shadowOpacity: 0.08,

    shadowRadius: 8,

    shadowOffset: {
      width: 0,
      height: 3,
    },
  },

  appName: {
    marginTop: hp(1.5),

    color: ORANGE,

    fontSize: RF(28),

    fontWeight: "700",
    fontFamily: Typography?.bold,
  },

  version: {
    marginTop: hp(0.5),

    color: "#777",

    fontSize: RF(13),

    fontWeight: "500",
  },

  /* ================= OFFLINE ================= */

  offlineNotice: {
    flexDirection: "row",
    alignItems: "center",

    backgroundColor: "#FFF7F0",

    borderWidth: 1,
    borderColor: "#FFE0CC",

    borderRadius: wp(2.5),

    paddingHorizontal: wp(3),
    paddingVertical: hp(1),

    marginBottom: hp(1.5),
  },

  offlineText: {
    flex: 1,

    marginLeft: wp(2),

    color: "#7C4A28",

    fontSize: RF(10),

    lineHeight: hp(1.8),

    fontFamily: Typography?.regular,
  },

  /* ================= CARD ================= */

  card: {
    backgroundColor: "#FFF",

    borderRadius: wp(4),

    padding: wp(4),

    marginBottom: hp(2),

    elevation: 2,

    shadowColor: "#000",

    shadowOpacity: 0.06,

    shadowRadius: 8,

    shadowOffset: {
      width: 0,
      height: 3,
    },
  },

  /* ================= ROW ================= */

  row: {
    flexDirection: "row",
    alignItems: "center",

    marginBottom: hp(1),
  },

  rowTitle: {
    flex: 1,

    marginLeft: wp(2),

    color: DARK,

    fontSize: RF(16),

    fontWeight: "600",

    fontFamily: Typography?.bold,
  },

  iconBoxSmall: {
    width: wp(8),
    height: wp(8),

    borderRadius: wp(2),

    backgroundColor: "#FFF1E7",

    alignItems: "center",
    justifyContent: "center",
  },

  numberText: {
    color: ORANGE,

    fontSize: RF(11),

    fontWeight: "800",
  },

  /* ================= CARD TEXT ================= */

  cardText: {
    color: "#666",

    fontSize: RF(13),

    lineHeight: RF(22),

    fontWeight: "400",

    fontFamily: Typography?.regular,
  },

  /* ================= FEATURES ================= */

  featureContainer: {
    marginTop: hp(0.5),
  },

  featureRow: {
    flexDirection: "row",

    alignItems: "center",

    marginBottom: hp(1),
  },

  feature: {
    flex: 1,

    marginLeft: wp(2),

    color: "#555",

    fontSize: RF(14),

    lineHeight: RF(20),

    fontWeight: "500",

    fontFamily: Typography?.regular,
  },

  /* ================= CONTACT ================= */

  contactContainer: {
    marginTop: hp(0.5),
  },

  contactRow: {
    flexDirection: "row",

    alignItems: "center",

    marginBottom: hp(1.2),
  },

  contact: {
    flex: 1,

    marginLeft: wp(2),

    color: "#555",

    fontSize: RF(14),

    lineHeight: RF(20),

    fontWeight: "500",

    fontFamily: Typography?.regular,
  },

  /* ================= FOOTER ================= */

  footer: {
    marginTop: hp(1),

    marginBottom: hp(3),

    textAlign: "center",

    color: "#999",

    fontSize: RF(12),

    fontWeight: "400",

    fontFamily: Typography?.regular,
  },
});