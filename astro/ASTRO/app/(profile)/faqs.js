import React, { useState } from "react";

import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import Colors from "../../constants/Colors";
import { hp, RF, wp } from "../../utils/responsive";

/* =========================================================
   HARDCODED FAQ DATA
   ========================================================= */

const faqData = [
  {
    id: 1,
    question: "Is the astrology consultation personalized?",
    answer:
      "Yes, every consultation is completely personalized. Our astrologers analyze your birth chart, planetary positions and life concerns to provide accurate guidance tailored to your needs.",
  },

  {
    id: 2,
    question: "How do I create a Kundli (Birth Chart)?",
    answer:
      "Simply enter your birth details including date, time and place of birth. Our system will instantly generate your personalized Kundli.",
  },

  {
    id: 3,
    question: "How can I book a voice or chat consultation?",
    answer:
      "Open any astrologer's profile and choose Voice Call or Chat. Recharge your wallet if required and start your consultation instantly.",
  },

  {
    id: 4,
    question: "Can I get a refund for my consultation?",
    answer:
      "Refunds are available only in eligible cases according to our refund policy. Please contact customer support for assistance.",
  },

  {
    id: 5,
    question: "How do I pay for services?",
    answer:
      "You can recharge your wallet using UPI, Debit Card, Credit Card or Net Banking and use wallet credits for all services.",
  },

  {
    id: 6,
    question: "How do I contact customer support?",
    answer:
      "You can contact us through Call, Email or WhatsApp from the Help & Support section inside the app.",
  },
];

/* =========================================================
   FAQ SCREEN
   ========================================================= */

export default function FAQs() {
  const [expandedId, setExpandedId] = useState(null);

  const toggleFAQ = (id) => {
    setExpandedId((currentId) =>
      currentId === id ? null : id
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* =================================================
            HEADER
            ================================================= */}

        <View style={styles.header}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons
              name="arrow-back"
              size={RF(24)}
              color={Colors.darkBrown}
            />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>
            FAQs
          </Text>

          <View style={styles.headerRight} />
        </View>

        {/* =================================================
            TOP BANNER
            ================================================= */}

        <View style={styles.banner}>
          <View style={styles.bannerIcon}>
            <Ionicons
              name="help-circle"
              size={RF(52)}
              color={Colors.primary}
            />
          </View>

          <Text style={styles.bannerTitle}>
            Frequently Asked Questions
          </Text>

          <Text style={styles.bannerDesc}>
            Find answers to the most common questions about
            astrology, consultations, wallet, recharge and
            Kundli services.
          </Text>
        </View>

        {/* =================================================
            FAQ LIST
            ================================================= */}

        {faqData.map((item) => {
          const expanded = expandedId === item.id;

          return (
            <View
              key={item.id}
              style={styles.faqCard}
            >
              {/* QUESTION */}

              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.questionRow}
                onPress={() => toggleFAQ(item.id)}
              >
                <Text style={styles.question}>
                  {item.question}
                </Text>

                <Ionicons
                  name={
                    expanded
                      ? "remove-circle-outline"
                      : "add-circle-outline"
                  }
                  size={RF(24)}
                  color={Colors.primary}
                />
              </TouchableOpacity>

              {/* ANSWER */}

              {expanded && (
                <View style={styles.answerContainer}>
                  <Text style={styles.answer}>
                    {item.answer}
                  </Text>
                </View>
              )}
            </View>
          );
        })}

        <View style={{ height: hp(3) }} />
      </ScrollView>
    </SafeAreaView>
  );
}

/* =========================================================
   STYLES
   ========================================================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF8F4",
  },

  content: {
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

    justifyContent: "center",

    alignItems: "center",
  },

  headerTitle: {
    flex: 1,

    marginLeft: wp(3),

    fontSize: RF(20),

    color: Colors.darkBrown,

    fontWeight: "600",
  },

  headerRight: {
    width: wp(10),
  },

  /* ================= BANNER ================= */

  banner: {
    backgroundColor: "#FFF4EA",

    borderRadius: wp(5),

    alignItems: "center",

    paddingHorizontal: wp(5),

    paddingVertical: hp(3),

    marginBottom: hp(3),
  },

  bannerIcon: {
    width: wp(22),

    height: wp(22),

    borderRadius: wp(11),

    backgroundColor: "#FFF",

    justifyContent: "center",

    alignItems: "center",

    marginBottom: hp(1.5),

    elevation: 3,

    shadowColor: "#000",

    shadowOpacity: 0.08,

    shadowRadius: 8,

    shadowOffset: {
      width: 0,

      height: 3,
    },
  },

  bannerTitle: {
    color: Colors.darkBrown,

    fontSize: RF(18),

    textAlign: "center",

    fontWeight: "700",
  },

  bannerDesc: {
    marginTop: hp(1),

    textAlign: "center",

    color: "#666",

    fontSize: RF(13),

    lineHeight: RF(21),

    fontWeight: "400",
  },

  /* ================= FAQ CARD ================= */

  faqCard: {
    backgroundColor: "#FFF",

    borderRadius: wp(4),

    marginBottom: hp(1.8),

    overflow: "hidden",

    elevation: 2,

    shadowColor: "#000",

    shadowOpacity: 0.06,

    shadowRadius: 8,

    shadowOffset: {
      width: 0,

      height: 3,
    },
  },

  /* ================= QUESTION ================= */

  questionRow: {
    flexDirection: "row",

    justifyContent: "space-between",

    alignItems: "center",

    paddingHorizontal: wp(4),

    paddingVertical: hp(2),
  },

  question: {
    flex: 1,

    color: Colors.darkBrown,

    fontSize: RF(14),

    lineHeight: RF(20),

    fontWeight: "600",

    marginRight: wp(3),
  },

  /* ================= ANSWER ================= */

  answerContainer: {
    borderTopWidth: 1,

    borderTopColor: "#EFEFEF",

    paddingHorizontal: wp(4),

    paddingVertical: hp(2),

    backgroundColor: "#FFFDFB",
  },

  answer: {
    color: "#666",

    fontSize: RF(13),

    lineHeight: RF(22),

    fontWeight: "400",
  },
});