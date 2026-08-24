import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Typography from "../../constants/Typography";
import { hp, RF, wp } from "../../utils/responsive";

const ORANGE = "#ff6a00";

const calls = [
  {
    name: "Riya Agarwal",
    city: "Mumbai, Maharashtra",
    problem: "Career and job guidance",
    time: "10:30 AM",
    initials: "RA",
    bg: "#fff1e8",
  },
  {
    name: "Amit Sharma",
    city: "Delhi, India",
    problem: "Financial problems",
    time: "09:15 AM",
    initials: "AS",
    bg: "#eefbea",
  },
  {
    name: "Sunita Prajapati",
    city: "Jaipur, Rajasthan",
    problem: "Marriage and relationship",
    time: "08:05 AM",
    initials: "SP",
    bg: "#f0e9ff",
  },
  {
    name: "Vikram Kumar",
    city: "Lucknow, Uttar Pradesh",
    problem: "Health issues",
    time: "07:20 AM",
    initials: "VK",
    bg: "#fff3dd",
  },
  {
    name: "Neha Patel",
    city: "Ahmedabad, Gujarat",
    problem: "Family problems",
    time: "06:10 AM",
    initials: "NP",
    bg: "#e5f4ff",
  },
  {
    name: "Deepak Yadav",
    city: "Bhopal, Madhya Pradesh",
    problem: "Business growth",
    time: "05:00 AM",
    initials: "DK",
    bg: "#ffeaf1",
  },
  {
    name: "Pooja Mehta",
    city: "Pune, Maharashtra",
    problem: "Education guidance",
    time: "04:10 AM",
    initials: "PM",
    bg: "#e8f7f4",
  },
  {
    name: "Rahul Verma",
    city: "Chandigarh, Punjab",
    problem: "Property dispute",
    time: "03:25 AM",
    initials: "RV",
    bg: "#f4f0ff",
  },
  {
    name: "Anjali Nair",
    city: "Kochi, Kerala",
    problem: "Mental wellness",
    time: "02:40 AM",
    initials: "AN",
    bg: "#fff0e6",
  },
  {
    name: "Suresh Reddy",
    city: "Hyderabad, Telangana",
    problem: "Legal consultation",
    time: "01:55 AM",
    initials: "SR",
    bg: "#e6f2ff",
  },
  {
    name: "Kavita Joshi",
    city: "Indore, Madhya Pradesh",
    problem: "Parenting advice",
    time: "12:30 AM",
    initials: "KJ",
    bg: "#fef4e0",
  },
];

export default function CallHistory() {
  const [showInfo, setShowInfo] = useState(false);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={RF(24)} color={ORANGE} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Call History</Text>

        <TouchableOpacity
          style={styles.helpButton}
          onPress={() => setShowInfo((prev) => !prev)}
        >
          <Ionicons name="help-circle-outline" size={RF(22)} color={ORANGE} />
        </TouchableOpacity>
      </View>

      {showInfo && (
        <View style={styles.infoCard}>
          <View style={styles.infoIcon}>
            <Ionicons name="call-outline" size={RF(20)} color={ORANGE} />
          </View>
          <Text style={styles.infoText}>
            Here you can see the list of clients{"\n"}you have spoken with.
          </Text>
        </View>
      )}

      <FlatList
        data={calls}
        keyExtractor={(item) => item.name}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} activeOpacity={0.8}>
            <View style={[styles.avatar, { backgroundColor: item.bg }]}>
              <Text style={styles.avatarText}>{item.initials}</Text>
            </View>

            <View style={styles.middle}>
              <Text style={styles.name}>{item.name}</Text>

              <View style={styles.locationRow}>
                <Ionicons
                  name="location-outline"
                  size={RF(13)}
                  color={ORANGE}
                />
                <Text style={styles.city}>{item.city}</Text>
              </View>

              <Text style={styles.problem}>
                Problem: <Text style={styles.problemValue}>{item.problem}</Text>
              </Text>
            </View>

            <View style={styles.right}>
              <View style={styles.timeRow}>
                <Ionicons name="time-outline" size={RF(13)} color={ORANGE} />
                <Text style={styles.time}>{item.time}</Text>
              </View>
              <Text style={styles.today}>Today</Text>
            </View>

            {/* <Ionicons name="chevron-forward" size={RF(18)} color="#aaa" /> */}
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    height: hp(6.5),
    paddingHorizontal: wp(4),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  headerTitle: {
    fontSize: RF(20),
    color: "#1f2937",
    fontWeight: "900",
    fontFamily: Typography?.bold,
    left: 4,
  },
  helpButton: {
    marginLeft: "auto",
  },
  infoCard: {
    marginHorizontal: wp(4),
    marginTop: hp(1),
    marginBottom: hp(2),
    padding: wp(3.2),
    borderRadius: wp(3),
    backgroundColor: "#fff7f2",
    flexDirection: "row",
    alignItems: "center",
  },
  infoIcon: {
    width: wp(11),
    height: wp(11),
    borderRadius: wp(5.5),
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginRight: wp(3),
  },
  infoText: {
    fontSize: RF(10),
    color: "#607086",
    lineHeight: hp(2.1),
    fontWeight: "700",
    fontFamily: Typography?.bold,
  },
  list: {
    paddingHorizontal: wp(4),
    paddingBottom: hp(3),
  },
  card: {
    minHeight: hp(12),
    backgroundColor: "#fff",
    borderRadius: wp(4),
    paddingHorizontal: wp(3.2),
    paddingVertical: hp(1.2),
    marginBottom: hp(1.6),
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#f2f2f2",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  avatar: {
    width: wp(14),
    height: wp(14),
    borderRadius: wp(7),
    alignItems: "center",
    justifyContent: "center",
    marginRight: wp(3.2),
  },
  avatarText: {
    fontSize: RF(14),
    color: ORANGE,
    fontWeight: "900",
    fontFamily: Typography?.bold,
  },
  middle: {
    flex: 1,
  },
  name: {
    fontSize: RF(16),
    color: "#1f2937",
    fontWeight: "900",
    marginBottom: hp(0.2),
    fontFamily: Typography?.bold,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hp(0.2),
  },
  city: {
    fontSize: RF(11.5),
    color: "#607086",
    marginLeft: wp(1),
    fontWeight: "700",
    fontFamily: Typography?.bold,
  },
  problem: {
    fontSize: RF(11.5),
    color: ORANGE,
    fontWeight: "800",
    fontFamily: Typography?.bold,
  },
  problemValue: {
    color: "#607086",
    fontWeight: "700",
    fontFamily: Typography?.bold,
  },
  right: {
    alignItems: "flex-start",
    marginRight: wp(2),
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  time: {
    fontSize: RF(12),
    color: "#1f2937",
    fontWeight: "800",
    marginLeft: wp(0.8),
    fontFamily: Typography?.bold,
  },
  today: {
    fontSize: RF(11),
    color: "#607086",
    marginTop: hp(0.5),
    marginLeft: wp(4),
    fontWeight: "700",
    fontFamily: Typography?.bold,
  },
});
