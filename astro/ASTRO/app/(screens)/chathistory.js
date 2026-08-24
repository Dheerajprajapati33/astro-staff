import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Typography from "../../constants/Typography";
import { hp, RF, wp } from "../../utils/responsive";
import { useGetChatRoomsQuery } from "../../redux/ChatApi";

const ORANGE = "#ff6a00";
const AVATAR_BG = [
  "#fff1e8",
  "#eefbea",
  "#f0e9ff",
  "#fff3dd",
  "#e5f4ff",
  "#ffeaf1",
];

const LOG_TAG = "[ChatHistory]";

const initialsOf = (name = "") =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "C";

export default function ChatHistory() {
  const [search, setSearch] = useState("");
  const [showInfo, setShowInfo] = useState(false);

  // Verified live: GET /chat/rooms is the real, persistent chat system
  // (one room per user<->astrologer pair, with real lastMessage/unread
  // data) - separate from the paid /consultation flow. See ChatApi.js.
  const {
    data: rooms,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useGetChatRoomsQuery();

  useEffect(() => {
    console.log(LOG_TAG, "rooms data:", JSON.stringify(rooms));
  }, [rooms]);

  useEffect(() => {
    if (error) {
      console.log(LOG_TAG, "rooms error:", JSON.stringify(error));
    }
  }, [error]);

  const filteredRooms = useMemo(() => {
    const list = rooms ?? [];

    if (!search.trim()) return list;

    const q = search.trim().toLowerCase();

    return list.filter((room) => {
      const name = room?.user?.name || "";
      const lastMessage = room?.lastMessage || "";

      return (
        name.toLowerCase().includes(q) || lastMessage.toLowerCase().includes(q)
      );
    });
  }, [rooms, search]);

  const handleOpenRoom = (room) => {
    console.log(LOG_TAG, "opening room:", room?.id);

    router.push({
      pathname: "/chat",
      params: {
        roomId: room.id,
        userId: room.userId,
        name: room?.user?.name || "Client",
        initials: initialsOf(room?.user?.name || "Client"),
      },
    });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={RF(24)} color={ORANGE} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Chat History</Text>

        <TouchableOpacity
          style={styles.helpButton}
          onPress={() => setShowInfo((prev) => !prev)}
        >
          <Ionicons name="help-circle-outline" size={RF(22)} color={ORANGE} />
        </TouchableOpacity>
      </View>

      <View style={styles.searchBox}>
        <Ionicons name="search-outline" size={RF(18)} color="#9ca3af" />
        <TextInput
          placeholder="Search by name or keyword..."
          placeholderTextColor="#9ca3af"
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {showInfo && (
        <View style={styles.infoCard}>
          <View style={styles.infoIcon}>
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={RF(20)}
              color={ORANGE}
            />
          </View>
          <View>
            <Text style={styles.infoTitle}>Your Chat Conversations</Text>
            <Text style={styles.infoText}>
              View and manage all your chat conversations here.
            </Text>
          </View>
        </View>
      )}

      {isLoading ? (
        <ActivityIndicator
          color={ORANGE}
          size="large"
          style={{ marginTop: hp(4) }}
        />
      ) : error ? (
        <View style={styles.centerState}>
          <Text style={styles.emptyText}>
            Couldn't load chats. Pull to refresh or try again.
          </Text>
          <TouchableOpacity onPress={refetch} style={styles.retryBtn}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filteredRooms}
          keyExtractor={(item, index) => String(item.id ?? index)}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
          refreshing={isFetching}
          onRefresh={refetch}
          ListEmptyComponent={
            <View style={styles.centerState}>
              <Text style={styles.emptyText}>No chat conversations yet.</Text>
            </View>
          }
          renderItem={({ item, index }) => {
            const name = item?.user?.name || "Client";
            const initials = initialsOf(name);
            const bg = AVATAR_BG[index % AVATAR_BG.length];
            const preview = item.lastMessage || "No messages yet";
            const time = item.lastMessageAt || item.updatedAt;
            const unreadCount = item.unreadAstrologerCount || 0;

            return (
              <TouchableOpacity
                style={styles.card}
                activeOpacity={0.85}
                onPress={() => handleOpenRoom(item)}
              >
                <View style={[styles.avatar, { backgroundColor: bg }]}>
                  <Text style={styles.avatarText}>{initials}</Text>
                </View>

                <View style={styles.middle}>
                  <Text style={styles.name}>{name}</Text>

                  <Text numberOfLines={1} style={styles.msg}>
                    {preview}
                  </Text>
                </View>

                <View style={styles.right}>
                  <Text
                    style={[
                      styles.time,
                      unreadCount > 0 && { color: ORANGE, fontWeight: "800" },
                    ]}
                  >
                    {time
                      ? new Date(time).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : ""}
                  </Text>

                  {unreadCount > 0 ? (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>{unreadCount}</Text>
                    </View>
                  ) : null}
                </View>

                <Ionicons name="chevron-forward" size={RF(18)} color="#aaa" />
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
    justifyContent: "space-between",
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
    minHeight: hp(10),
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
    shadowOpacity: 0.04,
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
    marginBottom: hp(0.6),
    fontFamily: Typography?.bold,
  },
  msg: {
    fontSize: RF(11.5),
    color: "#607086",
    fontWeight: "700",
    fontFamily: Typography?.bold,
  },
  right: {
    width: wp(18),
    alignItems: "flex-end",
    marginRight: wp(2),
  },
  time: {
    fontSize: RF(11),
    color: "#607086",
    fontWeight: "700",
    fontFamily: Typography?.bold,
  },
  badge: {
    marginTop: hp(1),
    width: wp(7),
    height: wp(7),
    borderRadius: wp(3.5),
    backgroundColor: ORANGE,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    color: "#fff",
    fontSize: RF(11),
    fontWeight: "900",
    fontFamily: Typography?.bold,
  },
});
