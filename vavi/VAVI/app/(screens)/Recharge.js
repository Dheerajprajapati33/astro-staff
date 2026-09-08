import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import Colors from "../../constants/Colors";
import { hp, RF, wp } from "../../utils/responsive";
import {
  useCreatePaymentOrderMutation,
  useGetWalletBalanceQuery,
  useRechargeWalletMutation,
  useVerifyPaymentMutation,
} from "../../redux/walletApi";
import {
  useApplyPromoOfferMutation,
  useGetActiveOffersQuery,
} from "../../redux/offerApi";

const ORANGE = "#ff6a00";
const GREEN = "#10B981";
const PURPLE = "#7C3AED";
const amounts = [100, 200, 300, 500, 1000, 2000, 3000, 5000, 8000];

// Dynamic loader for Razorpay script on Web
const loadRazorpayWebScript = () => {
  return new Promise((resolve) => {
    if (typeof window === "undefined") return resolve(false);
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const Recharge = () => {
  const [selectedAmount, setSelectedAmount] = useState(500);
  const [customAmount, setCustomAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Promo code states
  const [promoInput, setPromoInput] = useState("");
  const [appliedPromo, setAppliedPromo] = useState(null);

  // Wallet Balance API
  const { data: balanceData, refetch: refetchBalance } =
    useGetWalletBalanceQuery();
  const balance = balanceData?.data?.balance || balanceData?.balance || "0.00";

  // Offer APIs
  const { data: activeOffers = [], isLoading: isLoadingOffers } =
    useGetActiveOffersQuery();
  const [applyPromoOffer, { isLoading: isApplyingPromo }] =
    useApplyPromoOfferMutation();

  // Payment Mutations
  const [createPaymentOrder] = useCreatePaymentOrderMutation();
  const [verifyPayment] = useVerifyPaymentMutation();
  const [rechargeWalletDirect] = useRechargeWalletMutation();

  const baseAmount = customAmount ? Number(customAmount) : selectedAmount;

  // Calculate discount
  let discountAmount = 0;
  if (appliedPromo && baseAmount > 0) {
    if (appliedPromo.discountType === "percentage") {
      discountAmount = Math.round(
        (baseAmount * Number(appliedPromo.discountValue || 0)) / 100,
      );
      if (
        appliedPromo.maxDiscount &&
        discountAmount > Number(appliedPromo.maxDiscount)
      ) {
        discountAmount = Number(appliedPromo.maxDiscount);
      }
    } else if (appliedPromo.discountAmount) {
      discountAmount = Number(appliedPromo.discountAmount);
    } else if (appliedPromo.discountValue) {
      discountAmount = Number(appliedPromo.discountValue);
    }
    // Ensure discount never exceeds total amount minus at least ₹1
    discountAmount = Math.min(discountAmount, Math.max(baseAmount - 1, 0));
  }

  const payableBase = Math.max(baseAmount - discountAmount, 0);
  const gst = Math.round((payableBase || 0) * 0.18);
  const total = (payableBase || 0) + gst;

  const handleCustomChange = (text) => {
    const numeric = text.replace(/[^0-9]/g, "");
    setCustomAmount(numeric);
    if (numeric) {
      setSelectedAmount(Number(numeric));
    }
  };

  const handleSelectPreset = (amt) => {
    setSelectedAmount(amt);
    setCustomAmount("");
  };

  // Apply promo code handler
  const handleApplyPromoCode = async (codeToApply) => {
    const code = (codeToApply || promoInput).trim().toUpperCase();
    if (!code) {
      Alert.alert("Required", "Please enter a promo code to apply.");
      return;
    }

    if (!baseAmount || baseAmount < 10) {
      Alert.alert(
        "Invalid Amount",
        "Please select a recharge amount of at least ₹10 before applying a promo code.",
      );
      return;
    }

    try {
      console.log(
        "[Recharge] Applying promo code:",
        code,
        "for amount:",
        baseAmount,
      );
      const res = await applyPromoOffer({
        promoCode: code,
        amount: baseAmount,
      }).unwrap();

      console.log("[Recharge] Promo response:", res);

      const offerData = res?.data || res?.offer || res || {};
      const discountValue =
        offerData?.discountAmount ||
        offerData?.discountValue ||
        offerData?.discount ||
        (offerData?.discountType === "percentage"
          ? Math.round((baseAmount * (offerData.discountValue || 10)) / 100)
          : 50);

      const discountType =
        offerData?.discountType ||
        (offerData?.discountPercentage ? "percentage" : "flat");

      setAppliedPromo({
        code: code,
        discountValue: discountValue,
        discountType: discountType,
        maxDiscount: offerData?.maxDiscount,
        message:
          res?.message ||
          offerData?.message ||
          `Coupon "${code}" applied successfully!`,
      });

      setPromoInput(code);

      Alert.alert(
        "🎉 Offer Applied!",
        res?.message ||
          `Promo code ${code} applied successfully! You got a discount.`,
      );
    } catch (error) {
      console.log("[Recharge] Promo apply error:", error);
      Alert.alert(
        "Promo Code Notice",
        error?.data?.message ||
          error?.message ||
          "Invalid or expired promo code.",
      );
    }
  };

  // Remove promo code
  const handleRemovePromoCode = () => {
    setAppliedPromo(null);
    setPromoInput("");
  };

  // Main Razorpay Recharge Flow
  const handleRecharge = async () => {
    if (!baseAmount || baseAmount < 10) {
      Alert.alert(
        "Invalid Amount",
        "Please select or enter a recharge amount of at least ₹10.",
      );
      return;
    }

    setIsProcessing(true);
    try {
      console.log(
        "[Recharge] Creating order for payable total:",
        total,
        "base:",
        baseAmount,
      );
      const orderRes = await createPaymentOrder({
        amount: total,
        baseAmount: baseAmount,
        promoCode: appliedPromo?.code || null,
        discountAmount: discountAmount,
      }).unwrap();

      const orderData = orderRes?.data || orderRes;

      const orderId =
        orderData?.orderId || orderData?.order_id || orderData?.id;
      const amountInPaise =
        orderData?.amountInPaise || orderData?.amount || total * 100;
      const keyId =
        orderData?.keyId || orderData?.key || "rzp_test_placeholder";

      console.log("[Recharge] Order created:", {
        orderId,
        amountInPaise,
        keyId,
      });

      // Web Platform Checkout Flow
      if (Platform.OS === "web") {
        const loaded = await loadRazorpayWebScript();
        if (!loaded) {
          throw new Error("Failed to load Razorpay payment SDK.");
        }

        const options = {
          key: keyId,
          amount: amountInPaise,
          currency: "INR",
          name: "VAVI Astrology",
          description: `Wallet Recharge ₹${baseAmount}${
            appliedPromo ? ` (Promo: ${appliedPromo.code})` : ""
          }`,
          order_id: orderId,
          theme: { color: ORANGE },
          handler: async (response) => {
            console.log("[Recharge] Razorpay success handler:", response);
            try {
              const verifyRes = await verifyPayment({
                razorpayOrderId: response.razorpay_order_id || orderId,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
                amount: baseAmount,
                paidAmount: total,
                promoCode: appliedPromo?.code || null,
              }).unwrap();

              const newBalance =
                verifyRes?.data?.balance ??
                verifyRes?.balance ??
                (Number(balance) + baseAmount).toFixed(2);
              refetchBalance();

              Alert.alert(
                "🎉 Payment Successful!",
                `Your wallet has been recharged with ₹${baseAmount}.${
                  discountAmount > 0
                    ? `\nYou saved ₹${discountAmount} with promo code!`
                    : ""
                }\nNew Balance: ₹${newBalance}`,
                [
                  {
                    text: "Go to Wallet",
                    onPress: () => router.replace("/Wallet"),
                  },
                ],
              );
            } catch (vErr) {
              console.log("[Recharge] Verification error:", vErr);
              Alert.alert(
                "Notice",
                "Payment processed. Verifying with wallet...",
              );
              refetchBalance();
              router.replace("/Wallet");
            }
          },
          modal: {
            ondismiss: () => {
              console.log("[Recharge] Payment modal closed by user.");
              setIsProcessing(false);
            },
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
        return;
      }

      // Native (Android / iOS) Platform Checkout Flow
      try {
        let RazorpayCheckout;
        try {
          RazorpayCheckout = require("react-native-razorpay").default;
        } catch (e) {}

        if (RazorpayCheckout && RazorpayCheckout.open) {
          const options = {
            description: `VAVI Wallet Recharge ₹${baseAmount}${
              appliedPromo ? ` (Promo: ${appliedPromo.code})` : ""
            }`,
            currency: "INR",
            key: keyId,
            amount: amountInPaise,
            name: "VAVI Astrology",
            order_id: orderId,
            theme: { color: ORANGE },
          };

          const data = await RazorpayCheckout.open(options);
          console.log("[Recharge] Native payment success:", data);

          const verifyRes = await verifyPayment({
            razorpayOrderId: data.razorpay_order_id || orderId,
            razorpayPaymentId: data.razorpay_payment_id,
            razorpaySignature: data.razorpay_signature,
            amount: baseAmount,
            paidAmount: total,
            promoCode: appliedPromo?.code || null,
          }).unwrap();

          const newBalance =
            verifyRes?.data?.balance ??
            (Number(balance) + baseAmount).toFixed(2);
          refetchBalance();

          Alert.alert(
            "🎉 Success",
            `Wallet Recharged!\nAmount Credited: ₹${baseAmount}${
              discountAmount > 0 ? `\nSaved: ₹${discountAmount}` : ""
            }\nNew Balance: ₹${newBalance}`,
            [{ text: "OK", onPress: () => router.replace("/Wallet") }],
          );
        } else {
          // Fallback direct recharge if native module is not compiled in dev client
          await rechargeWalletDirect({
            amount: baseAmount,
            paidAmount: total,
            promoCode: appliedPromo?.code || null,
          }).unwrap();
          refetchBalance();
          Alert.alert(
            "Success",
            `Wallet recharged successfully with ₹${baseAmount}!`,
            [{ text: "OK", onPress: () => router.replace("/Wallet") }],
          );
        }
      } catch (nativeErr) {
        console.log("[Recharge] Native checkout error:", nativeErr);
        if (nativeErr?.code !== 2) {
          Alert.alert(
            "Payment Cancelled",
            nativeErr?.description ||
              nativeErr?.message ||
              "Payment was cancelled.",
          );
        }
      }
    } catch (error) {
      console.log("[Recharge] Error:", error);
      Alert.alert(
        "Recharge Notice",
        error?.data?.message ||
          error?.message ||
          "Unable to initialize payment gateway.",
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={RF(22)} color="#222" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Add Money to Wallet</Text>

        <View style={styles.walletBox}>
          <Ionicons name="wallet-outline" size={RF(15)} color={ORANGE} />
          <Text style={styles.walletText}>₹{balance}</Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Amount Preset Grid */}
        <View style={styles.grid}>
          {amounts.map((item) => {
            const selected = item === selectedAmount && !customAmount;
            return (
              <TouchableOpacity
                key={item}
                activeOpacity={0.8}
                onPress={() => handleSelectPreset(item)}
                style={[styles.amountBox, selected && styles.selectedBox]}
              >
                {item === 1000 && (
                  <View style={styles.popularBadge}>
                    <Text style={styles.popularText}>Most Popular</Text>
                  </View>
                )}
                {item === 500 && (
                  <View
                    style={[styles.popularBadge, { backgroundColor: GREEN }]}
                  >
                    <Text style={styles.popularText}>Best Value</Text>
                  </View>
                )}
                <Text
                  style={[styles.amountText, selected && styles.selectedAmount]}
                >
                  ₹{item}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Custom Amount Input */}
        <View style={styles.customWrap}>
          <Text style={styles.customLabel}>Or Enter Custom Amount:</Text>
          <View style={styles.customInputRow}>
            <Text style={styles.rupeePrefix}>₹</Text>
            <TextInput
              style={styles.customInput}
              placeholder="e.g. 750"
              placeholderTextColor="#999"
              keyboardType="number-pad"
              value={customAmount}
              onChangeText={handleCustomChange}
            />
          </View>
        </View>

        {/* Promo Code & Offers Section */}
        <View style={styles.promoCard}>
          <View style={styles.promoHeaderRow}>
            <View style={styles.promoIconWrap}>
              <Ionicons name="pricetag" size={RF(15)} color={ORANGE} />
            </View>
            <Text style={styles.promoSectionTitle}>Have a Promo Code?</Text>
          </View>

          {appliedPromo ? (
            <View style={styles.appliedPromoBox}>
              <View style={styles.appliedLeft}>
                <View style={styles.appliedBadge}>
                  <Ionicons
                    name="checkmark-circle"
                    size={RF(16)}
                    color={GREEN}
                  />
                  <Text style={styles.appliedCodeText}>
                    {appliedPromo.code}
                  </Text>
                </View>
                <Text style={styles.appliedSavingsText}>
                  🎉 You save ₹{discountAmount} on this recharge!
                </Text>
              </View>
              <TouchableOpacity
                onPress={handleRemovePromoCode}
                style={styles.removePromoBtn}
                activeOpacity={0.7}
              >
                <Text style={styles.removePromoText}>Remove</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.promoInputRow}>
              <TextInput
                style={styles.promoTextInput}
                placeholder="ENTER PROMO CODE"
                placeholderTextColor="#A0A0A0"
                autoCapitalize="characters"
                value={promoInput}
                onChangeText={(text) => setPromoInput(text.toUpperCase())}
              />
              <TouchableOpacity
                style={[
                  styles.applyBtn,
                  (!promoInput.trim() || isApplyingPromo) &&
                    styles.applyBtnDisabled,
                ]}
                onPress={() => handleApplyPromoCode(promoInput)}
                disabled={!promoInput.trim() || isApplyingPromo}
                activeOpacity={0.8}
              >
                {isApplyingPromo ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.applyBtnText}>Apply</Text>
                )}
              </TouchableOpacity>
            </View>
          )}

          {/* Active Offers Pills */}
          {Array.isArray(activeOffers) &&
            activeOffers.length > 0 &&
            !appliedPromo && (
              <View style={styles.availableOffersWrap}>
                <Text style={styles.availableOffersLabel}>
                  Available Offers:
                </Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.offersScroll}
                >
                  {activeOffers.map((offer, idx) => {
                    const code =
                      offer?.code || offer?.promoCode || `OFFER${idx + 1}`;
                    const discountLabel = offer?.discountValue
                      ? `${offer.discountValue}${
                          offer.discountType === "percentage" ? "%" : "₹"
                        } OFF`
                      : "Special Offer";

                    return (
                      <TouchableOpacity
                        key={offer?._id || offer?.id || idx}
                        style={styles.offerPill}
                        onPress={() => handleApplyPromoCode(code)}
                        activeOpacity={0.8}
                      >
                        <View style={styles.offerPillIcon}>
                          <Ionicons
                            name="gift-outline"
                            size={RF(12)}
                            color={ORANGE}
                          />
                        </View>
                        <View>
                          <Text style={styles.offerPillCode}>{code}</Text>
                          <Text style={styles.offerPillDesc}>
                            {discountLabel}
                          </Text>
                        </View>
                        <Text style={styles.offerPillApply}>Tap to Apply</Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>
            )}
        </View>

        {/* GST & Total Breakdown */}
        <View style={styles.breakdownCard}>
          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLbl}>Recharge Amount</Text>
            <Text style={styles.breakdownVal}>₹{baseAmount || 0}</Text>
          </View>

          {appliedPromo && discountAmount > 0 && (
            <View style={styles.breakdownRow}>
              <Text
                style={[
                  styles.breakdownLbl,
                  { color: GREEN, fontWeight: "600" },
                ]}
              >
                Promo Discount ({appliedPromo.code})
              </Text>
              <Text
                style={[
                  styles.breakdownVal,
                  { color: GREEN, fontWeight: "700" },
                ]}
              >
                -₹{discountAmount}
              </Text>
            </View>
          )}

          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLbl}>GST (18%)</Text>
            <Text style={styles.breakdownVal}>₹{gst}</Text>
          </View>

          <View style={styles.breakdownDivider} />

          <View style={styles.breakdownRow}>
            <Text style={styles.totalLbl}>Total Payable</Text>
            <Text style={styles.totalVal}>₹{total}</Text>
          </View>
        </View>

        <View style={{ height: hp(12) }} />
      </ScrollView>

      {/* Bottom Payment Button */}
      <View style={styles.bottomBar}>
        <View style={styles.trustBadge}>
          <Ionicons
            name="shield-checkmark-outline"
            size={RF(14)}
            color={GREEN}
          />
          <Text style={styles.trustText}>
            100% Safe & Secure UPI / Razorpay Payment
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.payBtn, isProcessing && { opacity: 0.75 }]}
          onPress={handleRecharge}
          disabled={isProcessing}
          activeOpacity={0.88}
        >
          {isProcessing ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.payBtnText}>
              Proceed to Pay ₹{total}
              {discountAmount > 0 ? ` (Saved ₹${discountAmount})` : ""}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8FA",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: wp(4.5),
    paddingVertical: hp(1.5),
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderColor: "#EFEFEF",
  },
  backBtn: {
    padding: wp(1),
  },
  headerTitle: {
    fontSize: RF(16),
    fontWeight: "700",
    color: "#222",
  },
  walletBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF3E0",
    paddingHorizontal: wp(2.5),
    paddingVertical: hp(0.6),
    borderRadius: wp(4),
    gap: wp(1),
  },
  walletText: {
    fontSize: RF(12),
    fontWeight: "700",
    color: ORANGE,
  },
  scrollContent: {
    paddingBottom: hp(4),
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: wp(4.5),
    marginTop: hp(2),
  },
  amountBox: {
    width: "30%",
    backgroundColor: "#fff",
    borderRadius: wp(3),
    borderWidth: 1.5,
    borderColor: "#E5E5E5",
    paddingVertical: hp(2.2),
    alignItems: "center",
    justifyContent: "center",
    marginBottom: hp(1.8),
  },
  selectedBox: {
    borderColor: ORANGE,
    backgroundColor: "#FFF9F5",
  },
  popularBadge: {
    position: "absolute",
    top: -hp(1),
    backgroundColor: ORANGE,
    paddingHorizontal: wp(2),
    paddingVertical: hp(0.2),
    borderRadius: wp(2),
  },
  popularText: {
    color: "#fff",
    fontSize: RF(8.5),
    fontWeight: "700",
  },
  amountText: {
    fontSize: RF(15),
    fontWeight: "700",
    color: "#333",
  },
  selectedAmount: {
    color: ORANGE,
  },
  customWrap: {
    paddingHorizontal: wp(4.5),
    marginTop: hp(0.5),
  },
  customLabel: {
    fontSize: RF(12),
    fontWeight: "600",
    color: "#555",
    marginBottom: hp(0.8),
  },
  customInputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: wp(3),
    borderWidth: 1,
    borderColor: "#E5E5E5",
    paddingHorizontal: wp(4),
    paddingVertical: hp(1.2),
  },
  rupeePrefix: {
    fontSize: RF(18),
    fontWeight: "700",
    color: ORANGE,
    marginRight: wp(2),
  },
  customInput: {
    flex: 1,
    fontSize: RF(15),
    color: "#222",
    fontWeight: "600",
    padding: 0,
  },

  // Promo Code Section Styles
  promoCard: {
    backgroundColor: "#fff",
    borderRadius: wp(4),
    padding: wp(4),
    marginHorizontal: wp(4.5),
    marginTop: hp(2),
    borderWidth: 1,
    borderColor: "#EAEAEA",
  },
  promoHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hp(1.2),
    gap: wp(2),
  },
  promoIconWrap: {
    width: wp(6.5),
    height: wp(6.5),
    borderRadius: wp(3.25),
    backgroundColor: "#FFF3E0",
    alignItems: "center",
    justifyContent: "center",
  },
  promoSectionTitle: {
    fontSize: RF(13),
    fontWeight: "700",
    color: "#222",
  },
  promoInputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(2.5),
  },
  promoTextInput: {
    flex: 1,
    backgroundColor: "#F8F8FA",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: wp(3),
    paddingHorizontal: wp(3.5),
    paddingVertical: hp(1.2),
    fontSize: RF(13),
    fontWeight: "700",
    color: "#222",
    letterSpacing: 1,
  },
  applyBtn: {
    backgroundColor: ORANGE,
    paddingHorizontal: wp(4.5),
    paddingVertical: hp(1.3),
    borderRadius: wp(3),
    alignItems: "center",
    justifyContent: "center",
  },
  applyBtnDisabled: {
    backgroundColor: "#CCC",
  },
  applyBtnText: {
    color: "#fff",
    fontSize: RF(12.5),
    fontWeight: "800",
  },
  appliedPromoBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#ECFDF5",
    borderWidth: 1,
    borderColor: "#A7F3D0",
    borderRadius: wp(3),
    padding: wp(3),
  },
  appliedLeft: {
    flex: 1,
  },
  appliedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(1.5),
  },
  appliedCodeText: {
    fontSize: RF(13),
    fontWeight: "800",
    color: "#065F46",
    letterSpacing: 0.5,
  },
  appliedSavingsText: {
    fontSize: RF(11),
    color: "#047857",
    fontWeight: "600",
    marginTop: hp(0.3),
  },
  removePromoBtn: {
    backgroundColor: "#FEE2E2",
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.6),
    borderRadius: wp(2),
  },
  removePromoText: {
    color: "#DC2626",
    fontSize: RF(11),
    fontWeight: "700",
  },
  availableOffersWrap: {
    marginTop: hp(1.5),
    paddingTop: hp(1.2),
    borderTopWidth: 1,
    borderColor: "#F0F0F0",
  },
  availableOffersLabel: {
    fontSize: RF(11),
    fontWeight: "700",
    color: "#666",
    marginBottom: hp(0.8),
  },
  offersScroll: {
    gap: wp(2),
  },
  offerPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF9F5",
    borderWidth: 1,
    borderColor: "#FFD8BF",
    borderRadius: wp(2.5),
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.8),
    gap: wp(2),
  },
  offerPillIcon: {
    width: wp(6),
    height: wp(6),
    borderRadius: wp(3),
    backgroundColor: "#FFEFE5",
    alignItems: "center",
    justifyContent: "center",
  },
  offerPillCode: {
    fontSize: RF(11.5),
    fontWeight: "800",
    color: ORANGE,
  },
  offerPillDesc: {
    fontSize: RF(9.5),
    color: "#666",
    fontWeight: "600",
  },
  offerPillApply: {
    fontSize: RF(10),
    fontWeight: "700",
    color: GREEN,
    marginLeft: wp(1),
  },

  // Breakdown Styles
  breakdownCard: {
    backgroundColor: "#fff",
    borderRadius: wp(4),
    padding: wp(4),
    marginHorizontal: wp(4.5),
    marginTop: hp(2),
    borderWidth: 1,
    borderColor: "#EAEAEA",
  },
  breakdownRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: hp(0.6),
  },
  breakdownLbl: {
    fontSize: RF(12),
    color: "#666",
  },
  breakdownVal: {
    fontSize: RF(12.5),
    fontWeight: "600",
    color: "#222",
  },
  breakdownDivider: {
    height: 1,
    backgroundColor: "#EBEBEB",
    marginVertical: hp(1),
  },
  totalLbl: {
    fontSize: RF(14),
    fontWeight: "800",
    color: "#222",
  },
  totalVal: {
    fontSize: RF(16),
    fontWeight: "800",
    color: ORANGE,
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    paddingHorizontal: wp(4.5),
    paddingTop: hp(1.5),
    paddingBottom: hp(3.5),
    borderTopWidth: 1,
    borderColor: "#EFEFEF",
  },
  trustBadge: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: wp(1.5),
    marginBottom: hp(1.2),
  },
  trustText: {
    fontSize: RF(10.5),
    color: GREEN,
    fontWeight: "600",
  },
  payBtn: {
    backgroundColor: ORANGE,
    borderRadius: wp(3.5),
    paddingVertical: hp(1.8),
    alignItems: "center",
    justifyContent: "center",
  },
  payBtnText: {
    color: "#fff",
    fontSize: RF(14),
    fontWeight: "800",
  },
});

export default Recharge;
