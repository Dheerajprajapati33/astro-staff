import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Share, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import Colors from "../../constants/Colors";import { hp, RF, wp } from "../../utils/responsive";

export default function Header({ astrologer = {} }) {
  const handleShare = async () => {
    try {
      await Share.share({
        message: astrologer?.name
          ? `Connect with ${astrologer.name} on Vavi.`
          : "Connect with expert astrologers on Vavi.",
      });
    } catch (error) {
      console.log("Share error:", error);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.iconButton}
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-back" size={RF(24)} color={Colors.darkBrown} />
      </TouchableOpacity>

      <Text style={styles.title} numberOfLines={1}>
        Connect with Astrologer
      </Text>

      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.iconButton}
        onPress={handleShare}
      >
        <Ionicons
          name="share-social-outline"
          size={RF(23)}
          color={Colors.darkBrown}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: hp(7),
    paddingHorizontal: wp(4),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  iconButton: {
    width: wp(10),
    height: wp(10),
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    flex: 1,
    textAlign: "center",
    fontSize: RF(18),
    color: Colors.darkBrown,
    fontWeight: "600",
  },
});
