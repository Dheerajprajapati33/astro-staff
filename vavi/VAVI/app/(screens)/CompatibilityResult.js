import { useRouter } from "expo-router";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

import Svg, { Circle, Path } from "react-native-svg";

import Colors from "../../constants/Colors";import { hp, RF, wp } from "../../utils/responsive";

const compatibilityData = [
  {
    id: 1,
    title: "Varna",
    subtitle: "Work",
    score: "1/1",
    icon: "briefcase-outline",
    progress: 100,
  },

  {
    id: 2,
    title: "Vasya",
    subtitle: "Attraction",
    score: "2/2",
    icon: "heart-outline",
    progress: 100,
  },

  {
    id: 3,
    title: "Tara",
    subtitle: "Comfort • Health",
    score: "3/3",
    icon: "star-outline",
    progress: 100,
  },

  {
    id: 4,
    title: "Yoni",
    subtitle: "Intimacy",
    score: "4/4",
    icon: "account-heart-outline",
    progress: 100,
  },

  {
    id: 5,
    title: "Rasi AdhiPathi",
    subtitle: "Friendship",
    score: "5/5",
    icon: "handshake-outline",
    progress: 100,
  },
];

export default function CompatibilityResult() {
  const router = useRouter();
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Header */}

        <View style={styles.header}>
          <TouchableOpacity activeOpacity={0.8} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={RF(22)} color={Colors.primary} />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Compatibility Result</Text>

          <TouchableOpacity>
            <MaterialCommunityIcons
              name="creation"
              size={RF(20)}
              color={Colors.primary}
            />
          </TouchableOpacity>
        </View>
        {/* Compatibility Score Card */}

        <View style={styles.scoreCard}>
          {/* Gauge */}

          <View style={styles.gaugeContainer}>
            <Svg width={wp(60)} height={hp(16)} viewBox="0 0 220 140">
              {/* Red */}

              <Path
                d="M35 110 A75 75 0 0 1 80 35"
                stroke="#FF5722"
                strokeWidth="12"
                fill="none"
                strokeLinecap="round"
              />

              {/* Yellow */}

              <Path
                d="M80 35 A75 75 0 0 1 140 35"
                stroke="#FFC107"
                strokeWidth="12"
                fill="none"
                strokeLinecap="round"
              />

              {/* Green */}

              <Path
                d="M140 35 A75 75 0 0 1 185 110"
                stroke="#4CAF50"
                strokeWidth="12"
                fill="none"
                strokeLinecap="round"
              />

              {/* Needle */}

              <Path
                d="M110 110 L155 72"
                stroke="#555"
                strokeWidth="4"
                strokeLinecap="round"
              />

              <Circle cx="110" cy="110" r="5" fill="#555" />
            </Svg>
          </View>

          {/* Score */}

          <View style={styles.scoreSection}>
            <Text style={styles.scoreValue}>
              <Text style={styles.scoreHighlight}>28</Text>

              <Text style={styles.totalScore}>/36</Text>
            </Text>

            <Text style={styles.scoreLabel}>Compatibility Score</Text>

            <View style={styles.statusBadge}>
              <Ionicons name="sparkles" size={RF(12)} color="#3BAE52" />

              <Text style={styles.statusText}>Good Compatibility</Text>
            </View>
          </View>
        </View>

        {/* Detailed Breakdown */}

        <View style={styles.sectionHeader}>
          <View style={styles.sectionIcon}>
            <Ionicons name="list" size={RF(18)} color={Colors.primary} />
          </View>

          <View>
            <Text style={styles.sectionTitle}>Detailed Breakdown</Text>

            <Text style={styles.sectionSubtitle}>
              Explore how well you both connect in key areas
            </Text>
          </View>
        </View>
        {/* Breakdown Cards */}

        {compatibilityData.map((item) => (
          <View key={item.id} style={styles.breakdownCard}>
            {/* Top Row */}

            <View style={styles.breakdownHeader}>
              <View style={styles.leftContent}>
                <View style={styles.iconBox}>
                  <MaterialCommunityIcons
                    name={item.icon}
                    size={RF(18)}
                    color={Colors.primary}
                  />
                </View>

                <View style={styles.textContent}>
                  <Text style={styles.breakdownTitle}>{item.title}</Text>

                  <Text style={styles.breakdownSubtitle}>{item.subtitle}</Text>
                </View>
              </View>

              {/* Score */}

              <View style={styles.scoreCircle}>
                <Text style={styles.scoreCircleText}>{item.score}</Text>
              </View>
            </View>

            {/* Progress */}

            <View style={styles.progressBackground}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${item.progress}%`,
                  },
                ]}
              />
            </View>
          </View>
        ))}

        {/* Note Card */}

        <View style={styles.noteCard}>
          <View style={styles.noteHeader}>
            <Ionicons
              name="information-circle-outline"
              size={RF(18)}
              color={Colors.primary}
            />

            <Text style={styles.noteTitle}>Note</Text>
          </View>

          <Text style={styles.noteDescription}>
            This compatibility score is based on traditional Vedic astrology
            principles. It provides a general indication of compatibility and
            should be considered along with a complete horoscope analysis.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF8F4",
  },

  content: {
    paddingHorizontal: wp(4),
    paddingBottom: hp(4),
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: hp(1),
    marginBottom: hp(2),
  },

  headerTitle: {
    flex: 1,
    textAlign: "center",
    color: Colors.primary,
    fontSize: RF(18),
    fontWeight: "700",
    marginHorizontal: wp(2),
  },

  scoreCard: {
    backgroundColor: Colors.white,
    borderRadius: wp(5),
    paddingVertical: hp(2.5),
    paddingHorizontal: wp(4),
    alignItems: "center",

    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 3,
    },

    elevation: 3,
  },

  gaugeContainer: {
    justifyContent: "center",
    alignItems: "center",
  },

  scoreSection: {
    alignItems: "center",
    marginTop: hp(-1),
  },

  scoreValue: {
    flexDirection: "row",
  },

  scoreHighlight: {
    color: Colors.primary,
    fontSize: RF(28),
    fontWeight: "700",
  },

  totalScore: {
    color: "#555",
    fontSize: RF(17),
    fontWeight: "600",
  },

  scoreLabel: {
    color: "#444",
    fontSize: RF(14),
    fontWeight: "500",
    marginTop: hp(0.3),
  },

  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EEF9EE",
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.6),
    borderRadius: wp(6),
    marginTop: hp(1.2),
  },

  statusText: {
    color: "#38A44D",
    fontSize: RF(11),
    fontWeight: "500",
    marginLeft: wp(1),
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: hp(3),
    marginBottom: hp(1.5),
  },

  sectionIcon: {
    width: wp(10),
    height: wp(10),
    borderRadius: wp(5),
    backgroundColor: "#FFF1E8",
    justifyContent: "center",
    alignItems: "center",
    marginRight: wp(3),
  },

  sectionTitle: {
    color: "#222",
    fontSize: RF(15),
    fontWeight: "700",
  },

  sectionSubtitle: {
    color: "#777",
    fontSize: RF(11),
    fontWeight: "400",
    marginTop: hp(0.2),
  },

  breakdownCard: {
    backgroundColor: Colors.white,
    borderRadius: wp(4),
    padding: wp(3.5),
    marginBottom: hp(1.4),

    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: {
      width: 0,
      height: 2,
    },

    elevation: 2,
  },

  breakdownHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  leftContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  iconBox: {
    width: wp(11),
    height: wp(11),
    borderRadius: wp(5.5),
    backgroundColor: "#FFF4EC",
    justifyContent: "center",
    alignItems: "center",
    marginRight: wp(3),
  },

  textContent: {
    flex: 1,
  },

  breakdownTitle: {
    color: "#222",
    fontSize: RF(14),
    fontWeight: "700",
  },

  breakdownSubtitle: {
    color: "#777",
    fontSize: RF(11),
    fontWeight: "400",
    marginTop: hp(0.2),
  },

  scoreCircle: {
    minWidth: wp(14),
    height: wp(9),
    borderRadius: wp(5),
    backgroundColor: "#EAF8EA",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: wp(2.5),
  },

  scoreCircleText: {
    color: "#36A853",
    fontSize: RF(12),
    fontWeight: "700",
  },

  progressBackground: {
    width: "100%",
    height: hp(0.9),
    backgroundColor: "#F3E6DD",
    borderRadius: hp(1),
    overflow: "hidden",
    marginTop: hp(1.4),
  },

  progressFill: {
    height: "100%",
    backgroundColor: Colors.primary,
    borderRadius: hp(1),
  },

  noteCard: {
    backgroundColor: "#FFFDF8",
    borderRadius: wp(4),
    borderWidth: 1,
    borderColor: "#FFE3C6",
    padding: wp(4),
    marginTop: hp(1),
    marginBottom: hp(3),
  },

  noteHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hp(1),
  },

  noteTitle: {
    color: Colors.primary,
    fontSize: RF(14),
    fontWeight: "700",
    marginLeft: wp(2),
  },

  noteDescription: {
    color: "#666",
    fontSize: RF(12),
    lineHeight: RF(19),
    fontWeight: "400",
  },
});
