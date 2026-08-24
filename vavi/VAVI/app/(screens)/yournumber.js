import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { useRouter } from "expo-router";

import { LinearGradient } from "expo-linear-gradient";

import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";

import Colors from "../../constants/Colors";import { hp, RF, wp } from "../../utils/responsive";

const YourNumber = () => {
  const router = useRouter();

  const { lifePathNumber, title, description, aiInsight } =
    useLocalSearchParams();

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

          <Text style={styles.headerTitle}>Your Numbers</Text>

          <Ionicons name="sparkles" size={RF(20)} color={Colors.primary} />
        </View>

        {/* Result Card */}

        <View style={styles.resultCard}>
          {/* Decorative Sparkles */}

          <Ionicons
            name="sparkles"
            size={RF(13)}
            color="#FFD08A"
            style={styles.sparkleLeft}
          />

          <Ionicons
            name="sparkles"
            size={RF(13)}
            color="#FFD08A"
            style={styles.sparkleRight}
          />

          {/* Big Number */}

          <Text style={styles.numberText}>{lifePathNumber || "0"}</Text>

          {/* Title */}

          <Text style={styles.resultTitle}>{title || "Your Life Path"}</Text>

          {/* Badge */}

          <View style={styles.badge}>
            <Text style={styles.badgeText}>Life Path Number</Text>
          </View>

          {/* Divider */}

          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />

            <Ionicons name="star" size={RF(14)} color={Colors.primary} />

            <View style={styles.dividerLine} />
          </View>

          {/* Description */}

          <Text style={styles.resultDescription}>
            {description || "Your numerology details will appear here."}
          </Text>
        </View>

        {/* AI Insight Card */}

        <View style={styles.insightCard}>
          {/* AI Insight Header */}

          <View style={styles.insightHeader}>
            <View style={styles.insightIcon}>
              <LinearGradient
                colors={["#FFD45E", "#F4A300"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.insightGradient}
              >
                <Ionicons name="sparkles-outline" size={RF(20)} color="#FFF" />
              </LinearGradient>
            </View>

            <Text style={styles.insightTitle}>AI Insight</Text>
          </View>

          {/* Divider */}

          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />

            <Ionicons name="star" size={RF(13)} color={Colors.primary} />

            <View style={styles.dividerLine} />
          </View>

          {/* Insight Description */}

          <Text style={styles.insightDescription}>
            {aiInsight || "AI insight will appear here after calculation."}
          </Text>
        </View>

        {/* Bottom Button starts in Part 4 */}
        {/* Bottom Button */}

        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.buttonWrapper}
          onPress={() => {
            // TODO: Navigate to Consult Screen
          }}
        >
          <LinearGradient
            colors={["#FFB300", "#F57C00"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.consultButton}
          >
            {/* Left Icon */}

            <View style={styles.buttonIconContainer}>
              <Ionicons name="sparkles" size={RF(18)} color="#F39C12" />
            </View>

            {/* Button Text */}

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => router.push("/(tabs)")}
            >
              <Text style={styles.buttonText}>
                Consult with Your Astrologer
              </Text>
            </TouchableOpacity>

            {/* Right Arrow */}

            <Ionicons name="arrow-forward" size={RF(20)} color="#FFF" />
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default YourNumber;

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

  resultCard: {
    backgroundColor: "#FFF",
    borderRadius: wp(5),
    paddingHorizontal: wp(5),
    paddingVertical: hp(3),
    alignItems: "center",

    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 4,
    },

    elevation: 5,

    position: "relative",
  },

  sparkleLeft: {
    position: "absolute",
    left: wp(6),
    top: hp(2),
  },

  sparkleRight: {
    position: "absolute",
    right: wp(6),
    top: hp(2),
  },

  numberText: {
    fontSize: RF(70),
    color: Colors.primary,
    fontWeight: "700",
    lineHeight: RF(80),
  },

  resultTitle: {
    marginTop: hp(0.5),
    fontSize: RF(22),
    color: "#222",
    fontWeight: "700",
  },

  badge: {
    marginTop: hp(1.3),

    backgroundColor: "#FFF4E6",

    borderRadius: wp(6),

    paddingHorizontal: wp(4),

    paddingVertical: hp(0.8),

    borderWidth: 1,

    borderColor: "#FFE0B3",
  },

  badgeText: {
    color: Colors.primary,
    fontSize: RF(12),
    fontWeight: "600",
  },

  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginVertical: hp(2),
  },

  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#F4D7B8",
    marginHorizontal: wp(3),
  },

  resultDescription: {
    color: "#666",
    fontSize: RF(13),
    lineHeight: RF(21),
    textAlign: "center",
    fontWeight: "400",
  },

  insightCard: {
    marginTop: hp(2),

    backgroundColor: "#FFF",

    borderRadius: wp(5),

    padding: wp(5),

    shadowColor: "#000",

    shadowOpacity: 0.06,

    shadowRadius: 10,

    shadowOffset: {
      width: 0,
      height: 4,
    },

    elevation: 5,
  },

  insightHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: hp(1.5),
  },

  insightIcon: {
    marginRight: wp(2.5),
  },

  insightGradient: {
    width: wp(12),
    height: wp(12),
    borderRadius: wp(6),

    justifyContent: "center",
    alignItems: "center",

    shadowColor: "#F4A300",
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 4,
    },

    elevation: 5,
  },

  insightTitle: {
    color: "#222",
    fontSize: RF(20),
    fontWeight: "700",
  },

  insightDescription: {
    color: "#666",
    fontSize: RF(13),
    lineHeight: RF(22),
    textAlign: "center",
    fontWeight: "400",
  },

  buttonWrapper: {
    marginTop: hp(3),
    marginBottom: hp(3),
  },

  consultButton: {
    height: hp(6.8),

    borderRadius: wp(4),

    flexDirection: "row",

    alignItems: "center",

    justifyContent: "space-between",

    paddingHorizontal: wp(4),

    shadowColor: "#F39C12",

    shadowOpacity: 0.3,

    shadowRadius: 12,
    width: "100%",

    shadowOffset: {
      width: 0,
      height: 5,
    },

    elevation: 6,
  },

  buttonIconContainer: {
    width: wp(10),
    height: wp(10),
    borderRadius: wp(5),

    backgroundColor: "#FFF",

    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    flex: 1,

    color: "#FFF",

    textAlign: "center",

    fontSize: RF(17),

    fontWeight: "700",

    marginHorizontal: wp(3),

    includeFontPadding: false,

    textAlignVertical: "center",
  },
});
