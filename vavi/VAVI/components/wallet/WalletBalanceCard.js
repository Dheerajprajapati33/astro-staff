import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";

import Colors from "../../constants/Colors";import { hp, RF, wp } from "../../utils/responsive";

export default function WalletBalanceCard({ balance = "0.00" }) {
  return (
    <LinearGradient
      colors={["#FFB11B", "#FF9800", "#FF7A00"]}
      start={{
        x: 0,
        y: 0,
      }}
      end={{
        x: 1,
        y: 1,
      }}
      style={styles.card}
    >
      {/* Decorative Stars */}

      <Text
        style={[
          styles.star,
          {
            top: hp(2),
            left: wp(42),
          },
        ]}
      >
        ✦
      </Text>

      <Text
        style={[
          styles.star,
          {
            top: hp(7),
            left: wp(55),
          },
        ]}
      >
        ✦
      </Text>

      {/* Left Side */}

      <View style={styles.left}>
        <Text style={styles.balanceTitle}>Available Balance</Text>

        <Text style={styles.balance}>₹ {Number(balance).toFixed(2)}</Text>

        <Text style={styles.creditText}>Wallet Credits</Text>
      </View>

      {/* Right Side */}

      <View style={styles.right}>
        <Image
          source={require("../../assets/images/placeholder.jpeg")}
          resizeMode="contain"
          style={styles.walletImage}
        />

        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.rechargeButton}
          onPress={() => router.push("/Recharge")}
        >
          <Ionicons name="add" size={RF(18)} color={Colors.primary} />

          <Text style={styles.rechargeText}>Recharge</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: wp(4),

    marginTop: hp(2),

    borderRadius: wp(5),

    paddingHorizontal: wp(5),

    paddingVertical: hp(2.2),

    flexDirection: "row",

    justifyContent: "space-between",

    alignItems: "center",

    elevation: 5,

    shadowColor: "#000",

    shadowOpacity: 0.15,

    shadowRadius: 8,

    shadowOffset: {
      width: 0,
      height: 3,
    },
  },

  left: {
    flex: 1,
  },

  balanceTitle: {
    color: "#FFF",

    fontSize: RF(14),

    fontWeight: "500",
  },

  balance: {
    marginTop: hp(1),

    color: "#FFF",

    fontSize: RF(34),

    fontWeight: "700",
  },

  creditText: {
    marginTop: hp(0.6),

    color: "#FFF",

    opacity: 0.95,

    fontSize: RF(13),

    fontWeight: "400",
  },

  right: {
    alignItems: "center",

    justifyContent: "center",
  },

  walletImage: {
    width: wp(20),

    height: wp(20),
  },

  rechargeButton: {
    marginTop: hp(1),

    backgroundColor: "#FFF",

    borderRadius: wp(6),

    paddingHorizontal: wp(5),

    paddingVertical: hp(1),

    flexDirection: "row",

    alignItems: "center",
  },

  rechargeText: {
    marginLeft: wp(1),

    color: Colors.primary,

    fontSize: RF(14),

    fontWeight: "600",
  },

  star: {
    position: "absolute",

    color: "rgba(255,255,255,0.7)",

    fontSize: RF(12),
  },
});
