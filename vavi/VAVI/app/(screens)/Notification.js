import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import Colors from "../../constants/Colors";import { hp, RF, wp } from "../../utils/responsive";

const notifications = [
  {
    id: "1",
    icon: "notifications",
    color: "#FF8A00",
    title: "Welcome to Astro Guide!",
    desc: "Thank you for joining us. Get expert guidance anytime, anywhere.",
    time: "2m ago",
  },
  {
    id: "2",
    icon: "call",
    color: "#27AE60",
    title: "Call Scheduled",
    desc: "Your call with Astrologer Rajesh Sharma is scheduled at 7:00 PM today.",
    time: "15m ago",
  },
  {
    id: "3",
    icon: "wallet",
    color: "#FF8A00",
    title: "Wallet Recharge Successful",
    desc: "₹300 has been added to your wallet. New balance: ₹654.00",
    time: "1h ago",
  },
  {
    id: "4",
    icon: "gift",
    color: "#27AE60",
    title: "Special Offer For You!",
    desc: "Get 10% OFF on your next call. Use code: ASTRO10",
    time: "2h ago",
  },
  {
    id: "5",
    icon: "star",
    color: "#FF8A00",
    title: "Rate Your Astrologer",
    desc: "How was your experience with Astrologer Rajesh Sharma?",
    time: "1d ago",
  },
  {
    id: "6",
    icon: "megaphone",
    color: "#27AE60",
    title: "New Astrologers Available",
    desc: "Check out new astrologers and get answers to your questions.",
    time: "2d ago",
  },
];

export default function Notification() {
  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.leftSection}>
        <View style={styles.iconCircle}>
          <Ionicons name={item.icon} size={RF(22)} color={item.color} />
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.title}>{item.title}</Text>

          <Text style={styles.desc}>{item.desc}</Text>
        </View>
      </View>

      <Text style={styles.time}>{item.time}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={RF(24)} color={Colors.darkBrown} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Notification</Text>

        <View style={{ width: wp(6) }} />
      </View>

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: hp(4),
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: wp(4),
    paddingVertical: hp(1.5),
    
  },

  headerTitle: {
    fontSize: RF(20),
    color: Colors.darkBrown,
    fontWeight: "600",
  },

  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",

    backgroundColor: Colors.white,

    marginHorizontal: wp(4),
    marginTop: hp(1.8),

    padding: wp(4),

    borderRadius: wp(4),

    elevation: 2,

    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 5,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },

  leftSection: {
    flexDirection: "row",
    flex: 1,
  },

  iconCircle: {
    width: wp(12),
    height: wp(12),
    borderRadius: wp(6),

    backgroundColor: "#F4F4F4",

    justifyContent: "center",
    alignItems: "center",
  },

  textContainer: {
    flex: 1,
    marginLeft: wp(3),
  },

  title: {
    fontSize: RF(14),
    color: Colors.darkBrown,
    fontWeight: "600",
  },

  desc: {
    marginTop: hp(0.5),
    fontSize: RF(12),
    color: Colors.textGray,
    lineHeight: RF(18),
    fontWeight: "400",
  },

  time: {
    marginLeft: wp(2),
    fontSize: RF(11),
    color: Colors.textGray,
    fontWeight: "400",
  },
});
