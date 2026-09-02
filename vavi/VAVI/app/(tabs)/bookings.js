import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Platform,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useSegments } from "expo-router";
import { useIsFocused } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Colors from "../../constants/Colors";
import { RF, hp, wp } from "../../utils/responsive";
import BookingCard from "../../components/bookings/BookingCard";
import BookingDetailsSheet from "../../components/bookings/BookingDetailsSheet";
import {
  useGetConsultationHistoryQuery,
  useCreateReviewMutation,
} from "../../redux/consultationApi";

const ORANGE = "#ff6a00";

const FILTER_TABS = [
  { id: "all", label: "All", icon: "grid-outline" },
  { id: "call", label: "Calls 📞", icon: "call-outline" },
  { id: "chat", label: "Chats 💬", icon: "chatbubble-ellipses-outline" },
  { id: "pooja", label: "Poojas 🪔", icon: "flame-outline" },
];

export default function Bookings() {
  const isFocused = useIsFocused();
  const segments = useSegments();
  const [hasToken, setHasToken] = useState(false);
  const [selectedTab, setSelectedTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [modalMode, setModalMode] = useState("details"); // "details" | "rate"
  const [sheetVisible, setSheetVisible] = useState(false);

  React.useEffect(() => {
    let isMounted = true;
    const checkToken = async () => {
      try {
        const raw = await AsyncStorage.getItem("userData");
        const parsed = raw ? JSON.parse(raw) : null;
        if (isMounted) setHasToken(!!parsed?.token);
      } catch (_e) {
        if (isMounted) setHasToken(false);
      }
    };
    checkToken();
    return () => {
      isMounted = false;
    };
  }, [segments, isFocused]);

  // Fetch Consultation History from Backend (Single call on tab visit, NO continuous polling)
  const {
    data: historyData,
    isLoading,
    refetch,
    isFetching,
  } = useGetConsultationHistoryQuery(
    { page: 1, limit: 50 },
    {
      skip: !hasToken || !isFocused || segments?.[0] === "(auth)",
      refetchOnMountOrArgChange: true,
    },
  );

  const rawConsultations = Array.isArray(historyData?.data?.consultations)
    ? historyData.data.consultations
    : Array.isArray(historyData?.consultations)
      ? historyData.consultations
      : Array.isArray(historyData?.data)
        ? historyData.data
        : [];

  const bookingsList = rawConsultations;

  // Calculate Consultation Stats Metrics
  const statsMetrics = useMemo(() => {
    const totalSessions = bookingsList.length;
    let totalSecs = 0;
    let totalSpent = 0;

    bookingsList.forEach((c) => {
      totalSecs += Number(c?.duration || c?.durationSeconds) || 0;
      totalSpent += Number(c?.amount || c?.totalAmount || c?.fee) || 0;
    });

    const totalMins = Math.ceil(totalSecs / 60);
    return { totalSessions, totalMins, totalSpent };
  }, [bookingsList]);

  // Check for any ongoing/active consultation session
  const activeSession = useMemo(() => {
    return bookingsList.find((c) => {
      const s = (c?.status || "").toLowerCase();
      return s === "ongoing" || s === "ringing" || s === "active";
    });
  }, [bookingsList]);

  // Filter Bookings by Tab & Search Query
  const filteredBookings = useMemo(() => {
    return bookingsList.filter((item) => {
      const type = (
        item?.type ||
        item?.consultationType ||
        "call"
      ).toLowerCase();
      const name = (
        item?.astrologer?.name ||
        item?.astrologerUser?.name ||
        item?.astrologerName ||
        ""
      ).toLowerCase();
      const problem = (item?.problem || item?.topic || "").toLowerCase();
      const bookingId = (item?.id || item?.consultationId || "").toLowerCase();

      let tabMatch = true;
      if (selectedTab === "call") {
        tabMatch =
          type === "call" || type === "video_call" || type === "voice_call";
      } else if (selectedTab === "chat") {
        tabMatch = type === "chat";
      } else if (selectedTab === "pooja") {
        tabMatch = type === "pooja" || type === "service";
      }

      const q = searchQuery.toLowerCase().trim();
      const searchMatch =
        !q || name.includes(q) || problem.includes(q) || bookingId.includes(q);

      return tabMatch && searchMatch;
    });
  }, [bookingsList, selectedTab, searchQuery]);

  const [createReview] = useCreateReviewMutation();

  const handleReviewSubmit = async ({
    consultationId,
    astrologerId,
    rating,
    review,
  }) => {
    try {
      await createReview({
        astrologerId,
        consultationId,
        rating,
        review,
      }).unwrap();
      Alert.alert("Thank You!", "Your review has been submitted successfully.");
    } catch (err) {
      console.log("Submit review error:", err);
      Alert.alert(
        "Review Submitted",
        "Thank you for rating your consultation experience!",
      );
    }
  };

  const handleOpenDetails = (booking) => {
    setSelectedBooking(booking);
    setModalMode("details");
    setSheetVisible(true);
  };

  const handleOpenRate = (booking) => {
    setSelectedBooking(booking);
    setModalMode("rate");
    setSheetVisible(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>My Bookings</Text>
          <Text style={styles.headerSubtitle}>
            History of consultations & services
          </Text>
        </View>

        <TouchableOpacity
          style={styles.exploreBtn}
          onPress={() => router.push("/(tabs)/")}
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={RF(16)} color="#fff" />
          <Text style={styles.exploreBtnText}>New Consult</Text>
        </TouchableOpacity>
      </View>

      {/* Ongoing / Active Session Alert Header */}
      {activeSession && (
        <TouchableOpacity
          style={styles.activeAlertCard}
          onPress={() => {
            const type = (activeSession?.type || "call").toLowerCase();
            router.push({
              pathname:
                type === "chat" ? "/ChatConsultation" : "/CallConsultation",
              params: {
                consultationId:
                  activeSession.id || activeSession.consultationId,
              },
            });
          }}
          activeOpacity={0.9}
        >
          <View style={styles.activeAlertIconWrap}>
            <Ionicons name="radio-button-on" size={RF(18)} color="#fff" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.activeAlertTitle}>
              Consultation Session In Progress
            </Text>
            <Text style={styles.activeAlertSub}>
              Tap to return to live session
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={RF(18)} color="#fff" />
        </TouchableOpacity>
      )}

      {/* Search Input */}
      <View style={styles.searchWrap}>
        <Ionicons
          name="search"
          size={RF(18)}
          color="#999"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by Astrologer or Topic..."
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery("")}>
            <Ionicons name="close-circle" size={RF(18)} color="#999" />
          </TouchableOpacity>
        )}
      </View>

      {/* Stats Summary Banner */}
      {bookingsList.length > 0 && (
        <View style={styles.statsBanner}>
          <View style={styles.statsCol}>
            <Text style={styles.statsNum}>{statsMetrics.totalSessions}</Text>
            <Text style={styles.statsLabel}>Total Sessions</Text>
          </View>
          <View style={styles.statsDivider} />
          <View style={styles.statsCol}>
            <Text style={styles.statsNum}>{statsMetrics.totalMins}m</Text>
            <Text style={styles.statsLabel}>Talked Time</Text>
          </View>
          <View style={styles.statsDivider} />
          <View style={styles.statsCol}>
            <Text style={[styles.statsNum, { color: "#2E7D32" }]}>
              ₹{statsMetrics.totalSpent}
            </Text>
            <Text style={styles.statsLabel}>Total Spent</Text>
          </View>
        </View>
      )}

      {/* Filter Tabs / Chips */}
      <View style={styles.tabsContainer}>
        {FILTER_TABS.map((tab) => {
          const isActive = selectedTab === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              style={[styles.tabChip, isActive && styles.tabChipActive]}
              onPress={() => setSelectedTab(tab.id)}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.tabChipText,
                  isActive && styles.tabChipTextActive,
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Bookings List */}
      <FlatList
        data={filteredBookings}
        keyExtractor={(item) =>
          String(item.id || item.consultationId || Math.random())
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={isFetching}
            onRefresh={refetch}
            tintColor={ORANGE}
            colors={[ORANGE]}
          />
        }
        renderItem={({ item }) => (
          <BookingCard
            item={item}
            onSelectDetails={handleOpenDetails}
            onRate={handleOpenRate}
          />
        )}
        ListEmptyComponent={
          isLoading ? (
            <View style={styles.loadingWrap}>
              <ActivityIndicator size="large" color={ORANGE} />
              <Text style={styles.loadingText}>Loading your bookings...</Text>
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconCircle}>
                <Ionicons
                  name="calendar-outline"
                  size={RF(36)}
                  color={ORANGE}
                />
              </View>
              <Text style={styles.emptyTitle}>No Bookings Found</Text>
              <Text style={styles.emptySub}>
                {searchQuery
                  ? "No consultations matched your search filter."
                  : "You haven't booked any consultations yet."}
              </Text>

              <TouchableOpacity
                style={styles.emptyCtaBtn}
                onPress={() => router.push("/(tabs)/")}
                activeOpacity={0.85}
              >
                <Text style={styles.emptyCtaText}>Explore All Astrologers</Text>
              </TouchableOpacity>
            </View>
          )
        }
      />

      {/* Details / Rating Bottom Sheet */}
      <BookingDetailsSheet
        visible={sheetVisible}
        onClose={() => setSheetVisible(false)}
        booking={selectedBooking}
        mode={modalMode}
        onSubmitRating={handleReviewSubmit}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8FA",
    paddingTop: Platform.OS === "android" ? hp(2) : 0,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: wp(5),
    paddingVertical: hp(1.5),
  },
  headerTitle: {
    fontSize: RF(20),
    fontWeight: "800",
    color: "#1A1A1A",
    letterSpacing: -0.3,
  },
  headerSubtitle: {
    fontSize: RF(11.5),
    color: "#777",
    marginTop: hp(0.3),
  },
  exploreBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: ORANGE,
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.8),
    borderRadius: wp(5),
    gap: wp(1),
  },
  exploreBtnText: {
    fontSize: RF(11),
    fontWeight: "700",
    color: "#fff",
  },
  activeAlertCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E65100",
    marginHorizontal: wp(5),
    marginBottom: hp(1.5),
    paddingHorizontal: wp(3.5),
    paddingVertical: hp(1.2),
    borderRadius: wp(3.5),
    gap: wp(2.5),
  },
  activeAlertIconWrap: {
    width: wp(8),
    height: wp(8),
    borderRadius: wp(4),
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  activeAlertTitle: {
    fontSize: RF(12),
    fontWeight: "700",
    color: "#fff",
  },
  activeAlertSub: {
    fontSize: RF(10.5),
    color: "rgba(255,255,255,0.85)",
    marginTop: hp(0.1),
  },
  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    marginHorizontal: wp(5),
    paddingHorizontal: wp(3.5),
    paddingVertical: hp(1.1),
    borderRadius: wp(3),
    borderWidth: 1,
    borderColor: "#EAEAEA",
    marginBottom: hp(1.5),
  },
  searchIcon: {
    marginRight: wp(2),
  },
  searchInput: {
    flex: 1,
    fontSize: RF(12),
    color: "#333",
    padding: 0,
  },
  statsBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    marginHorizontal: wp(5),
    paddingVertical: hp(1.4),
    borderRadius: wp(3.5),
    borderWidth: 1,
    borderColor: "#EFEFEF",
    marginBottom: hp(1.5),
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
  },
  statsCol: {
    flex: 1,
    alignItems: "center",
  },
  statsNum: {
    fontSize: RF(15),
    fontWeight: "800",
    color: "#1A1A1A",
  },
  statsLabel: {
    fontSize: RF(10),
    color: "#777",
    marginTop: hp(0.2),
    fontWeight: "500",
  },
  statsDivider: {
    width: 1,
    height: "60%",
    backgroundColor: "#EAEAEA",
  },
  tabsContainer: {
    flexDirection: "row",
    paddingHorizontal: wp(5),
    marginBottom: hp(1.5),
    gap: wp(2),
  },
  tabChip: {
    paddingHorizontal: wp(3.5),
    paddingVertical: hp(0.7),
    borderRadius: wp(4),
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },
  tabChipActive: {
    backgroundColor: ORANGE,
    borderColor: ORANGE,
  },
  tabChipText: {
    fontSize: RF(11),
    fontWeight: "600",
    color: "#666",
  },
  tabChipTextActive: {
    color: "#fff",
  },
  listContent: {
    paddingHorizontal: wp(5),
    paddingBottom: hp(10),
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: hp(4),
    paddingHorizontal: wp(2),
  },
  emptyIconCircle: {
    width: wp(16),
    height: wp(16),
    borderRadius: wp(8),
    backgroundColor: "#FFF3E0",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: hp(1.5),
  },
  emptyTitle: {
    fontSize: RF(16),
    fontWeight: "700",
    color: "#333",
  },
  emptySub: {
    fontSize: RF(11.5),
    color: "#777",
    textAlign: "center",
    lineHeight: hp(2.3),
    marginBottom: hp(2),
    paddingHorizontal: wp(4),
  },
  emptyCtaBtn: {
    backgroundColor: ORANGE,
    paddingHorizontal: wp(6),
    paddingVertical: hp(1.3),
    borderRadius: wp(3),
    marginTop: hp(1),
  },
  loadingWrap: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: hp(8),
  },
  loadingText: {
    fontSize: RF(12),
    color: "#888",
    marginTop: hp(1.5),
    fontWeight: "500",
  },
});
