import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Platform,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import Colors from "../../constants/Colors";
import { resolveImageUri } from "../../config/api";
import { RF, hp, wp } from "../../utils/responsive";
import BookingCard from "../../components/bookings/BookingCard";
import BookingDetailsSheet from "../../components/bookings/BookingDetailsSheet";
import { useGetConsultationHistoryQuery } from "../../redux/consultationApi";
import { useGetAstrologersQuery } from "../../redux/AstroApi";

const ORANGE = "#ff6a00";

const FILTER_TABS = [
  { id: "all", label: "All", icon: "grid-outline" },
  { id: "call", label: "Calls 📞", icon: "call-outline" },
  { id: "chat", label: "Chats 💬", icon: "chatbubble-ellipses-outline" },
  { id: "pooja", label: "Poojas 🪔", icon: "flame-outline" },
];

export default function Bookings() {
  const [selectedTab, setSelectedTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [modalMode, setModalMode] = useState("details"); // "details" | "rate"
  const [sheetVisible, setSheetVisible] = useState(false);

  // Fetch Consultation History from Backend
  const { data: historyData, isLoading, refetch, isFetching } = useGetConsultationHistoryQuery(
    { page: 1, limit: 50 },
    { pollingInterval: 8000 },
  );

  // Fetch Top Astrologers for Empty State Carousel
  const { data: astrologersData } = useGetAstrologersQuery({ page: 1, limit: 6 });
  const topAstrologers = astrologersData?.data?.users || [];

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
      const type = (item?.type || item?.consultationType || "call").toLowerCase();
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
        tabMatch = type === "call" || type === "video_call" || type === "voice_call";
      } else if (selectedTab === "chat") {
        tabMatch = type === "chat";
      } else if (selectedTab === "pooja") {
        tabMatch = type === "pooja" || type === "service";
      }

      const q = searchQuery.toLowerCase().trim();
      const searchMatch = !q || name.includes(q) || problem.includes(q) || bookingId.includes(q);

      return tabMatch && searchMatch;
    });
  }, [bookingsList, selectedTab, searchQuery]);

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
          <Text style={styles.headerSubtitle}>History of consultations & services</Text>
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
              pathname: type === "chat" ? "/ChatConsultation" : "/CallConsultation",
              params: { consultationId: activeSession.id || activeSession.consultationId },
            });
          }}
          activeOpacity={0.9}
        >
          <View style={styles.activeAlertIconWrap}>
            <Ionicons name="radio-button-on" size={RF(18)} color="#fff" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.activeAlertTitle}>Consultation Session In Progress</Text>
            <Text style={styles.activeAlertSub}>Tap to return to live session</Text>
          </View>
          <Ionicons name="chevron-forward" size={RF(18)} color="#fff" />
        </TouchableOpacity>
      )}

      {/* Search Input */}
      <View style={styles.searchWrap}>
        <Ionicons name="search" size={RF(18)} color="#999" style={styles.searchIcon} />
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
            <Text style={[styles.statsNum, { color: "#2E7D32" }]}>₹{statsMetrics.totalSpent}</Text>
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
              <Text style={[styles.tabChipText, isActive && styles.tabChipTextActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Bookings List */}
      <FlatList
        data={filteredBookings}
        keyExtractor={(item) => String(item.id || item.consultationId || Math.random())}
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
                <Ionicons name="calendar-outline" size={RF(36)} color={ORANGE} />
              </View>
              <Text style={styles.emptyTitle}>No Bookings Found</Text>
              <Text style={styles.emptySub}>
                {searchQuery
                  ? "No consultations matched your search filter."
                  : "You haven't booked any consultations yet. Connect with verified astrologers below!"}
              </Text>

              {/* Recommended Top Astrologers Carousel */}
              {topAstrologers.length > 0 && (
                <View style={styles.recommendedSection}>
                  <Text style={styles.recommendedTitle}>Recommended Astrologers</Text>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.recommendedScroll}
                  >
                    {topAstrologers.map((astro) => {
                      const imageSource = astro?.profilePic
                        ? resolveImageUri(astro.profilePic)
                        : require("../../assets/images/background.png");

                      return (
                        <TouchableOpacity
                          key={astro.id}
                          style={styles.astroCard}
                          onPress={() =>
                            router.push({
                              pathname: "/astrodetail",
                              params: { id: astro.id, astrologerData: JSON.stringify(astro) },
                            })
                          }
                          activeOpacity={0.85}
                        >
                          <Image source={imageSource} style={styles.astroAvatar} />
                          <Text style={styles.astroName} numberOfLines={1}>
                            {astro.name || "Astrologer"}
                          </Text>
                          <Text style={styles.astroExp} numberOfLines={1}>
                            {astro?.expertises?.[0]?.name || "Vedic Astrology"}
                          </Text>
                          <View style={styles.astroPriceBadge}>
                            <Text style={styles.astroPriceText}>
                              ₹{astro?.callPrice || astro?.chatPrice || 25}/min
                            </Text>
                          </View>
                          <View style={styles.astroConnectBtn}>
                            <Text style={styles.astroConnectText}>Connect</Text>
                          </View>
                        </TouchableOpacity>
                      );
                    })}
                  </ScrollView>
                </View>
              )}

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
    marginTop: hp(0.6),
    lineHeight: RF(17),
    marginBottom: hp(2),
    paddingHorizontal: wp(6),
  },
  recommendedSection: {
    width: "100%",
    marginVertical: hp(1.5),
  },
  recommendedTitle: {
    fontSize: RF(13.5),
    fontWeight: "700",
    color: "#222",
    marginBottom: hp(1.2),
    paddingLeft: wp(2),
  },
  recommendedScroll: {
    gap: wp(3),
    paddingHorizontal: wp(2),
  },
  astroCard: {
    width: wp(34),
    backgroundColor: "#fff",
    borderRadius: wp(3.5),
    padding: wp(3),
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#EAEAEA",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  astroAvatar: {
    width: wp(14),
    height: wp(14),
    borderRadius: wp(7),
    backgroundColor: "#f0f0f0",
    marginBottom: hp(0.8),
  },
  astroName: {
    fontSize: RF(11.5),
    fontWeight: "700",
    color: "#222",
    textAlign: "center",
  },
  astroExp: {
    fontSize: RF(9.5),
    color: "#777",
    marginTop: hp(0.2),
    textAlign: "center",
  },
  astroPriceBadge: {
    backgroundColor: "#FFF8E1",
    paddingHorizontal: wp(2),
    paddingVertical: hp(0.3),
    borderRadius: wp(2),
    marginTop: hp(0.6),
  },
  astroPriceText: {
    fontSize: RF(10),
    fontWeight: "700",
    color: "#E65100",
  },
  astroConnectBtn: {
    backgroundColor: ORANGE,
    width: "100%",
    paddingVertical: hp(0.7),
    borderRadius: wp(2),
    marginTop: hp(1),
    alignItems: "center",
  },
  astroConnectText: {
    color: "#fff",
    fontSize: RF(10.5),
    fontWeight: "700",
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
  emptyCtaBtn: {
    backgroundColor: ORANGE,
    paddingHorizontal: wp(6),
    paddingVertical: hp(1.3),
    borderRadius: wp(3),
    marginTop: hp(1),
  },
});