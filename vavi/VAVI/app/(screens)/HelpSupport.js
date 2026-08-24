import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import Colors from "../../constants/Colors";import { hp, RF, wp } from "../../utils/responsive";

export default function HelpSupport() {
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

          <Text style={styles.headerTitle}>Help & Support</Text>

          <View style={{ width: RF(24) }} />
        </View>

        {/* Top Banner */}

        <View style={styles.banner}>
          <View style={styles.bannerLeft}>
            <Text style={styles.bannerTitle}>We're here to help you!</Text>

            <Text style={styles.bannerDesc}>
              Our support team is always ready to assist you with any questions,
              payments, bookings or technical issues.
            </Text>
          </View>

          <View style={styles.bannerIcon}>
            <Ionicons name="headset" size={RF(48)} color={Colors.primary} />
          </View>
        </View>
        {/* ================= Contact Cards ================= */}

        {/* Call Us */}

        <TouchableOpacity activeOpacity={0.8} style={styles.card}>
          <View style={styles.iconContainer}>
            <Ionicons name="call" size={RF(24)} color={Colors.primary} />
          </View>

          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Call Us</Text>

            <Text style={styles.cardSubtitle}>
              Speak directly with our support team for instant help.
            </Text>

            <Text style={styles.cardValue}>+91 98765 43210</Text>
          </View>

          <Ionicons
            name="chevron-forward"
            size={RF(22)}
            color={Colors.primary}
          />
        </TouchableOpacity>

        {/* Email Us */}

        <TouchableOpacity activeOpacity={0.8} style={styles.card}>
          <View style={styles.iconContainer}>
            <MaterialIcons name="email" size={RF(24)} color={Colors.primary} />
          </View>

          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Email Us</Text>

            <Text style={styles.cardSubtitle}>
              Drop us an email and we'll get back to you soon.
            </Text>

            <Text style={styles.cardValue}>support@vavi.com</Text>
          </View>

          <Ionicons
            name="chevron-forward"
            size={RF(22)}
            color={Colors.primary}
          />
        </TouchableOpacity>

        {/* WhatsApp */}

        <TouchableOpacity activeOpacity={0.8} style={styles.card}>
          <View
            style={[
              styles.iconContainer,
              {
                backgroundColor: "#EAF9EF",
              },
            ]}
          >
            <Ionicons name="logo-whatsapp" size={RF(24)} color="#25D366" />
          </View>

          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>WhatsApp Us</Text>

            <Text style={styles.cardSubtitle}>
              Chat with us on WhatsApp for quick assistance.
            </Text>

            <Text
              style={[
                styles.cardValue,
                {
                  color: "#25D366",
                },
              ]}
            >
              +91 98765 43210
            </Text>
          </View>

          <Ionicons
            name="chevron-forward"
            size={RF(22)}
            color={Colors.primary}
          />
        </TouchableOpacity>

        {/* Trust Banner */}

        <View style={styles.trustCard}>
          <View style={styles.trustIcon}>
            <Ionicons name="shield-checkmark" size={RF(28)} color="#F59E0B" />
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.trustTitle}>We value your trust</Text>

            <Text style={styles.trustDesc}>
              Your privacy and personal information are always protected. Our
              support team is committed to providing secure and reliable
              assistance.
            </Text>
          </View>
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

  /* ================= HEADER ================= */

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: hp(1),
    marginBottom: hp(2),
  },

  headerTitle: {
    fontSize: RF(19),
    color: Colors.darkBrown,
    fontWeight: "600",
  },

  /* ================= TOP BANNER ================= */

  banner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    backgroundColor: "#FFF4EA",

    borderRadius: wp(5),

    paddingHorizontal: wp(5),

    paddingVertical: hp(2.5),

    marginBottom: hp(2.5),
  },

  bannerLeft: {
    flex: 1,
    paddingRight: wp(3),
  },

  bannerTitle: {
    fontSize: RF(20),
    color: Colors.darkBrown,
    fontWeight: "700",
  },

  bannerDesc: {
    marginTop: hp(1),

    color: "#666",

    fontSize: RF(13),

    lineHeight: RF(20),

    fontWeight: "400",
  },

  bannerIcon: {
    width: wp(22),
    height: wp(22),

    borderRadius: wp(11),

    backgroundColor: "#FFF",

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

  /* ================= CONTACT CARD ================= */

  card: {
    flexDirection: "row",

    alignItems: "center",

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

  iconContainer: {
    width: wp(14),

    height: wp(14),

    borderRadius: wp(7),

    backgroundColor: "#FFF5EC",

    justifyContent: "center",

    alignItems: "center",
  },

  cardContent: {
    flex: 1,
    marginLeft: wp(4),
  },

  cardTitle: {
    color: Colors.darkBrown,

    fontSize: RF(15),

    fontWeight: "600",
  },

  cardSubtitle: {
    marginTop: hp(0.5),

    color: "#777",

    fontSize: RF(12),

    lineHeight: RF(18),

    fontWeight: "400",
  },

  cardValue: {
    marginTop: hp(0.8),

    color: Colors.primary,

    fontSize: RF(13),

    fontWeight: "600",
  },

  /* ================= TRUST CARD ================= */

  trustCard: {
    flexDirection: "row",

    backgroundColor: "#FFF4EA",

    borderRadius: wp(4),

    padding: wp(4),

    marginTop: hp(1),

    marginBottom: hp(3),
  },

  trustIcon: {
    width: wp(14),

    height: wp(14),

    borderRadius: wp(7),

    backgroundColor: "#FFF",

    justifyContent: "center",

    alignItems: "center",

    marginRight: wp(4),
  },

  trustTitle: {
    color: Colors.darkBrown,

    fontSize: RF(15),

    fontWeight: "600",
  },

  trustDesc: {
    marginTop: hp(0.6),

    color: "#666",

    fontSize: RF(12),

    lineHeight: RF(19),

    fontWeight: "400",
  },
});
