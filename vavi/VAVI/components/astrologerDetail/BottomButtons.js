import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import { useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import Colors from "../../constants/Colors";import { useCreateConsultationMutation } from "../../redux/consultationApi";
import { hp, RF, wp } from "../../utils/responsive";

const LOG_TAG = "[BottomButtons]";

export default function BottomButtons({ astrologer = {} }) {
  const [isStartingChat, setIsStartingChat] = useState(false);

  const [createConsultation] = useCreateConsultationMutation();
  const callPrice =
    astrologer?.internetCallPrice ?? astrologer?.callPrice ?? "0";

  const chatPrice = astrologer?.chatPrice ?? "0";

  const normalizeBoolean = (value) => {
    return (
      value === true ||
      value === 1 ||
      value === "1" ||
      String(value).toLowerCase() === "true"
    );
  };

  const isCallOnline = normalizeBoolean(
    astrologer?.isCallOnline ??
      astrologer?.isCallAvailable ??
      astrologer?.callAvailable ??
      astrologer?.IsCallOnline ??
      astrologer?.isOnline ??
      false,
  );

  const isChatOnline = normalizeBoolean(
    astrologer?.isChatOnline ??
      astrologer?.isChatAvailable ??
      astrologer?.chatAvailable ??
      astrologer?.IsChatOnline ??
      astrologer?.isOnline ??
      false,
  );

  const isBusy = normalizeBoolean(
    astrologer?.isBusy ??
      astrologer?.busy ??
      (astrologer?.status === "busy" ||
        astrologer?.status === "on_call" ||
        astrologer?.status === "in_consultation"),
  );

  const showBusyAlert = () => {
    Alert.alert(
      "Astrologer Busy",
      "Astrologer is currently busy on another call/consultation. Please try again in a few minutes.",
      [{ text: "OK" }],
    );
  };

  const showUnavailableAlert = (feature) => {
    Alert.alert(
      "Astrologer Not Available",
      `Astrologer is currently not available for ${feature}. Please try again later.`,
      [
        {
          text: "OK",
        },
      ],
    );
  };

  const [isStartingCall, setIsStartingCall] = useState(false);

  const handleCall = async () => {
    if (isBusy) {
      showBusyAlert();
      return;
    }

    if (!isCallOnline) {
      showUnavailableAlert("call");
      return;
    }

    if (isStartingCall) return;
    setIsStartingCall(true);

    console.log(LOG_TAG, "Creating call consultation for astrologer:", astrologer?.id);

    try {
      const response = await createConsultation({
        astrologerId: astrologer?.id,
        type: "call",
        problem: astrologer?.expertises?.[0]?.name || "Horoscope Reading",
      }).unwrap();

      console.log(LOG_TAG, "Call Consultation created:", response);

      const consultation = response?.data?.consultation || response?.data;
      const consultationId =
        consultation?.id ||
        response?.data?.consultationId ||
        response?.consultationId;
      const maxDuration =
        consultation?.maxDuration ||
        response?.data?.maxDuration ||
        1500;

      if (!consultationId) {
        Alert.alert("Error", "Could not start call. Please try again.");
        return;
      }

      router.push({
        pathname: "/CallConsultation",
        params: {
          consultationId,
          astrologerId: astrologer?.id || "",
          maxDuration: String(maxDuration),
          astrologerName: astrologer?.name || "",
          astrologerImage: astrologer?.profilePic || "",
          ratePerMinute: String(callPrice || "25"),
        },
      });
    } catch (error) {
      console.log(LOG_TAG, "Create call consultation failed:", error);
      Alert.alert(
        "Unable to Start Call",
        error?.data?.message || "Something went wrong. Please try again.",
      );
    } finally {
      setIsStartingCall(false);
    }
  };

  const handleChat = async () => {
    if (isBusy) {
      showBusyAlert();
      return;
    }

    if (!isChatOnline) {
      showUnavailableAlert("chat");

      return;
    }

    if (isStartingChat) {
      return;
    }

    setIsStartingChat(true);

    console.log(LOG_TAG, "Creating chat consultation for astrologer:", astrologer?.id);

    try {
      const response = await createConsultation({
        astrologerId: astrologer?.id,
        type: "chat",
        problem: astrologer?.expertises?.[0]?.name || "General Consultation",
      }).unwrap();

      console.log(LOG_TAG, "Consultation created:", response);

      const consultation = response?.data?.consultation || response?.data;

      const consultationId =
        consultation?.id ||
        response?.data?.consultationId ||
        response?.consultationId;
      const maxDuration =
        consultation?.maxDuration ||
        response?.data?.maxDuration ||
        1500;

      if (!consultationId) {
        console.log(LOG_TAG, "No consultationId returned from create API");

        Alert.alert("Error", "Could not start chat. Please try again.");

        return;
      }

      router.push({
        pathname: "/ChatConsultation",
        params: {
          consultationId,
          astrologerId: astrologer?.id || "",
          maxDuration: String(maxDuration),
          astrologerName: astrologer?.name || "",
          astrologerImage: astrologer?.profilePic || "",
        },
      });
    } catch (error) {
      console.log(LOG_TAG, "Create consultation failed:", error);

      Alert.alert(
        "Unable to Start Chat",
        error?.data?.message || "Something went wrong. Please try again.",
      );
    } finally {
      setIsStartingChat(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* CALL BUTTON */}

      <TouchableOpacity
        activeOpacity={0.8}
        style={[styles.callButton, !isCallOnline && styles.disabledCallButton]}
        onPress={handleCall}
      >
        <Ionicons name="call-outline" size={RF(22)} color={Colors.white} />

        <View style={styles.textContainer}>
          <Text style={styles.title}>
            {isCallOnline ? "Call Now" : "Call Offline"}
          </Text>

          <Text style={styles.price}>₹{callPrice}/min</Text>
        </View>
      </TouchableOpacity>

      {/* CHAT BUTTON */}

      <TouchableOpacity
        activeOpacity={0.8}
        style={[styles.chatButton, !isChatOnline && styles.disabledChatButton]}
        onPress={handleChat}
        disabled={isStartingChat}
      >
        {isStartingChat ? (
          <ActivityIndicator size="small" color={Colors.primary} />
        ) : (
          <Ionicons
            name="chatbubble-ellipses-outline"
            size={RF(22)}
            color={isChatOnline ? Colors.primary : Colors.textGray}
          />
        )}

        <View style={styles.textContainer}>
          <Text
            style={[styles.chatTitle, !isChatOnline && styles.disabledChatText]}
          >
            {isStartingChat ? "Connecting..." : isChatOnline ? "Chat Now" : "Chat Offline"}
          </Text>

          <Text
            style={[styles.chatPrice, !isChatOnline && styles.disabledChatText]}
          >
            ₹{chatPrice}/min
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",

    paddingHorizontal: wp(4),

    paddingVertical: hp(2),

    backgroundColor: Colors.white,

    borderTopWidth: 1,

    borderTopColor: "#ECECEC",

    justifyContent: "space-between",
  },

  callButton: {
    flex: 1,

    height: hp(7),

    backgroundColor: Colors.primary,

    borderRadius: wp(3),

    flexDirection: "row",

    justifyContent: "center",

    alignItems: "center",

    marginRight: wp(2),
  },

  disabledCallButton: {
    backgroundColor: "#AAAAAA",
  },

  chatButton: {
    flex: 1,

    height: hp(7),

    backgroundColor: "#FFF4ED",

    borderWidth: 1,

    borderColor: Colors.primary,

    borderRadius: wp(3),

    flexDirection: "row",

    justifyContent: "center",

    alignItems: "center",

    marginLeft: wp(2),
  },

  disabledChatButton: {
    backgroundColor: "#F2F2F2",

    borderColor: "#CCCCCC",
  },

  textContainer: {
    marginLeft: wp(2),
  },

  title: {
    color: Colors.white,

    fontSize: RF(15),

    fontWeight: "600",
  },

  price: {
    color: Colors.white,

    fontSize: RF(11),

    fontWeight: "400",
  },

  chatTitle: {
    color: Colors.primary,

    fontSize: RF(15),

    fontWeight: "600",
  },

  chatPrice: {
    color: Colors.primary,

    fontSize: RF(11),

    fontWeight: "400",
  },

  disabledChatText: {
    color: Colors.textGray,
  },
});
