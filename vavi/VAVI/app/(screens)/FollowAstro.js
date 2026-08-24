import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { resolveImageUri } from "../../config/api";
import Colors from "../../constants/Colors";
import { hp, RF, wp } from "../../utils/responsive";

import {
  useFollowAstrologerMutation,
  useGetFollowingQuery,
} from "../../redux/followerApi";

export default function FollowedAstro() {
  const [selectedTab, setSelectedTab] = useState("following");
  const [search, setSearch] = useState("");

  // Fetch all followed astrologers
  const { data, isLoading, refetch } = useGetFollowingQuery({
    page: 1,
    limit: 50,
  });
  const followingList = data?.data?.following || [];

  // Filter based on search
  const filteredData = followingList.filter((item) =>
    item.astrologerUser?.name.toLowerCase().includes(search.toLowerCase()),
  );

  const [followAstro] = useFollowAstrologerMutation();

  const handleFollowToggle = async (astrologerId, index) => {
    try {
      const response = await followAstro(astrologerId).unwrap();
      filteredData[index].following = response.data.following;
    } catch (err) {
      console.log("Follow toggle error:", err);
    }
  };

  const renderItem = ({ item, index }) => {
    const astro = item.astrologerUser;
    const isFollowing = item.following;
    const isOnline = astro.isOnline || astro.isChatOnline || astro.isCallOnline;

    return (
      <TouchableOpacity
        activeOpacity={0.9}
        style={styles.card}
        onPress={() =>
          router.push({
            pathname: "/astrodetail",
            params: {
              id: item.astrologerUser.id,
              astrologerData: JSON.stringify(item),
            },
          })
        }
      >
        {/* Left Profile */}
        <View style={styles.leftSection}>
          <View style={styles.imageWrapper}>
            <Image
              source={resolveImageUri(astro?.profilePic) || require("../../assets/images/placeholder.jpeg")}
              style={styles.image}
              resizeMode="cover"
            />
            <View
              style={[
                styles.statusDot,
                { backgroundColor: isOnline ? "#27AE60" : "#CFCFCF" },
              ]}
            />
          </View>

          <View style={styles.info}>
            <View style={styles.nameRow}>
              <Text style={styles.name}>{astro.name}</Text>
              {astro.verified && (
                <Ionicons
                  name="checkmark-circle"
                  size={RF(15)}
                  color="#F59E0B"
                  style={{ marginLeft: wp(1) }}
                />
              )}
            </View>

            <View style={styles.ratingRow}>
              <Ionicons name="star" size={RF(13)} color="#FDBA12" />
              <Text style={styles.rating}>{astro.rating}</Text>
              <Text style={styles.review}>
                ({astro.totalReviews || 0} reviews)
              </Text>
            </View>

            <Text style={styles.speciality}>
              {astro.expertises?.map((e) => e.name).join(", ")} |{" "}
              {astro.experience}
            </Text>

            <View
              style={[
                styles.statusBadge,
                { backgroundColor: isOnline ? "#EAF9EF" : "#F2F2F2" },
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  { color: isOnline ? "#2E7D32" : "#8C8C8C" },
                ]}
              >
                {isOnline ? "Online" : "Offline"}
              </Text>
            </View>
          </View>
        </View>

        {/* Follow/Unfollow Button */}
        <TouchableOpacity
          activeOpacity={0.8}
          style={[
            styles.followButton,
            { backgroundColor: isFollowing ? "#888" : Colors.primary },
          ]}
          onPress={() => handleFollowToggle(astro.id, index)}
        >
          <Text style={styles.followButtonText}>
            {isFollowing ? "Following" : "Follow"}
          </Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading followed astrologers...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity activeOpacity={0.8} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={RF(24)} color={Colors.darkBrown} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Following Astrologers</Text>
        <View style={{ width: RF(24) }} />
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={RF(20)} color="#999" />
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search astrologers..."
          placeholderTextColor="#999"
          style={styles.searchInput}
        />
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          activeOpacity={0.8}
          style={[styles.tab, selectedTab === "following" && styles.activeTab]}
          onPress={() => setSelectedTab("following")}
        >
          <Ionicons
            name="person-outline"
            size={RF(16)}
            color={selectedTab === "following" ? Colors.primary : "#666"}
          />
          <Text
            style={[
              styles.tabText,
              selectedTab === "following" && styles.activeTabText,
            ]}
          >
            Following ({filteredData.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Astrologers List */}
      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF8F4" },
  centerContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: {
    marginTop: hp(1.5),
    color: Colors.textGray,
    fontSize: RF(14),
    fontWeight: "400",
  },
  header: {
    height: hp(7),
    paddingHorizontal: wp(5),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#F2F2F2",
  },
  headerTitle: {
    fontSize: RF(18),
    color: Colors.darkBrown,
    fontWeight: "600",
  },
  searchContainer: {
    marginHorizontal: wp(5),
    marginTop: hp(2),
    marginBottom: hp(2),
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    borderRadius: wp(4),
    paddingHorizontal: wp(4),
    height: hp(6.5),
    borderWidth: 1,
    borderColor: "#EFEFEF",
  },
  searchInput: {
    flex: 1,
    marginLeft: wp(2),
    fontSize: RF(14),
    color: Colors.darkBrown,
    fontWeight: "400",
  },
  tabContainer: {
    flexDirection: "row",
    marginHorizontal: wp(5),
    marginBottom: hp(2),
    backgroundColor: "#FFF2EA",
    borderRadius: wp(4),
    padding: wp(1),
  },
  tab: {
    flex: 1,
    height: hp(5.5),
    borderRadius: wp(3),
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  activeTab: { backgroundColor: Colors.white, elevation: 2 },
  tabText: {
    marginLeft: wp(1),
    fontSize: RF(13),
    color: "#777",
    fontWeight: "500",
  },
  activeTabText: { color: Colors.primary, fontWeight: "600" },
  listContainer: { paddingHorizontal: wp(5), paddingBottom: hp(4) },
  card: {
    backgroundColor: Colors.white,
    borderRadius: wp(4),
    padding: wp(4),
    marginBottom: hp(2),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  leftSection: { flexDirection: "row", flex: 1 },
  imageWrapper: { position: "relative" },
  image: { width: wp(18), height: wp(18), borderRadius: wp(9) },
  statusDot: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: wp(3.5),
    height: wp(3.5),
    borderRadius: wp(2),
    borderWidth: 2,
    borderColor: Colors.white,
  },
  info: { flex: 1, marginLeft: wp(3), justifyContent: "center" },
  nameRow: { flexDirection: "row", alignItems: "center" },
  name: {
    fontSize: RF(15),
    color: Colors.darkBrown,
    fontWeight: "600",
  },
  ratingRow: { flexDirection: "row", alignItems: "center", marginTop: hp(0.5) },
  rating: {
    marginLeft: wp(1),
    fontSize: RF(12),
    color: Colors.darkBrown,
    fontWeight: "500",
  },
  review: {
    marginLeft: wp(1),
    fontSize: RF(11),
    color: "#888",
    fontWeight: "400",
  },
  speciality: {
    marginTop: hp(0.6),
    fontSize: RF(12),
    color: "#666",
    fontWeight: "400",
  },
  statusBadge: {
    alignSelf: "flex-start",
    marginTop: hp(1),
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.5),
    borderRadius: wp(5),
  },
  statusText: { fontSize: RF(11), fontWeight: "500" },
  followButton: {
    marginLeft: wp(3),
    borderWidth: 1.5,
    borderColor: Colors.primary,
    paddingHorizontal: wp(5),
    height: hp(4.8),
    borderRadius: wp(3),
    justifyContent: "center",
    alignItems: "center",
  },
  followButtonText: {
    color: Colors.white,
    fontSize: RF(13),
    fontWeight: "600",
  },
});
