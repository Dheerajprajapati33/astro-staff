import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { resolveImageUri } from "../../config/api";
import Typography from "../../constants/Typography";
import { hp, RF, wp } from "../../utils/responsive";

import { useGetFollowersQuery } from "../../redux/FollowerApi";

const ORANGE = "#ff6a00";
const GREEN = "#16a34a";

export default function Followers() {
  const [showInfo, setShowInfo] = useState(false);

  const {
    data,

    isLoading,

    refetch,
  } = useGetFollowersQuery();

  const followers = data?.followers || [];

  const totalFollowers = data?.totalFollowers || 0;

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={RF(24)} color={ORANGE} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>My Followers</Text>

        <View style={styles.headerActions}>
          <TouchableOpacity>
            <Ionicons name="person-add-outline" size={RF(22)} color={ORANGE} />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setShowInfo((prev) => !prev)}>
            <Ionicons name="help-circle-outline" size={RF(26)} color={ORANGE} />
          </TouchableOpacity>
        </View>
      </View>

      {showInfo && (
        <View style={styles.infoDropdown}>
          <View style={styles.infoDropdownIcon}>
            <Ionicons name="people-outline" size={RF(20)} color={ORANGE} />
          </View>
          <Text style={styles.infoDropdownText}>
            People who follow you and stay updated{"\n"}with your availability.
          </Text>
        </View>
      )}

      <View style={styles.content}>
        <View style={styles.searchRow}>
          <View style={styles.searchBox}>
            <Ionicons name="search-outline" size={RF(17)} color="#9ca3af" />

            <TextInput
              placeholder="Search followers"
              placeholderTextColor="#9ca3af"
              style={styles.searchInput}
            />
          </View>

          {/* <TouchableOpacity style={styles.filterBtn}>
            <Ionicons name="filter-outline" size={RF(16)} color={ORANGE} />

            <Text style={styles.filterText}>Filter</Text>
          </TouchableOpacity> */}
        </View>

        <View style={styles.statsCard}>
          <View style={styles.groupIcon}>
            <Ionicons name="people" size={RF(25)} color={GREEN} />
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.statsLabel}>Total Followers</Text>

            <Text style={styles.statsNumber}>{totalFollowers}</Text>
          </View>

          <View style={styles.weekRow}>
            <Ionicons name="people-outline" size={RF(14)} color={GREEN} />

            <Text style={styles.weekText}>All followers</Text>
          </View>
        </View>

        <FlatList
          data={followers}
          keyExtractor={(item) => item.id.toString()}
          refreshControl={
            <RefreshControl refreshing={isLoading} onRefresh={refetch} />
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => <FollowerItem item={item} />}
          ListEmptyComponent={
            <View style={styles.emptyBox}>
              <Ionicons name="people-outline" size={RF(40)} color="#9ca3af" />

              <Text style={styles.emptyText}>No followers yet</Text>

              <Text style={styles.emptySub}>
                When users follow you, they will appear here.
              </Text>
            </View>
          }
          ListFooterComponent={
            followers.length > 0 ? (
              <View style={styles.footer}>
                <Ionicons name="people" size={RF(20)} color={ORANGE} />

                <Text style={styles.footerTitle}>
                  That’s all your followers!
                </Text>

                <Text style={styles.footerSub}>
                  We’ll notify you when you get new followers.
                </Text>
              </View>
            ) : null
          }
        />
      </View>
    </SafeAreaView>
  );
}
const FollowerItem = ({ item }) => {
  return (
    <TouchableOpacity activeOpacity={0.85} style={styles.followerCard}>
      <View style={styles.imageBox}>
        <Image
          source={resolveImageUri(item?.profilePic) || require("../../assets/images/banner.png")}
          style={styles.avatar}
        />

        <View style={styles.onlineDot} />
      </View>

      <View style={styles.middle}>
        <Text style={styles.name}>{item?.name || "Unknown User"}</Text>

        <View style={styles.infoRow}>
          <Ionicons name="location-outline" size={RF(11)} color="#607086" />

          <Text style={styles.infoText}>{item?.city || "India"}</Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="calendar-outline" size={RF(11)} color="#607086" />

          <Text style={styles.infoText}>
            {item?.createdAt
              ? new Date(item.createdAt).toLocaleDateString()
              : "Recently joined"}
          </Text>
        </View>
      </View>

      <TouchableOpacity style={styles.messageBtn}>
        <Ionicons name="chatbubble-outline" size={RF(12)} color={ORANGE} />

        <Text style={styles.messageText}>Message</Text>
      </TouchableOpacity>

      <TouchableOpacity>
        <Ionicons name="ellipsis-vertical" size={RF(17)} color="#607086" />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#fff",
  },

  header: {
    height: hp(6.5),
    backgroundColor: "#fff",
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
    marginLeft: "auto",
  },

  infoDropdown: {
    marginHorizontal: wp(4),
    marginTop: hp(1),
    marginBottom: hp(0.5),
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

  infoDropdownIcon: {
    width: wp(9),
    height: wp(9),
    borderRadius: wp(4.5),
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginRight: wp(3),
  },

  infoDropdownText: {
    flex: 1,
    fontSize: RF(10.5),
    color: "#4b5563",
    lineHeight: hp(1.9),
    fontWeight: "700",
    fontFamily: Typography?.bold,
  },

  content: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: wp(3.2),
    paddingTop: hp(1.5),
  },

  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hp(1.5),
  },

  searchBox: {
    flex: 1,
    height: hp(5),
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: wp(2),
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: wp(3),
    marginRight: wp(2),
    backgroundColor: "#fff",
  },

  searchInput: {
    flex: 1,
    fontSize: RF(14),
    color: "#111827",
    marginLeft: wp(2),
    fontWeight: "700",
    fontFamily: Typography?.bold,
  },

  filterBtn: {
    height: hp(5),
    borderWidth: 1,
    borderColor: ORANGE,
    borderRadius: wp(2),
    paddingHorizontal: wp(2.5),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: wp(1),
  },

  filterText: {
    color: ORANGE,
    fontSize: RF(11),
    fontWeight: "800",
    fontFamily: Typography?.bold,
  },

  statsCard: {
    minHeight: hp(9),
    borderWidth: 1,
    borderColor: "#ffe1cc",
    borderRadius: wp(3),
    backgroundColor: "#fffaf5",
    flexDirection: "row",
    alignItems: "center",
    padding: wp(3.2),
    marginBottom: hp(1.5),
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },

  groupIcon: {
    width: wp(13),
    height: wp(13),
    borderRadius: wp(6.5),
    backgroundColor: "#eaffef",
    alignItems: "center",
    justifyContent: "center",
    marginRight: wp(4),
  },

  statsLabel: {
    fontSize: RF(16),
    color: "#374151",
    fontWeight: "700",
    fontFamily: Typography?.bold,
  },

  statsNumber: {
    fontSize: RF(20),
    color: "#111827",
    fontWeight: "900",
    marginTop: hp(0.2),
    fontFamily: Typography?.bold,
  },

  weekRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  weekText: {
    fontSize: RF(14),
    color: "#374151",
    marginLeft: wp(1),
    fontWeight: "700",
    fontFamily: Typography?.bold,
  },

  list: {
    paddingBottom: hp(3),
  },

  followerCard: {
    minHeight: hp(9),
    borderWidth: 1,
    borderColor: "#f2f2f2",
    borderRadius: wp(4),
    flexDirection: "row",
    alignItems: "center",
    padding: wp(2.8),
    marginBottom: hp(1.2),
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },

  imageBox: {
    width: wp(13),
    height: wp(13),
    borderRadius: wp(6.5),
    marginRight: wp(3),
  },

  avatar: {
    width: "100%",
    height: "100%",
    borderRadius: wp(6.5),
  },

  onlineDot: {
    position: "absolute",
    right: 0,
    bottom: 0,
    width: wp(3),
    height: wp(3),
    borderRadius: wp(1.5),
    backgroundColor: GREEN,
    borderWidth: 1.5,
    borderColor: "#fff",
  },

  middle: {
    flex: 1,
  },

  name: {
    fontSize: RF(13),
    color: "#111827",
    fontWeight: "900",
    fontFamily: Typography?.bold,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: hp(0.35),
  },

  infoText: {
    marginLeft: wp(1),
    color: "#607086",
    fontSize: RF(9.5),
    fontWeight: "700",
    fontFamily: Typography?.bold,
  },

  messageBtn: {
    height: hp(4.5),
    borderWidth: 1,
    borderColor: ORANGE,
    borderRadius: wp(1.5),
    paddingHorizontal: wp(2),
    flexDirection: "row",
    alignItems: "center",
    marginRight: wp(2),
  },

  messageText: {
    color: ORANGE,
    fontSize: RF(11),
    fontWeight: "800",
    marginLeft: wp(1),
    fontFamily: Typography?.bold,
  },

  footer: {
    alignItems: "center",
    paddingTop: hp(2),
    paddingBottom: hp(3),
  },

  footerTitle: {
    marginTop: hp(0.7),
    color: "#111827",
    fontSize: RF(14),
    fontWeight: "900",
    fontFamily: Typography?.bold,
  },

  footerSub: {
    marginTop: hp(0.3),
    color: "#607086",
    fontSize: RF(12),
    fontWeight: "700",
    fontFamily: Typography?.bold,
  },

  emptyBox: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: hp(5),
  },

  emptyText: {
    marginTop: hp(1),
    fontSize: RF(14),
    color: "#111827",
    fontWeight: "900",
    fontFamily: Typography?.bold,
  },

  emptySub: {
    marginTop: hp(0.5),
    fontSize: RF(12),
    color: "#607086",
    textAlign: "center",
    fontWeight: "700",
    fontFamily: Typography?.bold,
  },
});
