import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Linking,
  Platform,
  Share,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Colors from "../../constants/Colors";
import { hp, RF, wp } from "../../utils/responsive";
import { useGetReferralDetailsQuery } from "../../redux/referralApi";

// Safe wrapper for Clipboard native module
let ClipboardModule = null;
try {
  ClipboardModule = require("expo-clipboard");
} catch (e) {
  ClipboardModule = null;
}

const Refer = () => {
  const { data, isLoading, refetch } = useGetReferralDetailsQuery();
  const [copied, setCopied] = useState(false);

  // Extract referral fields with safe fallbacks
  const referralData = data?.data || data || {};
  const referralCode =
    referralData?.referralCode ||
    referralData?.code ||
    referralData?.user?.referralCode ||
    "VAVI108";
  const rewardAmount =
    referralData?.rewardAmount ||
    referralData?.bonusAmount ||
    referralData?.reward ||
    20;
  const totalReferred =
    referralData?.totalReferred ?? referralData?.totalInvites ?? 0;
  const totalEarned =
    referralData?.totalEarned ?? referralData?.totalEarnings ?? 0;

  const shareMessage = `🌟 Join me on VAVI Astrology! Get accurate astrology consultations, kundli matching & live astro sessions.\n\n🎁 Use my referral code: *${referralCode}* to get ₹${rewardAmount} bonus on your first recharge!\n\nDownload app: https://vavi.app/join?ref=${referralCode}`;

  // Handle Copy to Clipboard
  const handleCopy = async () => {
    try {
      if (ClipboardModule?.setStringAsync) {
        await ClipboardModule.setStringAsync(referralCode);
      } else {
        // Safe fallback if native clipboard module isn't compiled into the dev build yet
        await Share.share({
          message: referralCode,
          title: "Referral Code",
        });
      }
      setCopied(true);
      if (Platform.OS === "android") {
        ToastAndroid.show("Referral code copied!", ToastAndroid.SHORT);
      } else {
        Alert.alert("Copied!", "Referral code copied.");
      }
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.log("Failed to copy code:", err);
    }
  };

  // Handle WhatsApp Share
  const handleWhatsAppShare = async () => {
    const url = `whatsapp://send?text=${encodeURIComponent(shareMessage)}`;
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        await Share.share({
          message: shareMessage,
          title: "Join VAVI Astrology",
        });
      }
    } catch (error) {
      console.log("Error sharing on WhatsApp:", error);
      Share.share({
        message: shareMessage,
        title: "Join VAVI Astrology",
      });
    }
  };

  // Handle Native Share Sheet
  const handleNativeShare = async () => {
    try {
      await Share.share({
        message: shareMessage,
        title: "Join VAVI Astrology",
      });
    } catch (error) {
      console.log("Error sharing via apps:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid={true}
        contentContainerStyle={styles.scrollContainer}
      >
        {/* ---------------- Header ---------------- */}
        <View style={styles.header}>
          <TouchableOpacity activeOpacity={0.8} onPress={() => router.back()}>
            <Ionicons
              name="arrow-back"
              size={RF(24)}
              color={Colors.darkBrown}
            />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Refer & Earn</Text>

          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.cashButton}
            onPress={() => router.push("/Recharge")}
          >
            <Ionicons
              name="wallet-outline"
              size={RF(16)}
              color={Colors.primary}
            />

            <Text style={styles.cashText}>Add Cash</Text>

            <Ionicons
              name="add-circle"
              size={RF(18)}
              color={Colors.darkBrown}
            />
          </TouchableOpacity>
        </View>

        {/* ---------------- Top Banner ---------------- */}
        <View style={styles.banner}>
          <View style={styles.bannerLeft}>
            <View style={styles.offerBadge}>
              <Text style={styles.offerText}>LIMITED TIME OFFER</Text>
            </View>

            <Text style={styles.inviteText}>Invite Friends & Earn</Text>

            <Text style={styles.reward}>₹{rewardAmount}</Text>

            <Text style={styles.desc}>Share the wisdom of astrology</Text>
            <Text style={styles.desc}>and get rewarded</Text>
          </View>

          <Image
            source={require("../../assets/images/placeholder.jpeg")}
            style={styles.giftImage}
            resizeMode="contain"
          />
        </View>

        {/* ---------------- Stats Card ---------------- */}
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{totalReferred}</Text>
            <Text style={styles.statLabel}>Friends Invited</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>₹{totalEarned}</Text>
            <Text style={styles.statLabel}>Total Earned</Text>
          </View>
        </View>

        {/* ================= How It Works ================= */}
        <View style={styles.howCard}>
          <View style={styles.titleRow}>
            <View style={styles.smallStar} />
            <Text style={styles.howTitle}>How it works?</Text>
            <View style={styles.smallStar} />
          </View>

          <View style={styles.stepsRow}>
            {/* Step 1 */}
            <View style={styles.stepItem}>
              <View style={styles.stepCircle}>
                <Ionicons
                  name="share-social-outline"
                  size={RF(26)}
                  color={Colors.primary}
                />
              </View>

              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>1</Text>
              </View>

              <Text style={styles.stepTitle}>Invite a</Text>
              <Text style={styles.stepTitle}>Friend</Text>
            </View>

            {/* Dashed Line */}
            <View style={styles.dashedContainer}>
              <View style={styles.dashedLine} />
            </View>

            {/* Step 2 */}
            <View style={styles.stepItem}>
              <View style={styles.stepCircle}>
                <Ionicons
                  name="wallet-outline"
                  size={RF(26)}
                  color={Colors.primary}
                />
              </View>

              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>2</Text>
              </View>

              <Text style={styles.stepTitle}>Friend</Text>
              <Text style={styles.stepTitle}>Recharges</Text>
            </View>

            {/* Dashed Line */}
            <View style={styles.dashedContainer}>
              <View style={styles.dashedLine} />
            </View>

            {/* Step 3 */}
            <View style={styles.stepItem}>
              <View
                style={[
                  styles.stepCircle,
                  {
                    backgroundColor: Colors.primary,
                  },
                ]}
              >
                <Ionicons
                  name="gift-outline"
                  size={RF(26)}
                  color={Colors.white}
                />
              </View>

              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>3</Text>
              </View>

              <Text style={styles.stepTitle}>You Earn</Text>
              <Text style={styles.stepTitle}>₹{rewardAmount}</Text>
            </View>
          </View>
        </View>

        {/* ================= Referral Code ================= */}
        <View style={styles.codeCard}>
          <Text style={styles.codeTitle}>Your referral code</Text>

          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.codeBox}
            onPress={handleCopy}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color={Colors.primary} />
            ) : (
              <Text style={styles.codeText}>{referralCode}</Text>
            )}

            <View style={styles.copyContainer}>
              <Ionicons
                name={copied ? "checkmark-circle" : "copy-outline"}
                size={RF(20)}
                color={copied ? "#25D366" : Colors.primary}
              />

              <Text style={[styles.copyText, copied && { color: "#25D366" }]}>
                {copied ? "Copied!" : "Copy"}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* ================= WhatsApp Button ================= */}
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.whatsappButton}
          onPress={handleWhatsAppShare}
        >
          <Ionicons name="logo-whatsapp" size={RF(22)} color={Colors.white} />
          <Text style={styles.whatsappText}>Share on WhatsApp</Text>
        </TouchableOpacity>

        {/* ================= Other Apps ================= */}
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.otherButton}
          onPress={handleNativeShare}
        >
          <Ionicons name="share-social-outline" size={RF(22)} color="#36B54A" />
          <Text style={styles.otherText}>Share via other apps</Text>
        </TouchableOpacity>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default Refer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF8F4",
    paddingHorizontal: wp(5),
  },

  scrollContainer: {
    paddingBottom: hp(4),
  },

  /* ---------------- Header ---------------- */
  header: {
    height: hp(7),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: hp(1),
  },

  headerTitle: {
    fontSize: RF(20),
    color: Colors.darkBrown,
    fontWeight: "600",
  },

  cashButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: wp(6),
    paddingHorizontal: wp(3),
    height: hp(4.8),
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },

  cashText: {
    marginHorizontal: wp(1.5),
    color: Colors.darkBrown,
    fontSize: RF(12),
    fontWeight: "600",
  },

  /* ---------------- Banner ---------------- */
  banner: {
    marginTop: hp(2),
    backgroundColor: "#F58220",
    borderRadius: wp(5),
    padding: wp(5),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  bannerLeft: {
    flex: 1,
  },

  offerBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#FFF",
    borderRadius: wp(4),
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.4),
    marginBottom: hp(1),
  },

  offerText: {
    color: Colors.primary,
    fontSize: RF(10),
    fontWeight: "600",
  },

  inviteText: {
    color: "#FFF",
    fontSize: RF(20),
    fontWeight: "600",
  },

  reward: {
    color: "#FFF",
    fontSize: RF(42),
    fontWeight: "700",
    marginVertical: hp(0.5),
  },

  desc: {
    color: "#FFF",
    fontSize: RF(13),
    fontWeight: "400",
  },

  giftImage: {
    width: wp(34),
    height: wp(34),
  },

  /* ---------------- Stats Card ---------------- */
  statsCard: {
    marginTop: hp(2),
    backgroundColor: "#FFF",
    borderRadius: wp(4),
    paddingVertical: hp(2),
    paddingHorizontal: wp(4),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },

  statItem: {
    alignItems: "center",
    flex: 1,
  },

  statNumber: {
    fontSize: RF(20),
    fontWeight: "700",
    color: Colors.primary,
  },

  statLabel: {
    marginTop: hp(0.3),
    fontSize: RF(12),
    color: "#666",
    fontWeight: "500",
  },

  statDivider: {
    width: 1,
    height: "70%",
    backgroundColor: "#EFEFEF",
  },

  /* ---------------- How Card ---------------- */
  howCard: {
    marginTop: hp(2.5),
    backgroundColor: "#FFF",
    borderRadius: wp(5),
    padding: wp(5),
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },

  titleRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: hp(3),
  },

  smallStar: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
  },

  howTitle: {
    marginHorizontal: wp(3),
    color: Colors.darkBrown,
    fontSize: RF(18),
    fontWeight: "600",
  },

  stepsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  stepItem: {
    alignItems: "center",
    width: wp(22),
  },

  stepCircle: {
    width: wp(16),
    height: wp(16),
    borderRadius: wp(8),
    backgroundColor: "#FFF5EF",
    justifyContent: "center",
    alignItems: "center",
  },

  stepNumber: {
    marginTop: hp(0.8),
    width: wp(6),
    height: wp(6),
    borderRadius: wp(3),
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },

  stepNumberText: {
    color: "#FFF",
    fontSize: RF(10),
    fontWeight: "600",
  },

  stepTitle: {
    marginTop: hp(0.4),
    textAlign: "center",
    color: Colors.darkBrown,
    fontSize: RF(11),
    fontWeight: "500",
  },

  dashedContainer: {
    flex: 1,
    alignItems: "center",
    marginTop: hp(3),
  },

  dashedLine: {
    width: "100%",
    borderStyle: "dashed",
    borderWidth: 1,
    borderColor: "#D9D9D9",
  },

  /* ---------------- Referral ---------------- */
  codeCard: {
    marginTop: hp(2.5),
    backgroundColor: "#FFF",
    borderRadius: wp(5),
    padding: wp(5),
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },

  codeTitle: {
    color: Colors.darkBrown,
    fontSize: RF(16),
    fontWeight: "600",
    marginBottom: hp(1.5),
  },

  codeBox: {
    borderWidth: 1.5,
    borderColor: Colors.primary,
    borderStyle: "dashed",
    borderRadius: wp(3),
    paddingVertical: hp(2),
    paddingHorizontal: wp(4),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  codeText: {
    color: Colors.primary,
    fontSize: RF(22),
    letterSpacing: 2,
    fontWeight: "700",
  },

  copyContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  copyText: {
    marginLeft: wp(1),
    color: Colors.primary,
    fontSize: RF(14),
    fontWeight: "600",
  },

  /* ---------------- WhatsApp ---------------- */
  whatsappButton: {
    marginTop: hp(2.5),
    height: hp(6.5),
    backgroundColor: "#25D366",
    borderRadius: wp(4),
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    elevation: 2,
  },

  whatsappText: {
    color: "#FFF",
    fontSize: RF(16),
    marginLeft: wp(2),
    fontWeight: "600",
  },

  /* ---------------- Other ---------------- */
  otherButton: {
    marginTop: hp(1.5),
    marginBottom: hp(2),
    height: hp(6.5),
    backgroundColor: "#FFF",
    borderRadius: wp(4),
    borderWidth: 1,
    borderColor: "#E5E5E5",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },

  otherText: {
    marginLeft: wp(2),
    color: Colors.darkBrown,
    fontSize: RF(15),
    fontWeight: "600",
  },
});
