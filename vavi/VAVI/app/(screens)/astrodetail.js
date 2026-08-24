import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AboutCard from "../../components/astrologerDetail/AboutCard";
import BottomButtons from "../../components/astrologerDetail/BottomButtons";
import Header from "../../components/astrologerDetail/Header";
import ProfileCard from "../../components/astrologerDetail/ProfileCard";
import ReviewCard from "../../components/astrologerDetail/ReviewCard";

import Colors from "../../constants/Colors";import { hp, RF, wp } from "../../utils/responsive";

export default function AstroDetail() {
  const params = useLocalSearchParams();

  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const astrologerDataString = Array.isArray(params?.astrologerData)
    ? params.astrologerData[0]
    : params?.astrologerData;

  let astrologer = null;

  try {
    if (astrologerDataString) {
      // yaha parsed variable ko define kiya
      const parsedData = JSON.parse(astrologerDataString);

      // agar API response me astrologerUser hai to use unwrap karo
      astrologer = parsedData.astrologerUser || parsedData;
    }
  } catch (error) {
    console.log("Astrologer parse error:", error);
  }

  if (!astrologer) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <Header />

        <View style={styles.emptyContainer}>
          <Ionicons
            name="person-circle-outline"
            size={RF(65)}
            color={Colors.primary}
          />

          <Text style={styles.emptyTitle}>Astrologer data not found</Text>

          <Text style={styles.emptyText}>
            Please go back and select the astrologer again.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const safeAstrologer = {
    ...astrologer,

    id: astrologer?.id || id,

    expertises: Array.isArray(astrologer?.expertises)
      ? astrologer.expertises
      : [],

    toolsUsed: Array.isArray(astrologer?.toolsUsed) ? astrologer.toolsUsed : [],

    languages: Array.isArray(astrologer?.languages)
      ? astrologer.languages
      : astrologer?.languages || "",

    reviewsList: Array.isArray(astrologer?.reviewsList)
      ? astrologer.reviewsList
      : [],

    about:
      astrologer?.about?.trim() ||
      astrologer?.shortBio?.trim() ||
      (Array.isArray(astrologer?.expertises) && astrologer.expertises.length > 0
        ? `Expert in ${astrologer.expertises.map((e) => e.name).join(", ")}`
        : astrologer?.experience
          ? `Experience: ${astrologer.experience} years`
          : "No additional information available."),

    isOnline: Boolean(
      astrologer?.isOnline ||
      astrologer?.isCallOnline ||
      astrologer?.isChatOnline,
    ),
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Header astrologer={safeAstrologer} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <ProfileCard astrologer={safeAstrologer} />

        <AboutCard astrologer={safeAstrologer} />

        <ReviewCard astrologer={safeAstrologer} />
      </ScrollView>

      <BottomButtons astrologer={safeAstrologer} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background || "#FFF8F4",
  },

  content: {
    paddingBottom: hp(3),
  },

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: wp(8),
  },

  emptyTitle: {
    marginTop: hp(1.5),
    color: Colors.darkBrown,
    fontSize: RF(18),
    fontWeight: "600",
  },

  emptyText: {
    marginTop: hp(1),
    textAlign: "center",
    color: Colors.textGray,
    fontSize: RF(13),
    fontWeight: "400",
  },
});
