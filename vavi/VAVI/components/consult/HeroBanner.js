import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { LinearGradient } from "expo-linear-gradient";

import { Ionicons } from "@expo/vector-icons";
import { hp, RF, wp } from "../../utils/responsive";

// ⭐ Apni banner image ka path yaha update kar lena
import BannerImage from "../../assets/images/placeholder.jpeg";

export default function HeroBanner() {
  return (
    <View style={styles.container}>
      <View style={styles.shadowWrap}>
      <View style={styles.banner}>
        {/* Left Content */}

        <View style={styles.leftSection}>
          <Text style={styles.orangeTitle}>Get Answers.</Text>

          <Text style={styles.greenTitle}>Gain Clarity.</Text>

          <Text style={styles.description}>
            Consult top astrologers and{"\n"}
            find the right guidance.
          </Text>

          <TouchableOpacity activeOpacity={0.9}>
            <LinearGradient
              colors={["#34C759", "#168F1A"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.button}
            >
              <Text style={styles.buttonText}>Consult Now</Text>

              <Ionicons name="arrow-forward" size={RF(15)} color="#FFF" />
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Right Banner Image */}

        <Image
          source={BannerImage}
          resizeMode="contain"
          style={styles.bannerImage}
        />
      </View>
      </View>

      {/* Pagination */}

      <View style={styles.pagination}>
        <View style={styles.activeDot} />

        <View style={styles.dot} />

        <View style={styles.dot} />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: wp(4),

    marginTop: hp(2.4),
  },

  shadowWrap: {
    borderRadius: wp(4),

    backgroundColor: "#ffffff",

    shadowColor: "#B5651D",

    shadowOpacity: 0.2,

    shadowRadius: 14,

    shadowOffset: {
      width: 0,

      height: 8,
    },

    elevation: 10,
  },

  banner: {
    height: hp(20),

    backgroundColor: "#ffffff",

    borderRadius: wp(4),

    flexDirection: "row",

    alignItems: "center",

    justifyContent: "space-between",

    overflow: "hidden",

    paddingLeft: wp(5),

    paddingRight: wp(2),

    borderWidth: 1,

    borderColor: "#F8E7DB",
  },

  leftSection: {
    flex: 1,

    justifyContent: "center",

    paddingRight: wp(2),
  },

  orangeTitle: {
    color: "#FF6A00",

    fontSize: RF(18),

    fontWeight: "700",

    lineHeight: RF(23),
  },

  greenTitle: {
    color: "#2AAE37",

    fontSize: RF(18),

    fontWeight: "700",

    lineHeight: RF(23),

    marginTop: hp(0.1),
  },

  description: {
    marginTop: hp(0.8),

    color: "#555",

    fontSize: RF(11),

    lineHeight: RF(16),

    fontWeight: "400",
  },

  button: {
    marginTop: hp(1.6),

    width: wp(31),

    height: hp(4.3),

    borderRadius: hp(3),

    flexDirection: "row",

    justifyContent: "center",

    alignItems: "center",

    shadowColor: "#168F1A",

    shadowOpacity: 0.35,

    shadowRadius: 8,

    shadowOffset: {
      width: 0,

      height: 4,
    },

    elevation: 6,
  },

  buttonText: {
    color: "#FFF",

    fontSize: RF(11.5),

    fontWeight: "700",

    marginRight: wp(1.5),
  },
  bannerImage: {
    width: wp(44),

    height: hp(15.5),

    resizeMode: "contain",

    marginLeft: wp(2),

    shadowColor: "#000",

    shadowOpacity: 0.25,

    shadowRadius: 8,

    shadowOffset: {
      width: 0,

      height: 6,
    },
  },

  pagination: {
    flexDirection: "row",

    justifyContent: "center",

    alignItems: "center",

    marginTop: hp(1),
  },

  activeDot: {
    width: wp(4),

    height: hp(0.7),

    borderRadius: hp(1),

    backgroundColor: "#FF6A00",

    marginHorizontal: wp(0.7),
  },

  dot: {
    width: hp(0.7),

    height: hp(0.7),

    borderRadius: hp(1),

    backgroundColor: "#D9D9D9",

    marginHorizontal: wp(0.7),
  },
});
