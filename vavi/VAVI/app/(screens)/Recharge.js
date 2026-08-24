import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
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

const ORANGE = "#ff6a00";
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

  // Wallet Balance API
  const { data: balanceData, refetch: refetchBalance } = useGetWalletBalanceQuery();
  const balance = balanceData?.data?.balance || balanceData?.balance || "0.00";

  // Mutations
  const [createPaymentOrder] = useCreatePaymentOrderMutation();
  const [verifyPayment] = useVerifyPaymentMutation();
  const [rechargeWalletDirect] = useRechargeWalletMutation();

  const finalAmount = customAmount ? Number(customAmount) : selectedAmount;
  const gst = Math.round((finalAmount || 0) * 0.18);
  const total = (finalAmount || 0) + gst;

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

  // Main Razorpay Recharge Flow
  const handleRecharge = async () => {
    if (!finalAmount || finalAmount < 10) {
      Alert.alert("Invalid Amount", "Please select or enter a recharge amount of at least ₹10.");
      return;
    }

    setIsProcessing(true);
    try {
      console.log("[Recharge] Creating order for amount:", finalAmount);
      const orderRes = await createPaymentOrder({ amount: finalAmount }).unwrap();
      const orderData = orderRes?.data || orderRes;

      const orderId = orderData?.orderId || orderData?.order_id || orderData?.id;
      const amountInPaise = orderData?.amountInPaise || orderData?.amount || finalAmount * 100;
      const keyId = orderData?.keyId || orderData?.key || "rzp_test_placeholder";

      console.log("[Recharge] Order created:", { orderId, amountInPaise, keyId });

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
          description: `Wallet Recharge ₹${finalAmount}`,
          order_id: orderId,
          theme: { color: ORANGE },
          handler: async (response) => {
            console.log("[Recharge] Razorpay success handler:", response);
            try {
              const verifyRes = await verifyPayment({
                razorpayOrderId: response.razorpay_order_id || orderId,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
                amount: finalAmount,
              }).unwrap();

              const newBalance = verifyRes?.data?.balance ?? verifyRes?.balance ?? (Number(balance) + finalAmount).toFixed(2);
              refetchBalance();

              Alert.alert(
                "🎉 Payment Successful!",
                `Your wallet has been recharged with ₹${finalAmount}.\nNew Balance: ₹${newBalance}`,
                [
                  {
                    text: "Go to Wallet",
                    onPress: () => router.replace("/Wallet"),
                  },
                ]
              );
            } catch (vErr) {
              console.log("[Recharge] Verification error:", vErr);
              Alert.alert("Notice", "Payment processed. Verifying with wallet...");
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
            description: `VAVI Wallet Recharge ₹${finalAmount}`,
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
            amount: finalAmount,
          }).unwrap();

          const newBalance = verifyRes?.data?.balance ?? (Number(balance) + finalAmount).toFixed(2);
          refetchBalance();

          Alert.alert("🎉 Success", `Wallet Recharged!\nNew Balance: ₹${newBalance}`, [
            { text: "OK", onPress: () => router.replace("/Wallet") },
          ]);
        } else {
          // Fallback direct recharge if native module is not compiled in dev client
          const fallbackRes = await rechargeWalletDirect({ amount: finalAmount }).unwrap();
          refetchBalance();
          Alert.alert("Success", "Wallet recharged successfully!", [
            { text: "OK", onPress: () => router.replace("/Wallet") },
          ]);
        }
      } catch (nativeErr) {
        console.log("[Recharge] Native checkout error:", nativeErr);
        if (nativeErr?.code !== 2) {
          Alert.alert("Payment Cancelled", nativeErr?.description || nativeErr?.message || "Payment was cancelled.");
        }
      }
    } catch (error) {
      console.log("[Recharge] Error:", error);
      Alert.alert("Recharge Notice", error?.data?.message || error?.message || "Unable to initialize payment gateway.");
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
                <View style={[styles.popularBadge, { backgroundColor: "#4CAF50" }]}>
                  <Text style={styles.popularText}>Best Value</Text>
                </View>
              )}
              <Text style={[styles.amountText, selected && styles.selectedAmount]}>
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

      {/* GST & Total Breakdown */}
      <View style={styles.breakdownCard}>
        <View style={styles.breakdownRow}>
          <Text style={styles.breakdownLbl}>Recharge Amount</Text>
          <Text style={styles.breakdownVal}>₹{finalAmount || 0}</Text>
        </View>
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

      {/* Bottom Payment Button */}
      <View style={styles.bottomBar}>
        <View style={styles.trustBadge}>
          <Ionicons name="shield-checkmark-outline" size={RF(14)} color="#4CAF50" />
          <Text style={styles.trustText}>100% Safe & Secure UPI / Razorpay Payment</Text>
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
            <Text style={styles.payBtnText}>Proceed to Pay ₹{total}</Text>
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
    marginTop: hp(1),
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
  breakdownCard: {
    backgroundColor: "#fff",
    borderRadius: wp(4),
    padding: wp(4),
    marginHorizontal: wp(4.5),
    marginTop: hp(2.5),
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
    color: "#4CAF50",
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
