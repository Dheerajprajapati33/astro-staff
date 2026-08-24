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
const RED = "#ff2d2d";
const GREEN = "#24a148";

const warnings = [
  {
    title: "Inappropriate Language",
    desc: "You used inappropriate language during a live session.",
    tag: "First Warning",
    date: "25 May 2025",
    time: "11:30 AM",
  },
  {
    title: "Misleading Information",
    desc: "You provided misleading information to the client.",
    tag: "Second Warning",
    date: "18 May 2025",
    time: "04:45 PM",
  },
  {
    title: "Promoting Other Platforms",
    desc: "You promoted other platforms during a session.",
    tag: "Second Warning",
    date: "10 May 2025",
    time: "02:20 PM",
  },
  {
    title: "Session Cancellation",
    desc: "You cancelled multiple sessions without a valid reason.",
    tag: "Third Warning",
    date: "02 May 2025",
    time: "09:10 AM",
  },
];

export default function Warnings() {
  const [showInfo, setShowInfo] = useState(false);
  const [showImportant, setShowImportant] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={RF(24)} color={ORANGE} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Warnings</Text>

        <View style={[styles.headerActions, styles.headerActionsRight]}>
          <TouchableOpacity
            onPress={() => setShowImportant((prev) => !prev)}
          >
            <Ionicons name="information-circle-outline" size={RF(22)} color={GREEN} />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setShowHelp((prev) => !prev)}>
            <Ionicons name="headset-outline" size={RF(22)} color={RED} />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setShowInfo((prev) => !prev)}>
            <Ionicons name="help-circle-outline" size={RF(22)} color={ORANGE} />
          </TouchableOpacity>
        </View>
      </View>

      {showImportant && (
        <View style={[styles.importantCard, styles.headerDropdown]}>
          <View style={styles.infoCircle}>
            <Ionicons name="information" size={RF(22)} color={GREEN} />
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.importantTitle}>Important</Text>
            <Text style={styles.importantText}>
              Too many violations may result in temporary suspension or
              permanent ban of your account.
            </Text>
          </View>

          <Text style={styles.greenShield}>🛡️</Text>
        </View>
      )}

      {showHelp && (
        <View style={[styles.helpCard, styles.headerDropdown]}>
          <View style={styles.helpIcon}>
            <Ionicons name="headset" size={RF(23)} color={RED} />
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.helpTitle}>Need Help?</Text>
            <Text style={styles.helpText}>
              If you think this warning was a mistake, you can contact the
              support team.
            </Text>
          </View>

          <TouchableOpacity style={styles.supportBtn}>
            <Text style={styles.supportText}>Contact Support</Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={warnings}
        keyExtractor={(item) => item.title}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <>
            {showInfo && (
              <View style={styles.topCard}>
                <View style={styles.shieldCircle}>
                  <Ionicons name="shield" size={RF(35)} color={RED} />
                  <Ionicons
                    name="alert"
                    size={RF(18)}
                    color="#fff"
                    style={styles.alertInside}
                  />
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={styles.topTitle}>
                    Please follow our community guidelines and policies.
                  </Text>
                  <Text style={styles.topSub}>
                    Repeated violations may lead to account restrictions.
                  </Text>
                </View>

                <Text style={styles.clipboard}>📋</Text>
              </View>
            )}

            <View style={styles.sectionRow}>
              {/* <Text style={styles.sectionTitle}>All Warnings</Text> */}

              {/* <TouchableOpacity style={styles.filterRow}>
                <Ionicons name="filter-outline" size={RF(17)} color={RED} />
                <Text style={styles.filterText}>Filter</Text>
              </TouchableOpacity> */}
            </View>
          </>
        }
        renderItem={({ item }) => <WarningItem item={item} />}
      />
    </SafeAreaView>
  );
}

