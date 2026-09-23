import React, { useMemo, useState } from "react";
import {
  Dimensions,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import Colors from "../../constants/Colors";
import { HOROSCOPE_DATA, RASHIS } from "../../data/horoscopeData";
import { hp, RF, wp } from "../../utils/responsive";

const DAYS_SHORT = [
  { id: 0, en: "Sun", hi: "रवि" },
  { id: 1, en: "Mon", hi: "सोम" },
  { id: 2, en: "Tue", hi: "मंगल" },
  { id: 3, en: "Wed", hi: "बुध" },
  { id: 4, en: "Thu", hi: "गुरु" },
  { id: 5, en: "Fri", hi: "शुक्र" },
  { id: 6, en: "Sat", hi: "शनि" },
];

export default function HoroscopeScreen() {
  // Current real day index (0 = Sunday ... 6 = Saturday)
  const currentRealDay = useMemo(() => new Date().getDay(), []);

  // Selected Day (defaults to today's day)
  const [selectedDay, setSelectedDay] = useState(currentRealDay);

  // Selected Rashi (defaults to mesh / first rashi)
  const [selectedRashi, setSelectedRashi] = useState("mesh");

  // Get active rashi details
  const activeRashiInfo = useMemo(() => {
    return RASHIS.find((r) => r.id === selectedRashi) || RASHIS[0];
  }, [selectedRashi]);

  // Get active horoscope for selected rashi & day
  const activeHoroscope = useMemo(() => {
    const list = HOROSCOPE_DATA[selectedRashi] || HOROSCOPE_DATA["mesh"];
    return list[selectedDay] || list[0];
  }, [selectedRashi, selectedDay]);

  // Format today's human readable date
  const formattedDate = useMemo(() => {
    const d = new Date();
    const options = { day: "numeric", month: "short", year: "numeric" };
    return d.toLocaleDateString("en-IN", options);
  }, []);

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={Colors.warmCream || "#FFF8EE"}
      />

      {/* TOP HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={RF(22)} color={Colors.darkBrown} />
        </TouchableOpacity>

        <View style={styles.headerTitleWrap}>
          <Text style={styles.headerTitle}>दैनिक राशिफल</Text>
          <Text style={styles.headerSubtitle}>Daily Horoscope</Text>
        </View>

        <View style={styles.dateBadge}>
          <Ionicons
            name="calendar-outline"
            size={RF(13)}
            color={Colors.primary}
          />
          <Text style={styles.dateText}>{formattedDate}</Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* RASHI SELECTOR TABS */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>अपनी राशि चुनें</Text>
          <Text style={styles.sectionSub}>Select Zodiac Sign</Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.rashiScroll}
        >
          {RASHIS.map((rashi) => {
            const isSelected = selectedRashi === rashi.id;
            return (
              <TouchableOpacity
                key={rashi.id}
                style={[styles.rashiTab, isSelected && styles.rashiTabActive]}
                onPress={() => setSelectedRashi(rashi.id)}
                activeOpacity={0.8}
              >
                <View
                  style={[
                    styles.rashiSymbolCircle,
                    isSelected && styles.rashiSymbolCircleActive,
                  ]}
                >
                  <Text style={styles.rashiSymbol}>{rashi.symbol}</Text>
                </View>
                <Text
                  style={[
                    styles.rashiHindiName,
                    isSelected && styles.rashiTextActive,
                  ]}
                >
                  {rashi.hindiName}
                </Text>
                <Text
                  style={[
                    styles.rashiEnName,
                    isSelected && styles.rashiEnNameActive,
                  ]}
                >
                  {rashi.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* DAY SELECTOR (SUNDAY TO SATURDAY) */}
        <View style={styles.daySelectorContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.dayScroll}
          >
            {DAYS_SHORT.map((item) => {
              const isSelected = selectedDay === item.id;
              const isToday = currentRealDay === item.id;
              return (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.dayPill, isSelected && styles.dayPillActive]}
                  onPress={() => setSelectedDay(item.id)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.dayPillText,
                      isSelected && styles.dayPillTextActive,
                    ]}
                  >
                    {item.hi}
                  </Text>
                  <Text
                    style={[
                      styles.dayPillSub,
                      isSelected && styles.dayPillSubActive,
                    ]}
                  >
                    {item.en}
                  </Text>
                  {isToday && (
                    <View
                      style={[
                        styles.todayDot,
                        isSelected && styles.todayDotActive,
                      ]}
                    />
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* ACTIVE RASHI BANNER */}
        <View style={styles.rashiBanner}>
          <View style={styles.rashiBannerLeft}>
            <View style={styles.bannerSymbolBox}>
              <Text style={styles.bannerSymbol}>{activeRashiInfo.symbol}</Text>
            </View>
            <View>
              <View style={styles.rashiNameRow}>
                <Text style={styles.bannerHindiName}>
                  {activeRashiInfo.hindiName}
                </Text>
                <Text style={styles.bannerEnName}>
                  ({activeRashiInfo.name})
                </Text>
              </View>
              <Text style={styles.bannerDates}>{activeRashiInfo.dates}</Text>
            </View>
          </View>

          <View style={styles.dayTag}>
            <Ionicons name="sparkles" size={RF(13)} color="#FF8A00" />
            <Text style={styles.dayTagText}>
              {activeHoroscope.dayHindi} • {activeHoroscope.day}
            </Text>
          </View>
        </View>

        {/* MAIN PREDICTION CARD */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.cardIconBox}>
              <Ionicons name="planet" size={RF(18)} color={Colors.primary} />
            </View>
            <View style={styles.cardTitleWrap}>
              <Text style={styles.cardCategory}>आज का राशिफल</Text>
              <Text style={styles.cardMainHeading}>
                {activeHoroscope.title}
              </Text>
            </View>
          </View>

          <Text style={styles.predictionText}>
            {activeHoroscope.prediction}
          </Text>

          {/* RATINGS METRICS */}
          {activeHoroscope.ratings && (
            <View style={styles.metricsGrid}>
              <View style={styles.metricItem}>
                <Text style={styles.metricLabel}>करियर</Text>
                <View style={styles.progressBarBg}>
                  <View
                    style={[
                      styles.progressBarFill,
                      {
                        width: `${activeHoroscope.ratings.career}%`,
                        backgroundColor: "#3B82F6",
                      },
                    ]}
                  />
                </View>
                <Text style={styles.metricPercent}>
                  {activeHoroscope.ratings.career}%
                </Text>
              </View>

              <View style={styles.metricItem}>
                <Text style={styles.metricLabel}>प्रेम</Text>
                <View style={styles.progressBarBg}>
                  <View
                    style={[
                      styles.progressBarFill,
                      {
                        width: `${activeHoroscope.ratings.love}%`,
                        backgroundColor: "#EC4899",
                      },
                    ]}
                  />
                </View>
                <Text style={styles.metricPercent}>
                  {activeHoroscope.ratings.love}%
                </Text>
              </View>

              <View style={styles.metricItem}>
                <Text style={styles.metricLabel}>स्वास्थ्य</Text>
                <View style={styles.progressBarBg}>
                  <View
                    style={[
                      styles.progressBarFill,
                      {
                        width: `${activeHoroscope.ratings.health}%`,
                        backgroundColor: "#10B981",
                      },
                    ]}
                  />
                </View>
                <Text style={styles.metricPercent}>
                  {activeHoroscope.ratings.health}%
                </Text>
              </View>

              <View style={styles.metricItem}>
                <Text style={styles.metricLabel}>आर्थिक</Text>
                <View style={styles.progressBarBg}>
                  <View
                    style={[
                      styles.progressBarFill,
                      {
                        width: `${activeHoroscope.ratings.finance}%`,
                        backgroundColor: "#F59E0B",
                      },
                    ]}
                  />
                </View>
                <Text style={styles.metricPercent}>
                  {activeHoroscope.ratings.finance}%
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* LUCKY ATTRIBUTES GRID */}
        <View style={styles.gridContainer}>
          {/* Lucky Number */}
          <View style={styles.gridCard}>
            <View
              style={[styles.gridIconCircle, { backgroundColor: "#EFF6FF" }]}
            >
              <Ionicons name="dice-outline" size={RF(18)} color="#2563EB" />
            </View>
            <Text style={styles.gridLabel}>शुभ अंक (Lucky No.)</Text>
            <Text style={styles.gridValue}>{activeHoroscope.luckyNumber}</Text>
          </View>

          {/* Lucky Color */}
          <View style={styles.gridCard}>
            <View
              style={[styles.gridIconCircle, { backgroundColor: "#FDF2F8" }]}
            >
              <Ionicons
                name="color-palette-outline"
                size={RF(18)}
                color="#DB2777"
              />
            </View>
            <Text style={styles.gridLabel}>शुभ रंग (Lucky Color)</Text>
            <Text style={styles.gridValue} numberOfLines={1}>
              {activeHoroscope.luckyColor}
            </Text>
          </View>

          {/* Lucky Time */}
          <View style={styles.gridCard}>
            <View
              style={[styles.gridIconCircle, { backgroundColor: "#FEF3C7" }]}
            >
              <Ionicons name="time-outline" size={RF(18)} color="#D97706" />
            </View>
            <Text style={styles.gridLabel}>शुभ समय (Lucky Time)</Text>
            <Text style={styles.gridValue} numberOfLines={1}>
              {activeHoroscope.luckyTime}
            </Text>
          </View>

          {/* Mood */}
          <View style={styles.gridCard}>
            <View
              style={[styles.gridIconCircle, { backgroundColor: "#ECFDF5" }]}
            >
              <Ionicons name="happy-outline" size={RF(18)} color="#059669" />
            </View>
            <Text style={styles.gridLabel}>मनोदशा (Mood)</Text>
            <Text style={styles.gridValue} numberOfLines={1}>
              {activeHoroscope.mood}
            </Text>
          </View>
        </View>

        {/* SPECIAL REMEDY / AAJ KA VISHESH UPAY */}
        <View style={styles.remedyCard}>
          <View style={styles.remedyHeader}>
            <View style={styles.remedyIconBox}>
              <Ionicons name="flame" size={RF(20)} color="#FF5A00" />
            </View>
            <View>
              <Text style={styles.remedyTitle}>आज का विशेष महाउपाय</Text>
              <Text style={styles.remedySub}>Daily Astrological Remedy</Text>
            </View>
          </View>

          <Text style={styles.remedyContent}>{activeHoroscope.remedy}</Text>
        </View>

        <View style={{ height: hp(4) }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFF8F4",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: wp(4.5),
    paddingVertical: hp(1.2),
    backgroundColor: "#FFF8F4",
  },
  backButton: {
    width: wp(10),
    height: wp(10),
    borderRadius: wp(5),
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  headerTitleWrap: {
    alignItems: "center",
  },
  headerTitle: {
    fontSize: RF(18),
    fontWeight: "800",
    color: Colors.darkBrown || "#3A2317",
  },
  headerSubtitle: {
    fontSize: RF(11),
    fontWeight: "500",
    color: "#888888",
  },
  dateBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: wp(2.5),
    paddingVertical: hp(0.6),
    borderRadius: wp(4),
    gap: 4,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  dateText: {
    fontSize: RF(11),
    fontWeight: "600",
    color: Colors.darkBrown || "#3A2317",
  },
  scrollContent: {
    paddingBottom: hp(5),
  },
  sectionHeader: {
    paddingHorizontal: wp(5),
    marginTop: hp(1.5),
    marginBottom: hp(1),
  },
  sectionTitle: {
    fontSize: RF(15),
    fontWeight: "700",
    color: Colors.darkBrown || "#3A2317",
  },
  sectionSub: {
    fontSize: RF(11),
    color: "#8A8A8A",
  },
  rashiScroll: {
    paddingHorizontal: wp(4),
    paddingVertical: hp(0.5),
  },
  rashiTab: {
    width: wp(20),
    paddingVertical: hp(1.2),
    backgroundColor: "#FFFFFF",
    borderRadius: wp(4),
    alignItems: "center",
    marginRight: wp(2.5),
    borderWidth: 1.5,
    borderColor: "#F0E4D8",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  rashiTabActive: {
    backgroundColor: Colors.primary || "#FF8A00",
    borderColor: Colors.primary || "#FF8A00",
    transform: [{ scale: 1.03 }],
  },
  rashiSymbolCircle: {
    width: wp(10),
    height: wp(10),
    borderRadius: wp(5),
    backgroundColor: "#FFF3E6",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: hp(0.6),
  },
  rashiSymbolCircleActive: {
    backgroundColor: "#FFFFFF",
  },
  rashiSymbol: {
    fontSize: RF(18),
  },
  rashiHindiName: {
    fontSize: RF(13),
    fontWeight: "700",
    color: Colors.darkBrown || "#3A2317",
  },
  rashiEnName: {
    fontSize: RF(10),
    fontWeight: "500",
    color: "#888888",
  },
  rashiTextActive: {
    color: "#FFFFFF",
  },
  rashiEnNameActive: {
    color: "#FFF0E0",
  },

  // Day Selector
  daySelectorContainer: {
    marginTop: hp(1.5),
    paddingHorizontal: wp(4),
  },
  dayScroll: {
    paddingVertical: hp(0.5),
  },
  dayPill: {
    paddingHorizontal: wp(3.5),
    paddingVertical: hp(0.8),
    backgroundColor: "#FFFFFF",
    borderRadius: wp(3),
    marginRight: wp(2),
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#EFE5DC",
    minWidth: wp(12),
  },
  dayPillActive: {
    backgroundColor: "#3A2317",
    borderColor: "#3A2317",
  },
  dayPillText: {
    fontSize: RF(12),
    fontWeight: "700",
    color: "#3A2317",
  },
  dayPillTextActive: {
    color: "#FFFFFF",
  },
  dayPillSub: {
    fontSize: RF(9),
    fontWeight: "500",
    color: "#888888",
  },
  dayPillSubActive: {
    color: "#E0D7D0",
  },
  todayDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.primary || "#FF8A00",
    marginTop: 2,
  },
  todayDotActive: {
    backgroundColor: "#FFC24A",
  },

  // Rashi Banner
  rashiBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    marginHorizontal: wp(4.5),
    marginTop: hp(2),
    padding: wp(4),
    borderRadius: wp(4),
    borderWidth: 1,
    borderColor: "#F2E6DD",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  rashiBannerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(3),
  },
  bannerSymbolBox: {
    width: wp(13),
    height: wp(13),
    borderRadius: wp(3),
    backgroundColor: "#FFF3E6",
    alignItems: "center",
    justifyContent: "center",
  },
  bannerSymbol: {
    fontSize: RF(24),
  },
  rashiNameRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 6,
  },
  bannerHindiName: {
    fontSize: RF(18),
    fontWeight: "800",
    color: Colors.darkBrown || "#3A2317",
  },
  bannerEnName: {
    fontSize: RF(13),
    fontWeight: "600",
    color: "#777777",
  },
  bannerDates: {
    fontSize: RF(11),
    color: "#999999",
    marginTop: 2,
  },
  dayTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF3E6",
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.6),
    borderRadius: wp(3),
    gap: 4,
  },
  dayTagText: {
    fontSize: RF(11),
    fontWeight: "700",
    color: "#D96500",
  },

  // Main Card
  card: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: wp(4.5),
    marginTop: hp(2),
    padding: wp(4.5),
    borderRadius: wp(4),
    borderWidth: 1,
    borderColor: "#F2E6DD",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(3),
    marginBottom: hp(1.2),
  },
  cardIconBox: {
    width: wp(10),
    height: wp(10),
    borderRadius: wp(5),
    backgroundColor: "#FFF3E6",
    alignItems: "center",
    justifyContent: "center",
  },
  cardTitleWrap: {
    flex: 1,
  },
  cardCategory: {
    fontSize: RF(11),
    fontWeight: "600",
    color: Colors.primary || "#FF8A00",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  cardMainHeading: {
    fontSize: RF(15),
    fontWeight: "700",
    color: Colors.darkBrown || "#3A2317",
  },
  predictionText: {
    fontSize: RF(13),
    lineHeight: RF(20),
    color: "#4A4A4A",
    fontWeight: "400",
    marginBottom: hp(1.8),
  },

  // Metrics Grid
  metricsGrid: {
    borderTopWidth: 1,
    borderTopColor: "#F4ECE4",
    paddingTop: hp(1.5),
    gap: hp(1),
  },
  metricItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  metricLabel: {
    width: wp(18),
    fontSize: RF(12),
    fontWeight: "600",
    color: "#555555",
  },
  progressBarBg: {
    flex: 1,
    height: hp(0.9),
    backgroundColor: "#F0E8DF",
    borderRadius: 4,
    marginHorizontal: wp(2.5),
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 4,
  },
  metricPercent: {
    width: wp(10),
    textAlign: "right",
    fontSize: RF(11),
    fontWeight: "700",
    color: "#666666",
  },

  // 2x2 Grid
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginHorizontal: wp(4.5),
    marginTop: hp(2),
    gap: wp(3),
  },
  gridCard: {
    width: (wp(91) - wp(3)) / 2,
    backgroundColor: "#FFFFFF",
    borderRadius: wp(3.5),
    padding: wp(3.5),
    borderWidth: 1,
    borderColor: "#F2E6DD",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  gridIconCircle: {
    width: wp(8.5),
    height: wp(8.5),
    borderRadius: wp(4.25),
    alignItems: "center",
    justifyContent: "center",
    marginBottom: hp(0.8),
  },
  gridLabel: {
    fontSize: RF(10),
    fontWeight: "500",
    color: "#888888",
    marginBottom: 2,
  },
  gridValue: {
    fontSize: RF(13),
    fontWeight: "700",
    color: Colors.darkBrown || "#3A2317",
  },

  // Remedy Card
  remedyCard: {
    backgroundColor: "#FFF7EE",
    marginHorizontal: wp(4.5),
    marginTop: hp(2),
    padding: wp(4.5),
    borderRadius: wp(4),
    borderWidth: 1.5,
    borderColor: "#FFD2A6",
    shadowColor: "#FF8A00",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  remedyHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(3),
    marginBottom: hp(1),
  },
  remedyIconBox: {
    width: wp(10),
    height: wp(10),
    borderRadius: wp(5),
    backgroundColor: "#FFE3C7",
    alignItems: "center",
    justifyContent: "center",
  },
  remedyTitle: {
    fontSize: RF(14),
    fontWeight: "800",
    color: "#B44300",
  },
  remedySub: {
    fontSize: RF(10),
    color: "#A05A2C",
  },
  remedyContent: {
    fontSize: RF(12.5),
    lineHeight: RF(19),
    color: "#5C3518",
    fontWeight: "500",
  },
});
