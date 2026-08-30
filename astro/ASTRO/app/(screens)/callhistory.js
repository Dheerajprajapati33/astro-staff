import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Typography from "../../constants/Typography";
import { hp, RF, wp } from "../../utils/responsive";
import { useGetConsultationHistoryQuery } from "../../redux/ChatApi";

const ORANGE = "#ff6a00";
const AVATAR_BG = [
  "#fff1e8",
  "#eefbea",
  "#f0e9ff",
  "#fff3dd",
  "#e5f4ff",
  "#ffeaf1",
];

const LOG_TAG = "[CallHistory]";

const initialsOf = (name = "") =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "C";

export default function CallHistory() {
  const [search, setSearch] = useState("");
  const [showInfo, setShowInfo] = useState(false);

  // Fetch Live Astrologer Call Consultation History
  const {
    data: historyData,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useGetConsultationHistoryQuery(
    { page: 1, limit: 50, type: "call" },
    { pollingInterval: 10000 }
  );

  const consultationsList = useMemo(() => {
    if (Array.isArray(historyData?.consultations)) {
      return historyData.consultations;
    }
    if (Array.isArray(historyData?.data?.consultations)) {
      return historyData.data.consultations;
    }
    if (Array.isArray(historyData?.data)) {
      return historyData.data;
    }
    return [];
  }, [historyData]);

  const filteredCalls = useMemo(() => {
    if (!search.trim()) return consultationsList;
    const q = search.trim().toLowerCase();

    return consultationsList.filter((item) => {
      const name = (
        item?.user?.name ||
        item?.userName ||
        item?.clientName ||
        ""
      ).toLowerCase();
      const problem = (item?.problem || item?.topic || "").toLowerCase();
      return name.includes(q) || problem.includes(q);
    });
  }, [consultationsList, search]);

  const formatDate = (dateStr) => {
    if (!dateStr) return { time: "", label: "Today" };
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return { time: "", label: "Today" };

      const timeStr = d.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });

      const today = new Date();
      const isToday =
        d.getDate() === today.getDate() &&
        d.getMonth() === today.getMonth() &&
        d.getFullYear() === today.getFullYear();

      const labelStr = isToday
        ? "Today"
        : d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });

      return { time: timeStr, label: labelStr };
    } catch (e) {
      return { time: "", label: "Today" };
    }
  };

  const handleOpenCallScreen = (item) => {
    const consultationId = item?.id || item?.consultationId;
    const status = (item?.status || "").toLowerCase();

    if (status === "ongoing" || status === "ringing" || status === "waiting") {
      router.push({
        pathname: "/call",
        params: {
          consultationId,
          userName: item?.user?.name || "Client",
          astrologerId: item?.astrologerId,
        },
      });
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Top Header */}
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

      {/* Search Input Box */}
      <View style={styles.searchBox}>
        <Ionicons name="search-outline" size={RF(18)} color="#9ca3af" />
        <TextInput
          placeholder="Search client name or topic..."
          placeholderTextColor="#9ca3af"
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch("")}>
            <Ionicons name="close-circle" size={RF(16)} color="#9ca3af" />
          </TouchableOpacity>
        )}
      </View>

      {/* Info Banner */}
      {showInfo && (
        <View style={styles.infoCard}>
          <View style={styles.infoIcon}>
            <Ionicons name="call-outline" size={RF(20)} color={ORANGE} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.infoTitle}>Voice Consultation History</Text>
            <Text style={styles.infoText}>
              View details, duration, and earnings for all your client voice calls.
            </Text>
          </View>
        </View>
      )}

      {/* Content Area */}
      {isLoading ? (
        <View style={styles.centerState}>
          <ActivityIndicator size="large" color={ORANGE} />
          <Text style={styles.loadingText}>Loading call history...</Text>
        </View>
      ) : error ? (
        <View style={styles.centerState}>
          <Text style={styles.emptyText}>
            Unable to load call history. Please pull to refresh.
          </Text>
          <TouchableOpacity onPress={refetch} style={styles.retryBtn}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filteredCalls}
          keyExtractor={(item, index) =>
            String(item.id || item.consultationId || index)
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={isFetching}
              onRefresh={refetch}
              tintColor={ORANGE}
              colors={[ORANGE]}
            />
          }
          ListEmptyComponent={
            <View style={styles.centerState}>
              <Ionicons
                name="call-outline"
                size={RF(40)}
                color="#ccc"
                style={{ marginBottom: hp(1) }}
              />
              <Text style={styles.emptyText}>No voice consultation history found.</Text>
            </View>
          }
          renderItem={({ item, index }) => {
            const name =
              item?.user?.name ||
              item?.userName ||
              item?.clientName ||
              "Client";
            const initials = initialsOf(name);
            const bg = AVATAR_BG[index % AVATAR_BG.length];
            const problem =
              item?.problem || item?.topic || "Voice Consultation";
            const { time, label } = formatDate(item?.createdAt || item?.date);
            const status = (item?.status || "completed").toLowerCase();
            const durationSecs = Number(item?.duration || item?.durationSeconds) || 0;
            const durationMins = Math.ceil(durationSecs / 60);
            const amount = item?.amount || item?.astrologerEarnings || item?.fee || 0;

            return (
              <TouchableOpacity
                style={styles.card}
                activeOpacity={0.85}
                onPress={() => handleOpenCallScreen(item)}
              >
                {/* Avatar Circle */}
                <View style={[styles.avatar, { backgroundColor: bg }]}>
                  <Text style={styles.avatarText}>{initials}</Text>
                </View>

                {/* Middle Details */}
                <View style={styles.middle}>
                  <View style={styles.nameRow}>
                    <Text style={styles.name}>{name}</Text>
                    {status === "completed" && (
                      <Ionicons
                        name="checkmark-circle"
                        size={RF(13)}
                        color="#4CAF50"
                      />
                    )}
                  </View>

                  <Text style={styles.problem} numberOfLines={1}>
                    Topic: <Text style={styles.problemValue}>{problem}</Text>
                  </Text>

                  <View style={styles.metaRow}>
                    <View style={styles.metaBadge}>
                      <Ionicons name="time-outline" size={RF(11)} color="#2196F3" />
                      <Text style={styles.metaText}>{durationMins} min</Text>
                    </View>

                    <View style={styles.metaBadge}>
                      <Ionicons name="wallet-outline" size={RF(11)} color="#4CAF50" />
                      <Text style={[styles.metaText, { color: "#2E7D32" }]}>
                        ₹{amount}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Right Time & Status */}
                <View style={styles.right}>
                  {!!time && (
                    <View style={styles.timeRow}>
                      <Ionicons name="time-outline" size={RF(11)} color={ORANGE} />
                      <Text style={styles.time}>{time}</Text>
                    </View>
                  )}
                  <Text style={styles.today}>{label}</Text>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      )}
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
  searchBox: {
    height: hp(5.5),
    marginHorizontal: wp(4),
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: wp(2.5),
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: wp(2.5),
    marginBottom: hp(1.5),
  },
  searchInput: {
    flex: 1,
    marginLeft: wp(2),
    fontSize: RF(11),
    color: "#111827",
    fontWeight: "700",
    fontFamily: Typography?.bold,
  },
  infoCard: {
    marginHorizontal: wp(4),
    marginBottom: hp(1.8),
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
  infoTitle: {
    fontSize: RF(13),
    color: "#1f2937",
    fontWeight: "900",
    fontFamily: Typography?.bold,
  },
  infoText: {
    fontSize: RF(10),
    color: "#607086",
    marginTop: hp(0.3),
    fontWeight: "700",
    fontFamily: Typography?.bold,
  },
  list: {
    paddingHorizontal: wp(4),
    paddingBottom: hp(6),
  },
  centerState: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: hp(6),
    paddingHorizontal: wp(8),
  },
  loadingText: {
    fontSize: RF(11),
    color: "#666",
    marginTop: hp(1),
    fontFamily: Typography?.bold,
  },
  emptyText: {
    fontSize: RF(11),
    color: "#607086",
    textAlign: "center",
    fontWeight: "700",
    fontFamily: Typography?.bold,
  },
  retryBtn: {
    marginTop: hp(1.5),
    paddingHorizontal: wp(4.5),
    paddingVertical: hp(0.9),
    borderRadius: wp(2),
    backgroundColor: ORANGE,
  },
  retryText: {
    color: "#fff",
    fontFamily: Typography?.bold,
    fontWeight: "800",
    fontSize: RF(11),
  },
  card: {
    minHeight: hp(11),
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
    width: wp(13),
    height: wp(13),
    borderRadius: wp(6.5),
    alignItems: "center",
    justifyContent: "center",
    marginRight: wp(3),
  },
  avatarText: {
    fontSize: RF(13.5),
    color: ORANGE,
    fontWeight: "900",
    fontFamily: Typography?.bold,
  },
  middle: {
    flex: 1,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(1),
    marginBottom: hp(0.2),
  },
  name: {
    fontSize: RF(15),
    color: "#1f2937",
    fontWeight: "900",
    fontFamily: Typography?.bold,
  },
  problem: {
    fontSize: RF(11),
    color: ORANGE,
    fontWeight: "800",
    fontFamily: Typography?.bold,
    marginBottom: hp(0.5),
  },
  problemValue: {
    color: "#607086",
    fontWeight: "700",
    fontFamily: Typography?.bold,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(2),
  },
  metaBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9fafb",
    paddingHorizontal: wp(2),
    paddingVertical: hp(0.3),
    borderRadius: wp(1.5),
    gap: wp(1),
  },
  metaText: {
    fontSize: RF(9.5),
    fontWeight: "700",
    color: "#374151",
  },
  right: {
    alignItems: "flex-end",
    marginLeft: wp(2),
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(0.8),
  },
  time: {
    fontSize: RF(11),
    color: "#1f2937",
    fontWeight: "800",
    fontFamily: Typography?.bold,
  },
  today: {
    fontSize: RF(10),
    color: "#607086",
    marginTop: hp(0.4),
    fontWeight: "700",
    fontFamily: Typography?.bold,
  },
});