const WarningItem = ({ item }) => {
  return (
    <View style={styles.warningCard}>
      <View style={styles.redBar} />

      <View style={styles.warningIcon}>
        <Ionicons name="warning-outline" size={RF(22)} color={RED} />
      </View>

      <View style={styles.warningMiddle}>
        <Text
          style={styles.warningTitle}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {item.title}
        </Text>
        <Text style={styles.warningDesc} numberOfLines={1} ellipsizeMode="tail">
          {item.desc}
        </Text>

        <View style={styles.tag}>
          <Text style={styles.tagText}>{item.tag}</Text>
        </View>
      </View>

      <View style={styles.warningRight}>
        <Text style={styles.date}>{item.date}</Text>
        <Text style={styles.time}>{item.time}</Text>

        {/* <Ionicons
          name="chevron-down"
          size={RF(17)}
          color={RED}
          style={styles.downIcon}
        /> */}
      </View>
    </View>
  );
};

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
    color: "#1f2937",
    fontSize: RF(20),
    fontWeight: "900",
    fontFamily: Typography?.bold,
    marginLeft: wp(3),
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(3.5),
  },
  headerActionsRight: {
    marginLeft: "auto",
  },
  headerDropdown: {
    marginHorizontal: wp(3.2),
    marginTop: hp(1),
    marginBottom: 0,
  },
  list: {
    backgroundColor: "#fff",
    paddingHorizontal: wp(3.2),
    paddingTop: hp(2),
    paddingBottom: hp(3),
    minHeight: hp(92),
  },
  topCard: {
    minHeight: hp(12),
    borderWidth: 1,
    borderColor: "#ffe1cc",
    borderRadius: wp(3),
    backgroundColor: "#fff8f3",
    flexDirection: "row",
    alignItems: "center",
    padding: wp(3.2),
    marginBottom: hp(2),
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  shieldCircle: {
    width: wp(16),
    height: wp(16),
    borderRadius: wp(8),
    backgroundColor: "#ffe8e8",
    alignItems: "center",
    justifyContent: "center",
    marginRight: wp(4),
  },
  alertInside: {
    position: "absolute",
  },
  topTitle: {
    fontSize: RF(12),
    color: "#111827",
    fontWeight: "900",
    lineHeight: hp(2.1),
    fontFamily: Typography?.bold,
  },
  topSub: {
    fontSize: RF(9.5),
    color: "#4b5563",
    lineHeight: hp(1.9),
    marginTop: hp(0.7),
    fontWeight: "700",
    fontFamily: Typography?.bold,
  },
  clipboard: {
    fontSize: RF(28),
    marginLeft: wp(2),
  },
  sectionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: hp(1.4),
  },
  sectionTitle: {
    fontSize: RF(15),
    color: "#111827",
    fontWeight: "900",
    fontFamily: Typography?.bold,
  },
  filterRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(1),
  },
  filterText: {
    color: RED,
    fontSize: RF(11),
    fontWeight: "900",
    fontFamily: Typography?.bold,
  },
  warningCard: {
    minHeight: hp(7.5),
    backgroundColor: "#fff",
    borderRadius: wp(3),
    borderWidth: 1,
    borderColor: "#f1f1f1",
    marginBottom: hp(1.2),
    paddingVertical: hp(0.8),
    paddingHorizontal: wp(3),
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  redBar: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: wp(1),
    backgroundColor: RED,
  },
  warningIcon: {
    width: wp(10),
    height: wp(10),
    borderRadius: wp(5),
    backgroundColor: "#ffe8e8",
    alignItems: "center",
    justifyContent: "center",
    marginRight: wp(3),
  },
  warningMiddle: {
    flex: 1,
  },
  warningTitle: {
    fontSize: RF(16),
    color: "#111827",
    fontWeight: "900",
    fontFamily: Typography?.bold,
  },
  warningDesc: {
    fontSize: RF(9.5),
    color: "#4b5563",
    lineHeight: hp(1.6),
    marginTop: hp(0.2),
    fontWeight: "700",
    fontFamily: Typography?.bold,
  },

  tag: {
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: RED,
    borderRadius: wp(2),
    paddingHorizontal: wp(2.5),
    paddingVertical: hp(0.6),
    marginTop: hp(0.6),
    backgroundColor: "#fff",
  },
  tagText: {
    color: RED,
    fontSize: RF(9.5),
    fontWeight: "900",
    fontFamily: Typography?.bold,
  },
  warningRight: {
    alignItems: "flex-end",
    justifyContent: "center",
    marginLeft: wp(2),
  },
  date: {
    fontSize: RF(9.5),
    color: "#111827",
    fontWeight: "700",
    fontFamily: Typography?.bold,
  },
  time: {
    fontSize: RF(9.5),
    color: "#111827",
    marginTop: hp(0.5),
    fontWeight: "700",
    fontFamily: Typography?.bold,
  },
  downIcon: {
    marginTop: hp(0.8),
  },
  importantCard: {
    minHeight: hp(9),
    borderWidth: 1,
    borderColor: "#d8f3df",
    borderRadius: wp(3),
    backgroundColor: "#f2fff5",
    padding: wp(3.2),
    marginTop: hp(1),
    marginBottom: hp(2),
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  infoCircle: {
    width: wp(10),
    height: wp(10),
    borderRadius: wp(5),
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: GREEN,
    alignItems: "center",
    justifyContent: "center",
    marginRight: wp(3),
  },
  importantTitle: {
    fontSize: RF(12),
    color: GREEN,
    fontWeight: "900",
    fontFamily: Typography?.bold,
  },
  importantText: {
    fontSize: RF(9.5),
    color: "#1f2937",
    lineHeight: hp(1.8),
    marginTop: hp(0.4),
    fontWeight: "700",
    fontFamily: Typography?.bold,
  },
  greenShield: {
    fontSize: RF(28),
    marginLeft: wp(2),
  },
  helpCard: {
    minHeight: hp(4),
    borderWidth: 1,
    borderColor: "#ffe1cc",
    borderRadius: wp(3),
    backgroundColor: "#fff8f3",
    padding: wp(3.2),
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  helpIcon: {
    width: wp(10),
    height: wp(10),
    borderRadius: wp(5),
    backgroundColor: "#ffe8e8",
    alignItems: "center",
    justifyContent: "center",
    marginRight: wp(3),
  },
  helpTitle: {
    fontSize: RF(12),
    color: "#111827",
    fontWeight: "900",
    fontFamily: Typography?.bold,
  },
  helpText: {
    fontSize: RF(9.5),
    color: "#4b5563",
    lineHeight: hp(1.7),
    marginTop: hp(0.3),
    fontWeight: "700",
    fontFamily: Typography?.bold,
  },
  supportBtn: {
    height: hp(4.3),
    borderWidth: 1,
    borderColor: RED,
    borderRadius: wp(2),
    paddingHorizontal: wp(2.5),
    alignItems: "center",
    justifyContent: "center",
    marginLeft: wp(2),
  },
  supportText: {
    color: RED,
    fontSize: RF(10),
    fontWeight: "900",
    fontFamily: Typography?.bold,
  },
});
