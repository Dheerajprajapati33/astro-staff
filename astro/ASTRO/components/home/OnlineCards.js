import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import Typography from "../../constants/Typography";
import { hp, RF, wp } from "../../utils/responsive";

import { useUpdateOnlineStatusMutation } from "../../redux/onlineApi";
import { useGetProfileQuery } from "../../redux/ProfileApi";

const ORANGE = "#ff6a00";
const GREEN = "#22c55e";
const GRAY = "#9ca3af";

const OnlineCards = () => {
  console.log("ONLINE CARD RENDER");
  const [callOnline, setCallOnline] = useState(false);
  const [chatOnline, setChatOnline] = useState(false);

  const [updatingType, setUpdatingType] = useState(null);

  const {
    data: profile,
    isLoading: profileLoading,
    isFetching: profileFetching,
    refetch: refetchProfile,
  } = useGetProfileQuery();

  const [updateOnlineStatus, { isLoading: statusUpdating }] =
    useUpdateOnlineStatusMutation();

  /*
   * Profile API se current status aur prices set honge.
   */
  useEffect(() => {
    if (!profile) return;

    setCallOnline(Boolean(profile?.isCallOnline));
    setChatOnline(Boolean(profile?.isChatOnline));
  }, [profile]);

  const handleStatusChange = async (type, newValue) => {
    const previousCallStatus = callOnline;
    const previousChatStatus = chatOnline;

    /*
     * Optimistic update:
     * Switch turant change hoga.
     */
    if (type === "call") {
      setCallOnline(newValue);
    } else {
      setChatOnline(newValue);
    }

    setUpdatingType(type);

    try {
      const payload =
        type === "call"
          ? {
              isCallOnline: newValue,
            }
          : {
              isChatOnline: newValue,
            };

      console.log("ONLINE STATUS REQUEST:", payload);

      const response = await updateOnlineStatus(payload).unwrap();

      console.log("ONLINE STATUS RESPONSE:", response);

      /*
       * API response:
       * {
       *   isChatOnline: true,
       *   isCallOnline: false
       * }
       */
      if (typeof response?.isCallOnline === "boolean") {
        setCallOnline(response.isCallOnline);
      }

      if (typeof response?.isChatOnline === "boolean") {
        setChatOnline(response.isChatOnline);
      }

      /*
       * Profile API ke latest data ko reload karega.
       */
      await refetchProfile();
    } catch (error) {
      console.log(
        "ONLINE STATUS UPDATE ERROR:",
        JSON.stringify(error, null, 2),
      );

      /*
       * API fail hone par previous status restore.
       */
      setCallOnline(previousCallStatus);
      setChatOnline(previousChatStatus);

      Alert.alert(
        "Update Failed",
        error?.data?.message ||
          error?.error ||
          "Unable to update online status. Please try again.",
      );
    } finally {
      setUpdatingType(null);
    }
  };

  if (profileLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color={ORANGE} />
        <Text style={styles.loadingText}>Loading availability...</Text>
      </View>
    );
  }

  return (
    <View style={styles.row}>
      <PriceCard
        icon="call-outline"
        title="Call"
        price={profile?.callPrice ? `₹${Number(profile.callPrice)}` : "₹0"}
        unit="/min"
        online={callOnline}
        updating={statusUpdating && updatingType === "call"}
        onStatusChange={(value) => handleStatusChange("call", value)}
      />

      <PriceCard
        icon="chatbubble-ellipses-outline"
        title="Chat"
        price={profile?.chatPrice ? `₹${Number(profile.chatPrice)}` : "₹0"}
        unit="/min"
        online={chatOnline}
        updating={statusUpdating && updatingType === "chat"}
        onStatusChange={(value) => handleStatusChange("chat", value)}
      />
    </View>
  );
};

