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

import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

import Colors from "../../constants/Colors";import { hp, RF, wp } from "../../utils/responsive";

export default function DiscoverNumbar() {
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

          <Text style={styles.headerTitle}>Discover Your Numbers</Text>

          <View style={{ width: wp(6) }} />
        </View>

        {/* Hero Section */}

        <View style={styles.heroContainer}>
          {/* Decorative Background */}

          <View style={styles.heroDecoration}>
            {/* Left Circle */}

            <View style={styles.leftCircle} />

            {/* Right Triangle */}

            <Ionicons
              name="triangle-outline"
              size={RF(22)}
              color="#FFD8B5"
              style={styles.rightTriangle}
            />

            {/* Sparkles */}

            <Ionicons
              name="sparkles"
              size={RF(13)}
              color="#FFD08A"
              style={styles.sparkleOne}
            />

            <Ionicons
              name="sparkles"
              size={RF(11)}
              color="#FFE1B9"
              style={styles.sparkleTwo}
            />

            <Ionicons
              name="sparkles"
              size={RF(10)}
              color="#FFD08A"
              style={styles.sparkleThree}
            />
          </View>

          {/* Star Illustration */}

          <View style={styles.starWrapper}>
            <View style={styles.outerRing} />

            <View style={styles.starCircle}>
              <Ionicons
                name="star-outline"
                size={RF(62)}
                color={Colors.primary}
              />
            </View>
          </View>

          {/* Subtitle */}

          <Text style={styles.heroDescription}>
            Unlock the mysteries of your soul through{"\n"}
            ancient numerology
          </Text>
        </View>

        {/* Main Card */}

        <View style={styles.mainCard}>
          {/* Decorative Sparkle */}

          <Ionicons
            name="sparkles"
            size={RF(14)}
            color="#FFD08A"
            style={styles.cardSparkleLeft}
          />

          <Ionicons
            name="sparkles"
            size={RF(14)}
            color="#FFD08A"
            style={styles.cardSparkleRight}
          />

          {/* Heading */}

          <Text style={styles.cardTitle}>
            Your Cosmic Blueprint{"\n"}
            Awaits
          </Text>

          {/* Divider */}

          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />

            <Ionicons name="star" size={RF(15)} color={Colors.primary} />

            <View style={styles.dividerLine} />
          </View>

          {/* Description */}

          <Text style={styles.cardDescription}>
            Powered by AI and ancient wisdom,{"\n"}
            discover the hidden meanings behind your{"\n"}
            numbers
          </Text>

          {/* Feature Card 1 */}

          <View style={styles.featureCard}>
            <View style={styles.iconContainer}>
              <LinearGradient
                colors={["#FFD54F", "#F9A825"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.iconGradient}
              >
                <Ionicons name="star-outline" size={RF(22)} color="#FFF" />
              </LinearGradient>
            </View>

            <View style={styles.featureTextContainer}>
              <Text style={styles.featureTitle}>AI-Powered Insights</Text>

              <Text style={styles.featureSubtitle}>
                Deep personalized analysis
              </Text>
            </View>
          </View>

          {/* Feature Card 2 starts in Part 4 */}
          {/* Feature Card 2 */}

          <View style={styles.featureCard}>
            <View style={styles.iconContainer}>
              <LinearGradient
                colors={["#FFB74D", "#FB8C00"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.iconGradient}
              >
                <MaterialCommunityIcons
                  name="calculator-variant-outline"
                  size={RF(22)}
                  color="#FFF"
                />
              </LinearGradient>
            </View>

            <View style={styles.featureTextContainer}>
              <Text style={styles.featureTitle}>Sacred Mathematics</Text>

              <Text style={styles.featureSubtitle}>
                Ancient numerology calculations
              </Text>
            </View>
          </View>
        </View>

        {/* Bottom CTA */}

        <TouchableOpacity activeOpacity={0.9} style={styles.buttonWrapper}
        onPress={() => router.push("/sacreddetail")}
        >
          <LinearGradient
            colors={["#FF9800", "#FF6A00"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.calculateButton}
          >
            <MaterialCommunityIcons
              name="calculator"
              size={RF(22)}
              color="#FFF"
            />

            <Text style={styles.calculateButtonText}>
              Calculate Life Path Number
            </Text>

            <Ionicons name="arrow-forward" size={RF(20)} color="#FFF" />
          </LinearGradient>
        </TouchableOpacity>
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
  },

  heroContainer: {
    alignItems: "center",
    marginTop: hp(1),
    marginBottom: hp(2),
    position: "relative",
  },

  heroDecoration: {
    ...StyleSheet.absoluteFillObject,
  },

  leftCircle: {
    position: "absolute",
    left: wp(8),
    top: hp(3),

    width: wp(8),

    height: wp(8),

    borderRadius: wp(4),

    backgroundColor: "#FFE9D5",
  },

  rightTriangle: {
    position: "absolute",
    right: wp(10),
    top: hp(4),
  },

  sparkleOne: {
    position: "absolute",
    left: wp(20),
    top: hp(1),
  },

  sparkleTwo: {
    position: "absolute",
    right: wp(18),
    top: hp(8),
  },

  sparkleThree: {
    position: "absolute",
    left: wp(28),
    top: hp(11),
  },

  starWrapper: {
    width: wp(42),

    height: wp(42),

    justifyContent: "center",

    alignItems: "center",
  },

  outerRing: {
    position: "absolute",

    width: wp(34),

    height: wp(34),

    borderRadius: wp(17),

    borderWidth: 2,

    borderColor: "#FFE2C2",
  },

  starCircle: {
    width: wp(26),

    height: wp(26),

    borderRadius: wp(13),

    backgroundColor: "#FFF",

    justifyContent: "center",

    alignItems: "center",

    shadowColor: "#000",

    shadowOpacity: 0.06,

    shadowRadius: 10,

    shadowOffset: {
      width: 0,
      height: 3,
    },

    elevation: 4,
  },

  heroDescription: {
    marginTop: hp(1),

    textAlign: "center",

    color: "#666",

    fontSize: RF(13),

    lineHeight: RF(20),

    fontWeight: "400",
  },

  mainCard: {
    backgroundColor: "#FFF",

    borderRadius: wp(5),

    padding: wp(5),

    marginTop: hp(1),

    position: "relative",

    shadowColor: "#000",

    shadowOpacity: 0.05,

    shadowRadius: 8,

    shadowOffset: {
      width: 0,
      height: 3,
    },

    elevation: 3,
  },

  cardSparkleLeft: {
    position: "absolute",

    top: hp(2),

    left: wp(4),
  },

  cardSparkleRight: {
    position: "absolute",

    top: hp(2),

    right: wp(4),
  },

  cardTitle: {
    color: Colors.primary,

    fontSize: RF(24),

    fontWeight: "700",

    textAlign: "center",

    lineHeight: RF(32),

    marginTop: hp(1),
  },

  dividerContainer: {
    flexDirection: "row",

    alignItems: "center",

    justifyContent: "center",

    marginVertical: hp(2),
  },

  dividerLine: {
    flex: 1,

    height: 1,

    backgroundColor: "#F2D5B8",

    marginHorizontal: wp(3),
  },

  cardDescription: {
    color: "#666",

    fontSize: RF(13),

    fontWeight: "400",

    textAlign: "center",

    lineHeight: RF(20),

    marginBottom: hp(2),
  },

  featureCard: {
    flexDirection: "row",

    alignItems: "center",

    backgroundColor: "#FFF9F3",

    borderRadius: wp(4),

    padding: wp(4),

    marginTop: hp(1.2),

    borderWidth: 1,

    borderColor: "#FFE6CC",
  },

  iconContainer: {
    marginRight: wp(3),
  },

  iconGradient: {
    width: wp(12),

    height: wp(12),

    borderRadius: wp(6),

    justifyContent: "center",

    alignItems: "center",
  },

  featureTextContainer: {
    flex: 1,
  },

  featureTitle: {
    color: "#222",

    fontSize: RF(14),

    fontWeight: "700",
  },

  featureSubtitle: {
    color: "#777",

    fontSize: RF(11),

    fontWeight: "400",

    marginTop: hp(0.3),
  },

  buttonWrapper: {
    marginTop: hp(3),

    marginBottom: hp(3),
  },

  calculateButton: {
    height: hp(6.5),

    borderRadius: wp(4),

    flexDirection: "row",

    justifyContent: "center",

    alignItems: "center",

    shadowColor: "#FF8A00",

    shadowOpacity: 0.25,

    shadowRadius: 10,

    shadowOffset: {
      width: 0,
      height: 4,
    },

    elevation: 6,
  },

  calculateButtonText: {
    color: "#FFF",

    fontSize: RF(15),

    fontWeight: "700",

    marginHorizontal: wp(3),
  },
});
