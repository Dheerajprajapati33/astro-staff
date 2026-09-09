import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import Colors from "../../constants/Colors";
import { hp, RF, wp } from "../../utils/responsive";
import { useGetNotificationsQuery } from "../../redux/notificationApi";

const FILTER_TABS = [
  { id: "all", label: "All" },
  { id: "alert", label: "Alerts ⚠️" },
  { id: "offer", label: "Offers 🎁" },
  { id: "consultation", label: "Consultation 📞" },
  { id: "announcement", label: "Announcements 📢" },
];

const DEFAULT_SAMPLE_NOTIFICATIONS = [
  {
    id: "sample-1",
    type: "announcement",
    icon: "megaphone-outline",
    color: "#8E44AD",
    badge: "Announcement",
    title: "Welcome to Astro Guide!",
    desc: "Thank you for joining us. Get expert guidance anytime, anywhere.",
    time: "2m ago",
  },
  {
    id: "sample-2",
    type: "consultation",
    icon: "call-outline",
    color: "#27AE60",
    badge: "Consultation",
    title: "Call Scheduled",
    desc: "Your call with Astrologer Rajesh Sharma is scheduled at 7:00 PM today.",
    time: "15m ago",
  },
  {
    id: "sample-3",
    type: "wallet",
    icon: "wallet-outline",
    color: "#FF8A00",
    badge: "Wallet",
    title: "Wallet Recharge Successful",
    desc: "₹300 has been added to your wallet. New balance: ₹654.00",
    time: "1h ago",
  },
  {
    id: "sample-4",
    type: "offer",
    icon: "gift-outline",
    color: "#E67E22",
    badge: "Special Offer",
    title: "Special Offer For You!",
    desc: "Get 10% OFF on your next call. Use code: ASTRO10",
    time: "2h ago",
  },
  {
    id: "sample-5",
    type: "alert",
    icon: "alert-circle-outline",
    color: "#E74C3C",
    badge: "Alert",
    title: "Low Balance Alert",
    desc: "Your wallet balance is low. Recharge now to continue uninterrupted consultations.",
    time: "5h ago",
  },
  {
    id: "sample-6",
    type: "consultation",
    icon: "star-outline",
    color: "#FF8A00",
    badge: "Review",
    title: "Rate Your Astrologer",
    desc: "How was your experience with Astrologer Rajesh Sharma?",
    time: "1d ago",
  },
  {
    id: "sample-7",
    type: "announcement",
    icon: "information-circle-outline",
    color: "#2980B9",
    badge: "Update",
    title: "New Astrologers Available",
    desc: "Check out new verified astrologers and get answers to your questions.",
    time: "2d ago",
  },
];