const PriceCard = ({
  icon,
  title,
  price,
  unit,
  online,
  updating,
  onStatusChange,
}) => {
  const statusColor = online ? GREEN : GRAY;

  return (
    <View
      style={[styles.card, online ? styles.onlineCard : styles.offlineCard]}
    >
      <View style={styles.topRow}>
        <View
          style={[
            styles.iconBox,
            {
              backgroundColor: online ? "#ecfdf3" : "#f3f4f6",
            },
          ]}
        >
          <Ionicons name={icon} size={RF(20)} color={online ? GREEN : GRAY} />
        </View>

        <View style={styles.priceContent}>
          <Text style={styles.title}>{title}</Text>

          <Text style={styles.price}>
            {price}
            <Text style={styles.unit}>{unit}</Text>
          </Text>
        </View>
      </View>

      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.updateBtn}
        onPress={() => router.push("/updateprice")}
      >
        <Text style={styles.updateText}>Update Price</Text>
      </TouchableOpacity>

      <View style={styles.bottomRow}>
        <Text style={styles.youAre}>You are</Text>

        <View style={styles.statusRow}>
          <View
            style={[
              styles.statusDot,
              {
                backgroundColor: statusColor,
              },
            ]}
          />

          <Text
            style={[
              styles.statusText,
              {
                color: statusColor,
              },
            ]}
          >
            {online ? "Online" : "Offline"}
          </Text>
        </View>

        {updating ? (
          <View style={styles.switchLoader}>
            <ActivityIndicator size="small" color={statusColor} />
          </View>
        ) : (
          <Switch
            value={online}
            onValueChange={onStatusChange}
            disabled={updating}
            trackColor={{
              false: "#d1d5db",
              true: GREEN,
            }}
            thumbColor="#fff"
            ios_backgroundColor="#d1d5db"
          />
        )}
      </View>
    </View>
  );
};

export default OnlineCards;

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: hp(1.5),
  },

  loadingContainer: {
    minHeight: hp(15),
    alignItems: "center",
    justifyContent: "center",
  },

  loadingText: {
    color: "#777",
    fontSize: RF(9.5),
    marginTop: hp(0.8),
    fontFamily: Typography?.regular,
  },

  card: {
    width: wp(43),
    borderWidth: 1,
    borderRadius: wp(3),
    backgroundColor: "#fff",
    padding: wp(3),
  },

  onlineCard: {
    borderColor: "#bbf7d0",
  },

  offlineCard: {
    borderColor: "#e5e7eb",
  },

  topRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  iconBox: {
    width: wp(10),
    height: wp(10),
    borderRadius: wp(5),
    alignItems: "center",
    justifyContent: "center",
    marginRight: wp(3),
  },

  priceContent: {
    flex: 1,
  },

  title: {
    fontSize: RF(16),
    color: "#333",
    fontWeight: "700",
    fontFamily: Typography?.bold,
  },

  price: {
    fontSize: RF(17),
    color: "#222",
    fontWeight: "800",
    fontFamily: Typography?.bold,
  },

  unit: {
    fontSize: RF(10),
    color: "#777",
    fontWeight: "500",
    fontFamily: Typography?.regular,
  },

  updateBtn: {
    alignSelf: "center",
    marginTop: hp(1),
    borderWidth: 1,
    borderColor: "#ffb98a",
    borderRadius: wp(2),
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.6),
  },

  updateText: {
    color: ORANGE,
    fontSize: RF(14),
    fontWeight: "700",
    fontFamily: Typography?.bold,
  },

  bottomRow: {
    marginTop: hp(1.3),
    borderTopWidth: 1,
    borderTopColor: "#f4f4f4",
    paddingTop: hp(1),
    flexDirection: "row",
    alignItems: "center",
  },

  youAre: {
    fontSize: RF(10),
    color: "#777",
    fontFamily: Typography?.regular,
  },

  statusRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginLeft: wp(2),
  },

  statusDot: {
    width: wp(1.7),
    height: wp(1.7),
    borderRadius: wp(1),
    marginRight: wp(1),
  },

  statusText: {
    fontSize: RF(12),
    fontWeight: "700",
    fontFamily: Typography?.bold,
  },

  switchLoader: {
    width: wp(12),
    alignItems: "center",
    justifyContent: "center",
  },
});
