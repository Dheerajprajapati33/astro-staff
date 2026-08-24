import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AstrologerCard from "../../components/home/AstrologerCard";
import CategoryTabs from "../../components/home/CategoryTabs";
import Header from "../../components/home/Header";
import SearchBar from "../../components/home/SearchBar";
import LiveAstrologersSection from "../../components/consult/LiveAstrologersSection";
import { useGetFollowingQuery } from "../../redux/followerApi";

import Colors from "../../constants/Colors";
import { useGetAstrologersQuery } from "../../redux/AstroApi";
import { hp, RF, wp } from "../../utils/responsive";

export default function Discover() {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const limit = 10;

  const { data, isLoading, isFetching, isError, error, refetch } =
    useGetAstrologersQuery({
      page,
      limit,
      role: "astrologer",
    });
  const { data: followingData } = useGetFollowingQuery({ page: 1, limit: 50 });
  const followingAstroIds =
    followingData?.data?.following?.map((f) => f.astrologerId) || [];
  const astrologers = data?.data?.users || [];
  const pagination = data?.data?.pagination;
  const hasMore = pagination ? astrologers.length < pagination.total : false;

  const filteredAstrologers = astrologers.filter((astrologer) => {
    const expertiseNames = Array.isArray(astrologer?.expertises)
      ? astrologer.expertises.map((expertise) => expertise?.name || "")
      : [];

    const matchesCategory =
      selectedCategory === "All" ||
      expertiseNames.some((name) =>
        name.toLowerCase().includes(selectedCategory.toLowerCase()),
      );

    const query = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !query ||
      (astrologer?.name || "").toLowerCase().includes(query) ||
      expertiseNames.some((name) => name.toLowerCase().includes(query));

    return matchesCategory && matchesSearch;
  });

  const handleLoadMore = () => {
    if (!isFetching && hasMore) {
      setPage((prev) => prev + 1);
    }
  };

  const handleRefresh = () => {
    if (page === 1) {
      refetch();
    } else {
      setPage(1);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.centerContainer} edges={["top"]}>
        <StatusBar barStyle="dark-content" />

        <ActivityIndicator size="large" color={Colors.primary} />

        <Text style={styles.loadingText}>Loading astrologers...</Text>
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView style={styles.centerContainer} edges={["top"]}>
        <StatusBar barStyle="dark-content" />

        <Ionicons
          name="alert-circle-outline"
          size={RF(45)}
          color={Colors.primary}
        />

        <Text style={styles.errorTitle}>Astrologers cant be loaded.</Text>

        <Text style={styles.errorMessage}>
          {/* {error?.data?.message ||
            error?.error ||
            "Please check your internet connection."} */}
          Check your internet connection
        </Text>

        <TouchableOpacity style={styles.retryButton} onPress={handleRefresh}>
          <Text style={styles.retryText}>Try Again</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar barStyle="dark-content" />

      <FlatList
        data={filteredAstrologers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <AstrologerCard
            key={item.id}
            item={{
              ...item,
              following: followingAstroIds.includes(item.id),
              updateFollowing: (newStatus) => {
                // optional: update local following list or trigger refetch
                console.log("Follow updated for", item.id, newStatus);
              },
            }}
          />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshing={isFetching && page === 1}
        onRefresh={handleRefresh}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListHeaderComponent={
          <>
            <Header />

            <SearchBar value={searchQuery} onChangeText={setSearchQuery} />

            <LiveAstrologersSection />

            <CategoryTabs
              selected={selectedCategory}
              onSelect={setSelectedCategory}
            />

            <View style={styles.listHeadingContainer}>
              <Text style={styles.listHeading}>Available Astrologers</Text>

              <Text style={styles.totalText}>
                {filteredAstrologers.length} astrologers
              </Text>
            </View>
          </>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="people-outline" size={RF(50)} color="#CCCCCC" />

            <Text style={styles.emptyTitle}>No astrologers found</Text>

            <Text style={styles.emptyMessage}>
              {searchQuery.trim() || selectedCategory !== "All"
                ? "Try a different search or category."
                : "No astrologers available as of now."}
            </Text>
          </View>
        }
        ListFooterComponent={
          <View>
            {/* <OfferBanner /> */}

            {isFetching ? (
              <ActivityIndicator
                style={styles.bottomLoader}
                size="small"
                color={Colors.primary}
              />
            ) : null}
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF8F4",
  },

  scrollContent: {
    paddingBottom: hp(2),
  },

  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: wp(8),
    backgroundColor: "#FFF8F4",
  },

  loadingText: {
    marginTop: hp(1.5),
    color: Colors.textGray,
    fontSize: RF(14),
    fontWeight: "400",
  },

  errorTitle: {
    marginTop: hp(1),
    color: Colors.darkBrown,
    fontSize: RF(17),
    fontWeight: "600",
  },

  errorMessage: {
    marginTop: hp(1),
    textAlign: "center",
    color: Colors.textGray,
    fontSize: RF(13),
    fontWeight: "400",
  },

  retryButton: {
    marginTop: hp(2),
    paddingHorizontal: wp(8),
    paddingVertical: hp(1.2),
    borderRadius: wp(3),
    backgroundColor: Colors.primary,
  },

  retryText: {
    color: "#FFFFFF",
    fontSize: RF(14),
    fontWeight: "600",
  },

  listHeadingContainer: {
    //marginTop: hp(2),
    marginBottom: hp(0.5),
    marginHorizontal: wp(4),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  listHeading: {
    color: Colors.darkBrown,
    fontSize: RF(16),
    fontWeight: "600",
  },

  totalText: {
    color: Colors.textGray,
    fontSize: RF(11),
    fontWeight: "400",
  },

  emptyContainer: {
    minHeight: hp(35),
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: wp(8),
  },

  emptyTitle: {
    marginTop: hp(1),
    color: Colors.darkBrown,
    fontSize: RF(16),
    fontWeight: "600",
  },

  emptyMessage: {
    marginTop: hp(0.5),
    textAlign: "center",
    color: Colors.textGray,
    fontSize: RF(12),
    fontWeight: "400",
  },

  bottomLoader: {
    marginVertical: hp(2),
  },
});