const formatRelativeTime = (dateInput) => {
  if (!dateInput) return "Just now";
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return String(dateInput);

  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return "Just now";
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d ago`;

  return date.toLocaleDateString("en-IN", {
    month: "short",
    day: "numeric",
  });
};

const resolveNotificationMeta = (item) => {
  const type = String(item?.type || "").toLowerCase();
  const title = String(item?.title || "").toLowerCase();
  const message = String(item?.message || item?.desc || "").toLowerCase();

  if (
    type.includes("offer") ||
    title.includes("offer") ||
    title.includes("discount") ||
    message.includes("coupon")
  ) {
    return {
      category: "offer",
      icon: "gift-outline",
      color: "#27AE60",
      badge: "Offer",
      badgeBg: "rgba(39, 174, 96, 0.12)",
    };
  }

  if (
    type.includes("alert") ||
    type.includes("warn") ||
    title.includes("alert") ||
    title.includes("urgent") ||
    title.includes("low balance")
  ) {
    return {
      category: "alert",
      icon: "alert-circle-outline",
      color: "#E74C3C",
      badge: "Alert",
      badgeBg: "rgba(231, 76, 60, 0.12)",
    };
  }

  if (
    type.includes("consult") ||
    type.includes("call") ||
    type.includes("chat") ||
    type.includes("booking") ||
    title.includes("call") ||
    title.includes("chat") ||
    title.includes("consultation") ||
    title.includes("astrologer")
  ) {
    return {
      category: "consultation",
      icon: "call-outline",
      color: "#2980B9",
      badge: "Consultation",
      badgeBg: "rgba(41, 128, 185, 0.12)",
    };
  }

  if (
    type.includes("wallet") ||
    type.includes("recharge") ||
    type.includes("payment") ||
    title.includes("wallet") ||
    title.includes("recharge")
  ) {
    return {
      category: "wallet",
      icon: "wallet-outline",
      color: "#FF8A00",
      badge: "Wallet",
      badgeBg: "rgba(255, 138, 0, 0.12)",
    };
  }

  if (
    type.includes("announcement") ||
    type.includes("admin") ||
    type.includes("system") ||
    title.includes("welcome") ||
    title.includes("maintenance") ||
    title.includes("announcement")
  ) {
    return {
      category: "announcement",
      icon: "megaphone-outline",
      color: "#8E44AD",
      badge: "Announcement",
      badgeBg: "rgba(142, 68, 173, 0.12)",
    };
  }

  return {
    category: "general",
    icon: "notifications-outline",
    color: Colors.primary,
    badge: "Update",
    badgeBg: "rgba(255, 138, 0, 0.12)",
  };
};

export default function Notification() {
  const [selectedTab, setSelectedTab] = useState("all");
  const [page, setPage] = useState(1);

  // Redux API Query for GET /notifications/get?page=1&limit=10
  const {
    data: apiResponse,
    isLoading,
    isFetching,
    refetch,
  } = useGetNotificationsQuery({
    page,
    limit: 10,
  });

  const parsedNotifications = useMemo(() => {
    const rawList =
      apiResponse?.data?.notifications ||
      apiResponse?.notifications ||
      apiResponse?.data ||
      [];

    if (Array.isArray(rawList) && rawList.length > 0) {
      return rawList.map((item, index) => {
        const meta = resolveNotificationMeta(item);
        return {
          id: item._id || item.id || `notif-${index}`,
          rawType: item.type,
          category: meta.category,
          icon: item.icon || meta.icon,
          color: item.color || meta.color,
          badge: meta.badge,
          badgeBg: meta.badgeBg,
          title: item.title || "Notification",
          desc: item.message || item.desc || item.description || "",
          time: formatRelativeTime(
            item.createdAt || item.time || item.updatedAt,
          ),
          isRead: item.isRead ?? false,
        };
      });
    }

    // Fallback sample notifications if API returns empty list
    return DEFAULT_SAMPLE_NOTIFICATIONS.map((item) => {
      const meta = resolveNotificationMeta(item);
      return {
        ...item,
        category: meta.category,
        badge: meta.badge,
        badgeBg: meta.badgeBg,
      };
    });
  }, [apiResponse]);

  const filteredNotifications = useMemo(() => {
    if (selectedTab === "all") return parsedNotifications;
    return parsedNotifications.filter(
      (item) => item.category === selectedTab || item.rawType === selectedTab,
    );
  }, [parsedNotifications, selectedTab]);

  const handleNotificationPress = (item) => {
    if (item.category === "consultation") {
      router.push("/(tabs)/bookings");
    } else if (item.category === "wallet") {
      router.push("/(screens)/Wallet");
    } else if (item.category === "offer") {
      router.push("/(screens)/Recharge");
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => handleNotificationPress(item)}
      style={[styles.card, !item.isRead && styles.unreadCard]}
    >
      <View style={styles.leftSection}>
        <View style={[styles.iconCircle, { backgroundColor: item.badgeBg }]}>
          <Ionicons name={item.icon} size={RF(20)} color={item.color} />
        </View>

        <View style={styles.textContainer}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.title} numberOfLines={1}>
              {item.title}
            </Text>
            <Text style={styles.time}>{item.time}</Text>
          </View>

          <Text style={styles.desc} numberOfLines={3}>
            {item.desc}
          </Text>

          {item.badge && (
            <View style={styles.badgeContainer}>
              <View style={[styles.badge, { backgroundColor: item.badgeBg }]}>
                <Text style={[styles.badgeText, { color: item.color }]}>
                  {item.badge}
                </Text>
              </View>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={RF(22)} color={Colors.darkBrown} />
        </TouchableOpacity>

        <View style={styles.headerTitleWrap}>
          <Text style={styles.headerTitle}>Notifications</Text>
          <Text style={styles.headerSubtitle}>
            Updates, offers & announcements
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => refetch()}
          style={styles.refreshButton}
          activeOpacity={0.7}
        >
          {isFetching ? (
            <ActivityIndicator size="small" color={Colors.primary} />
          ) : (
            <Ionicons
              name="refresh-outline"
              size={RF(20)}
              color={Colors.darkBrown}
            />
          )}
        </TouchableOpacity>
      </View>

      {/* Category Tabs */}
      <View style={styles.tabsWrapper}>
        <FlatList
          horizontal
          data={FILTER_TABS}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(tab) => tab.id}
          contentContainerStyle={styles.tabsContainer}
          renderItem={({ item: tab }) => {
            const isSelected = selectedTab === tab.id;
            return (
              <TouchableOpacity
                onPress={() => setSelectedTab(tab.id)}
                style={[styles.tabButton, isSelected && styles.tabButtonActive]}
                activeOpacity={0.7}
              >
                <Text
                  style={[styles.tabText, isSelected && styles.tabTextActive]}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      {/* Main List */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading notifications...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredNotifications}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isFetching}
              onRefresh={refetch}
              colors={[Colors.primary]}
              tintColor={Colors.primary}
            />
          }
          contentContainerStyle={[
            styles.listContent,
            filteredNotifications.length === 0 && styles.listEmptyContent,
          ]}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconCircle}>
                <Ionicons
                  name="notifications-off-outline"
                  size={RF(40)}
                  color={Colors.textGray}
                />
              </View>
              <Text style={styles.emptyTitle}>No Notifications Found</Text>
              <Text style={styles.emptyDesc}>
                You don't have any notifications in this category yet.
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: wp(4),
    paddingVertical: hp(1.2),
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },

  backButton: {
    width: wp(10),
    height: wp(10),
    borderRadius: wp(5),
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
  },

  headerTitleWrap: {
    flex: 1,
    alignItems: "center",
  },

  headerTitle: {
    fontSize: RF(18),
    color: Colors.darkBrown,
    fontWeight: "700",
  },

  headerSubtitle: {
    fontSize: RF(11),
    color: Colors.textGray,
    fontWeight: "400",
    marginTop: hp(0.2),
  },

  refreshButton: {
    width: wp(10),
    height: wp(10),
    borderRadius: wp(5),
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
  },

  tabsWrapper: {
    backgroundColor: Colors.white,
    paddingVertical: hp(1.2),
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },

  tabsContainer: {
    paddingHorizontal: wp(3),
    gap: wp(2),
  },

  tabButton: {
    paddingHorizontal: wp(3.8),
    paddingVertical: hp(0.8),
    borderRadius: wp(5),
    backgroundColor: "#F4F4F4",
  },

  tabButtonActive: {
    backgroundColor: Colors.primary,
  },

  tabText: {
    fontSize: RF(12),
    color: Colors.textGray,
    fontWeight: "500",
  },

  tabTextActive: {
    color: Colors.white,
    fontWeight: "700",
  },

  listContent: {
    paddingTop: hp(1),
    paddingBottom: hp(4),
  },

  listEmptyContent: {
    flexGrow: 1,
    justifyContent: "center",
  },

  card: {
    flexDirection: "row",
    backgroundColor: Colors.white,
    marginHorizontal: wp(4),
    marginTop: hp(1.4),
    padding: wp(3.8),
    borderRadius: wp(3.5),
    elevation: 1.5,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },

  unreadCard: {
    borderColor: "rgba(255, 138, 0, 0.3)",
    backgroundColor: "#FFFDF9",
  },

  leftSection: {
    flexDirection: "row",
    flex: 1,
  },

  iconCircle: {
    width: wp(11),
    height: wp(11),
    borderRadius: wp(5.5),
    justifyContent: "center",
    alignItems: "center",
  },

  textContainer: {
    flex: 1,
    marginLeft: wp(3),
  },

  cardHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  title: {
    fontSize: RF(13.5),
    color: Colors.darkBrown,
    fontWeight: "600",
    flex: 1,
    marginRight: wp(2),
  },

  desc: {
    marginTop: hp(0.5),
    fontSize: RF(12),
    color: Colors.textGray,
    lineHeight: RF(17),
    fontWeight: "400",
  },

  time: {
    fontSize: RF(10.5),
    color: "#9E9E9E",
    fontWeight: "400",
  },

  badgeContainer: {
    marginTop: hp(0.8),
    flexDirection: "row",
  },

  badge: {
    paddingHorizontal: wp(2.2),
    paddingVertical: hp(0.3),
    borderRadius: wp(2),
  },

  badgeText: {
    fontSize: RF(10),
    fontWeight: "600",
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  loadingText: {
    marginTop: hp(1.5),
    fontSize: RF(13),
    color: Colors.textGray,
  },

  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: wp(8),
  },

  emptyIconCircle: {
    width: wp(18),
    height: wp(18),
    borderRadius: wp(9),
    backgroundColor: "#EEEEEE",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: hp(1.5),
  },

  emptyTitle: {
    fontSize: RF(16),
    color: Colors.darkBrown,
    fontWeight: "600",
    marginBottom: hp(0.6),
  },

  emptyDesc: {
    fontSize: RF(12),
    color: Colors.textGray,
    textAlign: "center",
    lineHeight: RF(17),
  },
});
