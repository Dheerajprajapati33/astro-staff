import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { RF, hp, wp } from "../../utils/responsive";

const ORANGE = "#ff6a00";

export default function WithdrawModal({
  visible,
  onClose,
  balance = 0,
  onSubmitWithdrawal,
}) {
  const [method, setMethod] = useState("UPI"); // "UPI" | "BANK_TRANSFER"
  const [amount, setAmount] = useState("");
  const [accountName, setAccountName] = useState("");
  const [upiId, setUpiId] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [bankName, setBankName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const numAmount = Number(amount) || 0;
  const numBalance = Number(balance) || 0;

  const handleSubmit = async () => {
    if (!amount || numAmount < 100) {
      Alert.alert("Invalid Amount", "Minimum payout withdrawal amount is ₹100.");
      return;
    }

    if (numAmount > numBalance) {
      Alert.alert("Insufficient Balance", `You can withdraw up to ₹${numBalance.toFixed(2)}.`);
      return;
    }

    if (!accountName.trim()) {
      Alert.alert("Required Field", "Please enter the Account Holder / Beneficiary Name.");
      return;
    }

    let paymentDetails = {};
    if (method === "UPI") {
      if (!upiId.trim() || !upiId.includes("@")) {
        Alert.alert("Invalid UPI ID", "Please enter a valid UPI ID (e.g. name@upi / phone@okaxis).");
        return;
      }
      paymentDetails = {
        upiId: upiId.trim(),
        accountName: accountName.trim(),
      };
    } else {
      if (!accountNumber.trim() || accountNumber.length < 8) {
        Alert.alert("Invalid Account Number", "Please enter a valid Bank Account Number.");
        return;
      }
      if (!ifscCode.trim() || ifscCode.length < 4) {
        Alert.alert("Invalid IFSC Code", "Please enter a valid Bank IFSC Code.");
        return;
      }
      paymentDetails = {
        accountNumber: accountNumber.trim(),
        ifscCode: ifscCode.trim().toUpperCase(),
        accountName: accountName.trim(),
        bankName: bankName.trim(),
      };
    }

    setIsSubmitting(true);
    try {
      await onSubmitWithdrawal({
        amount: numAmount,
        paymentMethod: method,
        paymentDetails,
      });
      Alert.alert(
        "🎉 Request Submitted!",
        `Your payout request for ₹${numAmount} has been submitted successfully. It will be credited to your ${method === "UPI" ? "UPI account" : "Bank Account"} within 24-48 hours.`,
        [{ text: "OK", onPress: onClose }]
      );
      setAmount("");
      setUpiId("");
      setAccountNumber("");
      setIfscCode("");
    } catch (e) {
      console.log("[WithdrawModal] Error submitting:", e);
      Alert.alert("Request Notice", e?.data?.message || e?.message || "Failed to submit withdrawal request.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />

        <View style={styles.sheetContainer}>
          {/* Handle bar */}
          <View style={styles.handleBar} />

          {/* Header */}
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.title}>Withdraw Net Earnings</Text>
              <Text style={styles.subTitle}>Available Balance: ₹{numBalance.toFixed(2)}</Text>
            </View>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <Ionicons name="close" size={RF(20)} color="#666" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            {/* Payment Method Switcher */}
            <Text style={styles.fieldLabel}>Select Payout Method</Text>
            <View style={styles.methodRow}>
              <TouchableOpacity
                style={[styles.methodBtn, method === "UPI" && styles.methodBtnActive]}
                onPress={() => setMethod("UPI")}
                activeOpacity={0.8}
              >
                <Ionicons name="phone-portrait-outline" size={RF(16)} color={method === "UPI" ? "#fff" : "#555"} />
                <Text style={[styles.methodBtnText, method === "UPI" && styles.methodBtnTextActive]}>
                  Instant UPI
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.methodBtn, method === "BANK_TRANSFER" && styles.methodBtnActive]}
                onPress={() => setMethod("BANK_TRANSFER")}
                activeOpacity={0.8}
              >
                <Ionicons name="business-outline" size={RF(16)} color={method === "BANK_TRANSFER" ? "#fff" : "#555"} />
                <Text style={[styles.methodBtnText, method === "BANK_TRANSFER" && styles.methodBtnTextActive]}>
                  Bank Account
                </Text>
              </TouchableOpacity>
            </View>

            {/* Withdrawal Amount */}
            <Text style={styles.fieldLabel}>Withdrawal Amount (₹)</Text>
            <View style={styles.inputWrapper}>
              <Text style={styles.currencyPrefix}>₹</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Minimum ₹100"
                placeholderTextColor="#999"
                keyboardType="number-pad"
                value={amount}
                onChangeText={setAmount}
              />
              <TouchableOpacity style={styles.maxBtn} onPress={() => setAmount(String(Math.floor(numBalance)))}>
                <Text style={styles.maxBtnText}>ALL</Text>
              </TouchableOpacity>
            </View>

            {/* Beneficiary Name */}
            <Text style={styles.fieldLabel}>Account Holder / Beneficiary Name</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="person-outline" size={RF(16)} color="#888" style={styles.fieldIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="e.g. Pandit Rajesh Sharma"
                placeholderTextColor="#999"
                value={accountName}
                onChangeText={setAccountName}
              />
            </View>

            {method === "UPI" ? (
              <>
                <Text style={styles.fieldLabel}>UPI ID (VPA)</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="qr-code-outline" size={RF(16)} color="#888" style={styles.fieldIcon} />
                  <TextInput
                    style={styles.textInput}
                    placeholder="e.g. rajesh@okaxis / 9876543210@paytm"
                    placeholderTextColor="#999"
                    autoCapitalize="none"
                    value={upiId}
                    onChangeText={setUpiId}
                  />
                </View>
              </>
            ) : (
              <>
                <Text style={styles.fieldLabel}>Bank Account Number</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="card-outline" size={RF(16)} color="#888" style={styles.fieldIcon} />
                  <TextInput
                    style={styles.textInput}
                    placeholder="Enter Account Number"
                    placeholderTextColor="#999"
                    keyboardType="number-pad"
                    value={accountNumber}
                    onChangeText={setAccountNumber}
                  />
                </View>

                <Text style={styles.fieldLabel}>Bank IFSC Code</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="location-outline" size={RF(16)} color="#888" style={styles.fieldIcon} />
                  <TextInput
                    style={styles.textInput}
                    placeholder="e.g. SBIN0001234"
                    placeholderTextColor="#999"
                    autoCapitalize="characters"
                    value={ifscCode}
                    onChangeText={setIfscCode}
                  />
                </View>

                <Text style={styles.fieldLabel}>Bank Name (Optional)</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="business-outline" size={RF(16)} color="#888" style={styles.fieldIcon} />
                  <TextInput
                    style={styles.textInput}
                    placeholder="e.g. State Bank of India"
                    placeholderTextColor="#999"
                    value={bankName}
                    onChangeText={setBankName}
                  />
                </View>
              </>
            )}

            {/* Notice card */}
            <View style={styles.noticeBox}>
              <Ionicons name="information-circle" size={RF(16)} color="#2196F3" />
              <Text style={styles.noticeText}>
                Payouts are processed directly after verifying consultations. Zero deduction fee on withdrawals.
              </Text>
            </View>

            {/* Submit button */}
            <TouchableOpacity
              style={[styles.submitBtn, isSubmitting && { opacity: 0.75 }]}
              onPress={handleSubmit}
              disabled={isSubmitting}
              activeOpacity={0.88}
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.submitBtnText}>Submit Payout Request</Text>
              )}
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  sheetContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: wp(6),
    borderTopRightRadius: wp(6),
    paddingHorizontal: wp(5),
    paddingTop: hp(1.5),
    paddingBottom: hp(4),
    maxHeight: hp(85),
  },
  handleBar: {
    width: wp(12),
    height: hp(0.5),
    borderRadius: wp(1),
    backgroundColor: "#ddd",
    alignSelf: "center",
    marginBottom: hp(1.2),
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: hp(2),
  },
  title: {
    fontSize: RF(17),
    fontWeight: "800",
    color: "#222",
  },
  subTitle: {
    fontSize: RF(12),
    color: "#4CAF50",
    fontWeight: "700",
    marginTop: hp(0.2),
  },
  closeBtn: {
    width: wp(8),
    height: wp(8),
    borderRadius: wp(4),
    backgroundColor: "#F0F0F0",
    alignItems: "center",
    justifyContent: "center",
  },
  scrollContent: {
    paddingBottom: hp(2),
  },
  fieldLabel: {
    fontSize: RF(11.5),
    fontWeight: "700",
    color: "#444",
    marginBottom: hp(0.6),
    marginTop: hp(1.2),
  },
  methodRow: {
    flexDirection: "row",
    gap: wp(3),
    marginBottom: hp(1),
  },
  methodBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F5F5F7",
    paddingVertical: hp(1.2),
    borderRadius: wp(3),
    borderWidth: 1,
    borderColor: "#E5E5E5",
    gap: wp(2),
  },
  methodBtnActive: {
    backgroundColor: ORANGE,
    borderColor: ORANGE,
  },
  methodBtnText: {
    fontSize: RF(12),
    fontWeight: "700",
    color: "#555",
  },
  methodBtnTextActive: {
    color: "#fff",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9F9FB",
    borderRadius: wp(3),
    borderWidth: 1,
    borderColor: "#E5E5E5",
    paddingHorizontal: wp(3.5),
    paddingVertical: hp(1.2),
    marginBottom: hp(0.5),
  },
  currencyPrefix: {
    fontSize: RF(16),
    fontWeight: "800",
    color: ORANGE,
    marginRight: wp(2),
  },
  fieldIcon: {
    marginRight: wp(2),
  },
  textInput: {
    flex: 1,
    fontSize: RF(13),
    color: "#222",
    fontWeight: "600",
    padding: 0,
  },
  maxBtn: {
    backgroundColor: "#FFF3E0",
    paddingHorizontal: wp(2.5),
    paddingVertical: hp(0.4),
    borderRadius: wp(2),
  },
  maxBtnText: {
    fontSize: RF(10),
    fontWeight: "800",
    color: ORANGE,
  },
  noticeBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E3F2FD",
    padding: wp(3),
    borderRadius: wp(3),
    gap: wp(2),
    marginTop: hp(2),
  },
  noticeText: {
    fontSize: RF(10.5),
    color: "#1565C0",
    fontWeight: "500",
    flex: 1,
  },
  submitBtn: {
    backgroundColor: ORANGE,
    borderRadius: wp(3.5),
    paddingVertical: hp(1.6),
    alignItems: "center",
    justifyContent: "center",
    marginTop: hp(2.5),
  },
  submitBtnText: {
    color: "#fff",
    fontSize: RF(13.5),
    fontWeight: "800",
  },
});
