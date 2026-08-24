import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUpdateConsultationPriceMutation } from "../../redux/PriceupdateApi";
import Typography from "../../constants/Typography";
import { hp, RF, wp } from "../../utils/responsive";

const ORANGE = "#ff5a00";

export default function UpdatePrice() {
  const [activeTab, setActiveTab] = useState("call");

  const [price, setPrice] = useState("");

  const [showModal, setShowModal] = useState(false);

  const [updatePrice, { isLoading }] = useUpdateConsultationPriceMutation();

  const handleSendRequest = async () => {
    if (!price) {
      Alert.alert("Price Required", "Please enter your new consultation price");

      return;
    }

    try {
      const response = await updatePrice({
        type: activeTab,

        requestedPrice: Number(price),
      }).unwrap();

      console.log("PRICE UPDATE RESPONSE", response);

      setPrice("");

      setShowModal(true);
    } catch (error) {
      console.log("PRICE UPDATE ERROR", error);

      Alert.alert(
        "Request Failed",

        error?.data?.message || "Something went wrong",
      );
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid
        extraScrollHeight={hp(8)}
        contentContainerStyle={styles.scroll}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Update Your Consultation Price</Text>

          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="close" size={RF(24)} color={ORANGE} />
          </TouchableOpacity>
        </View>

        <View style={styles.tabRow}>
          <TouchableOpacity
            style={[styles.tabBtn, activeTab === "call" && styles.activeTab]}
            onPress={() => setActiveTab("call")}
          >
            <Ionicons
              name="call-outline"
              size={RF(17)}
              color={activeTab === "call" ? ORANGE : "#111"}
            />
            <Text
              style={[
                styles.tabText,
                activeTab === "call" && styles.activeTabText,
              ]}
            >
              Call Price
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabBtn, activeTab === "chat" && styles.activeTab]}
            onPress={() => setActiveTab("chat")}
          >
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={RF(17)}
              color={activeTab === "chat" ? ORANGE : "#111"}
            />
            <Text
              style={[
                styles.tabText,
                activeTab === "chat" && styles.activeTabText,
              ]}
            >
              Chat Price
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Current Price</Text>

        <View style={styles.currentCard}>
          <View style={styles.iconCircle}>
            <Ionicons
              name={
                activeTab === "call"
                  ? "call-outline"
                  : "chatbubble-ellipses-outline"
              }
              size={RF(28)}
              color={ORANGE}
            />
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.priceText}>
              ₹{activeTab === "call" ? "30" : "15"}
              <Text style={styles.minText}> /min</Text>
            </Text>

            <Text style={styles.currentDesc}>
              You will be able to continue with this price until admin approves
              your new request.
            </Text>
          </View>
        </View>

        <Text style={styles.label}>New Price (per minute)</Text>

        <View style={styles.inputBox}>
          <View style={styles.rupeeBox}>
            <Text style={styles.rupee}>₹</Text>
          </View>

          <TextInput
            placeholder="Enter new price"
            placeholderTextColor="#9ca3af"
            keyboardType="number-pad"
            value={price}
            onChangeText={setPrice}
            style={styles.input}
          />

          <View style={styles.currencyBox}>
            <Text style={styles.currencyText}>INR</Text>
          </View>
        </View>

        <View style={styles.infoCard}>
          <View style={styles.infoIcon}>
            <Ionicons name="bulb-outline" size={RF(24)} color={ORANGE} />
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.infoTitle}>Important</Text>
            <Text style={styles.infoText}>
              Your new price will be reviewed by our admin. You will be notified
              once the request is approved.
            </Text>
          </View>
        </View>

        <View style={styles.warningCard}>
          <View style={styles.warningRow}>
            <View style={styles.warningIcon}>
              <Ionicons
                name="shield-checkmark-outline"
                size={RF(22)}
                color={ORANGE}
              />
            </View>

            <Text style={styles.warningTitle}>Before you send</Text>
          </View>

          <Text style={styles.warningText}>
            Your price update request will be sent to our admin. Our admin will
            review your activity and performance. If everything looks good, the
            request will be approved{" "}
            <Text style={styles.orangeText}>within 72 hours.</Text>
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.85}
          style={[
            styles.sendBtn,
            isLoading && {
              opacity: 0.6,
            },
          ]}
          disabled={isLoading}
          onPress={handleSendRequest}
        >
          <Ionicons name="paper-plane-outline" size={RF(21)} color="#fff" />
          <Text style={styles.sendText}>
            {isLoading ? "Sending..." : "Send Request"}
          </Text>
        </TouchableOpacity>

        <View style={styles.footerNote}>
          <Ionicons name="lock-closed-outline" size={RF(12)} color={ORANGE} />
          <Text style={styles.footerText}>
            You can send a request once every 24 hours.
          </Text>
        </View>
      </KeyboardAwareScrollView>

      <Modal
        visible={showModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <View style={styles.successIcon}>
              <Ionicons name="checkmark-circle" size={RF(55)} color="#22c55e" />
            </View>

            <Text style={styles.modalTitle}>Request Sent Successfully</Text>

            <Text style={styles.modalText}>
              Your price update request has been sent to admin. You will be
              notified after approval.
            </Text>

            <TouchableOpacity
              style={styles.modalBtn}
              onPress={() => setShowModal(false)}
            >
              <Text style={styles.modalBtnText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: wp(5),
    paddingTop: hp(2),
    paddingBottom: hp(3),
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    fontSize: RF(16),
    color: "#1f2937",
    fontWeight: "900",
    fontFamily: Typography?.bold,
  },
  tabRow: {
    flexDirection: "row",
    marginTop: hp(2.5),
    marginBottom: hp(2.2),
  },
  tabBtn: {
    flex: 1,
    height: hp(5.2),
    borderWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: wp(2),
  },
  activeTab: {
    borderColor: ORANGE,
    borderRadius: wp(2),
  },
  tabText: {
    fontSize: RF(12),
    color: "#111827",
    fontWeight: "800",
    fontFamily: Typography?.bold,
  },
  activeTabText: {
    color: ORANGE,
  },
  label: {
    fontSize: RF(12),
    color: "#6b7280",
    fontWeight: "800",
    marginBottom: hp(1),
    fontFamily: Typography?.bold,
  },
  currentCard: {
    minHeight: hp(10),
    borderWidth: 1,
    borderColor: "#edf0f3",
    borderRadius: wp(3),
    backgroundColor: "#fff",
    padding: wp(3.2),
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hp(2.3),
  },
  iconCircle: {
    width: wp(13),
    height: wp(13),
    borderRadius: wp(6.5),
    backgroundColor: "#fff3ea",
    alignItems: "center",
    justifyContent: "center",
    marginRight: wp(4),
  },
  priceText: {
    fontSize: RF(20),
    color: "#111827",
    fontWeight: "900",
    fontFamily: Typography?.bold,
  },
  minText: {
    fontSize: RF(10),
    color: "#6b7280",
    fontWeight: "700",
    fontFamily: Typography?.bold,
  },
  currentDesc: {
    marginTop: hp(0.5),
    fontSize: RF(9.5),
    color: "#6b7280",
    lineHeight: hp(1.9),
    fontWeight: "700",
    fontFamily: Typography?.bold,
  },
  inputBox: {
    height: hp(6),
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: wp(2),
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
    marginBottom: hp(2.3),
  },
  rupeeBox: {
    width: wp(11),
    height: "100%",
    backgroundColor: "#f8fafc",
    alignItems: "center",
    justifyContent: "center",
    borderRightWidth: 1,
    borderRightColor: "#e5e7eb",
  },
  rupee: {
    fontSize: RF(13),
    color: "#111827",
    fontWeight: "900",
    fontFamily: Typography?.bold,
  },
  input: {
    flex: 1,
    height: "100%",
    paddingHorizontal: wp(3.5),
    fontSize: RF(12),
    color: "#111827",
    fontWeight: "700",
    fontFamily: Typography?.bold,
  },
  currencyBox: {
    marginRight: wp(3),
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: wp(1.5),
    paddingHorizontal: wp(2.5),
    paddingVertical: hp(0.8),
    backgroundColor: "#fff",
  },
  currencyText: {
    fontSize: RF(9.5),
    color: "#6b7280",
    fontWeight: "800",
    fontFamily: Typography?.bold,
  },
  infoCard: {
    borderRadius: wp(3),
    backgroundColor: "#fff7f0",
    padding: wp(3.2),
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hp(2),
  },
  infoIcon: {
    width: wp(12),
    height: wp(12),
    borderRadius: wp(6),
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginRight: wp(3),
  },
  infoTitle: {
    fontSize: RF(12),
    color: ORANGE,
    fontWeight: "900",
    marginBottom: hp(0.5),
    fontFamily: Typography?.bold,
  },
  infoText: {
    fontSize: RF(9.5),
    color: "#6b7280",
    lineHeight: hp(1.9),
    fontWeight: "700",
    fontFamily: Typography?.bold,
  },
  warningCard: {
    borderWidth: 1,
    borderColor: "#ffd8b8",
    borderRadius: wp(3),
    padding: wp(3.2),
    backgroundColor: "#fffdf8",
    marginBottom: hp(2.5),
  },
  warningRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hp(1),
  },
  warningIcon: {
    width: wp(11),
    height: wp(11),
    borderRadius: wp(5.5),
    backgroundColor: "#fff3ea",
    alignItems: "center",
    justifyContent: "center",
    marginRight: wp(3),
  },
  warningTitle: {
    fontSize: RF(12),
    color: ORANGE,
    fontWeight: "900",
    fontFamily: Typography?.bold,
  },
  warningText: {
    fontSize: RF(10),
    color: "#6b7280",
    lineHeight: hp(2.1),
    fontWeight: "700",
    fontFamily: Typography?.bold,
  },
  orangeText: {
    color: ORANGE,
    fontWeight: "900",
  },
  sendBtn: {
    height: hp(6.3),
    borderRadius: wp(2),
    backgroundColor: ORANGE,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: wp(3),
  },
  sendText: {
    color: "#fff",
    fontSize: RF(15),
    fontWeight: "900",
    fontFamily: Typography?.bold,
  },
  footerNote: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: hp(2),
  },
  footerText: {
    fontSize: RF(9.5),
    color: "#6b7280",
    marginLeft: wp(1.2),
    fontWeight: "700",
    fontFamily: Typography?.bold,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalBox: {
    width: wp(80),
    backgroundColor: "#fff",
    borderRadius: wp(4),
    padding: wp(5),
    alignItems: "center",
  },

  successIcon: {
    marginBottom: hp(1),
  },

  modalTitle: {
    fontSize: RF(15),
    color: "#111827",
    fontWeight: "900",
    textAlign: "center",
    fontFamily: Typography?.bold,
  },

  modalText: {
    marginTop: hp(1),
    fontSize: RF(10),
    color: "#6b7280",
    textAlign: "center",
    lineHeight: hp(1.9),
    fontWeight: "700",
    fontFamily: Typography?.bold,
  },

  modalBtn: {
    marginTop: hp(2),
    backgroundColor: ORANGE,
    paddingHorizontal: wp(8.5),
    paddingVertical: hp(1),
    borderRadius: wp(2),
  },

  modalBtnText: {
    color: "#fff",
    fontSize: RF(13),
    fontWeight: "900",
    fontFamily: Typography?.bold,
  },
});
