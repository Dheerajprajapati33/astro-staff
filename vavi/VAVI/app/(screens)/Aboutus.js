import {
 
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

import Colors from "../../constants/Colors";import { hp, RF, wp } from "../../utils/responsive";

export default function AboutUs() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Header */}

        <View style={styles.header}>
          <TouchableOpacity activeOpacity={0.8} onPress={() => router.back()}>
            <Ionicons
              name="arrow-back"
              size={RF(24)}
              color={Colors.darkBrown}
            />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>About Us</Text>

          <View style={{ width: RF(24) }} />
        </View>

        {/* Logo */}

        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <Ionicons name="sparkles" size={RF(42)} color={Colors.primary} />
          </View>

          <Text style={styles.appName}>VAVI</Text>

          <Text style={styles.version}>Version 1.0.0</Text>
        </View>

        {/* About */}

        <View style={styles.card}>
          <Text style={styles.cardTitle}>About VAVI</Text>

          <Text style={styles.cardText}>
            VAVI is your trusted astrology platform connecting users with
            experienced astrologers through chat and voice consultations. Our
            mission is to provide accurate guidance, personalized Kundli,
            horoscope analysis and spiritual solutions in one secure platform.
          </Text>
        </View>

        {/* Mission */}

        <View style={styles.card}>
          <View style={styles.row}>
            <Ionicons name="rocket" size={RF(22)} color={Colors.primary} />

            <Text style={styles.rowTitle}>Our Mission</Text>
          </View>

          <Text style={styles.cardText}>
            To make authentic astrology accessible to everyone with trusted
            experts and modern technology.
          </Text>
        </View>

        {/* Vision */}

        <View style={styles.card}>
          <View style={styles.row}>
            <Ionicons name="eye" size={RF(22)} color={Colors.primary} />

            <Text style={styles.rowTitle}>Our Vision</Text>
          </View>

          <Text style={styles.cardText}>
            To become India's most trusted astrology platform delivering
            guidance, positivity and clarity to millions of users.
          </Text>
        </View>

        {/* Features */}

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Why Choose VAVI?</Text>

          <Text style={styles.feature}>✓ Verified Astrologers</Text>

          <Text style={styles.feature}>✓ Instant Chat & Voice Call</Text>

          <Text style={styles.feature}>✓ Free Kundli</Text>

          <Text style={styles.feature}>✓ Secure Wallet</Text>

          <Text style={styles.feature}>✓ Fast Customer Support</Text>
        </View>

        {/* Contact */}

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Contact Us</Text>

          <Text style={styles.contact}>📧 support@vavi.com</Text>

          <Text style={styles.contact}>📞 +91 98765 43210</Text>

          <Text style={styles.contact}>🌐 www.vavi.com</Text>
        </View>

        {/* Footer */}

        <Text style={styles.footer}>© 2026 VAVI. All Rights Reserved.</Text>
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

  /* ================= HEADER ================= */

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    marginTop: hp(1),
    marginBottom: hp(2),
  },

  headerTitle: {
    fontSize: RF(20),
    color: Colors.darkBrown,
    fontWeight: "600",
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

    color: Colors.primary,

    fontSize: RF(28),

    fontWeight: "700",
  },

  version: {
    marginTop: hp(0.5),

    color: "#777",

    fontSize: RF(13),

    fontWeight: "500",
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

  cardTitle: {
    color: Colors.darkBrown,

    fontSize: RF(16),

    fontWeight: "600",

    marginBottom: hp(1),
  },

  cardText: {
    color: "#666",

    fontSize: RF(13),

    lineHeight: RF(22),

    fontWeight: "400",
  },

  /* ================= ROW ================= */

  row: {
    flexDirection: "row",
    alignItems: "center",

    marginBottom: hp(1),
  },

  rowTitle: {
    marginLeft: wp(2),

    color: Colors.darkBrown,

    fontSize: RF(15),

    fontWeight: "600",
  },

  /* ================= FEATURES ================= */

  feature: {
    color: "#555",

    fontSize: RF(14),

    fontWeight: "500",

    marginBottom: hp(1),
  },

  /* ================= CONTACT ================= */

  contact: {
    color: "#555",

    fontSize: RF(14),

    fontWeight: "500",

    marginBottom: hp(1),
  },

  /* ================= FOOTER ================= */

  footer: {
    marginTop: hp(2),
    marginBottom: hp(3),

    textAlign: "center",

    color: "#999",

    fontSize: RF(12),

    fontWeight: "400",
  },
});
