import React from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { router, useSegments } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import Colors from "../../constants/Colors";
import { resolveImageUri } from "../../config/api";
import { hp, RF, wp } from "../../utils/responsive";
import { useGetLiveSessionsQuery } from "../../redux/liveApi";

import AsyncStorage from "@react-native-async-storage/async-storage";

const ORANGE = "#ff6a00";

export default function LiveAstrologersSection() {
  const segments = useSegments();
  const [hasToken, setHasToken] = React.useState(false);

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
  }, [segments]);

  const { data: liveData } = useGetLiveSessionsQuery({ page: 1, limit: 10 });

  const rawSessions = Array.isArray(liveData?.data?.sessions)
    ? liveData.data.sessions
    : Array.isArray(liveData?.data?.liveSessions)
      ? liveData.data.liveSessions
      : Array.isArray(liveData?.data?.rows)
        ? liveData.data.rows
        : Array.isArray(liveData?.data)
          ? liveData.data
          : Array.isArray(liveData)
            ? liveData
            : [];

  // Filter out any ended sessions
  const sessions = rawSessions.filter(
    (s) =>
      s &&
      s.status !== "ended" &&
      s.status !== "completed" &&
      s.isLive !== false,
  );

  // Only show when there is an active live stream; remove completely when ended
  if (!sessions || sessions.length === 0) {
    return null;
  }

  const handleJoinLive = (item) => {
    router.push({
      pathname: "/LiveStream",
      params: {
        liveSessionId: String(
          item.id || item.liveSessionId || item._id || "live_1",
        ),
        astrologerName:
          item?.astrologer?.name ||
          item?.user?.name ||
          item?.hostName ||
          item?.name ||
          "Astrologer",
        astrologerImage:
          item?.astrologer?.profilePic ||
          item?.user?.profilePic ||
          item?.thumbnail ||
          item?.image ||
          "",
        title:
          item?.title || item?.sessionTitle || "Live Astrology Consultation",
      },
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <View style={styles.livePulseDot} />
          <Text style={styles.title}>Live Astrologers</Text>
        </View>
        <Text style={styles.subTitle}>Join live interactive sessions</Text>
      </View>

      <FlatList
        data={sessions}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) =>
          String(item.id || item.liveSessionId || item._id || Math.random())
        }
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => {
          const name =
            item?.astrologer?.name ||
            item?.user?.name ||
            item?.hostName ||
            item?.name ||
            "Astrologer";
          const imageUri =
            item?.astrologer?.profilePic ||
            item?.user?.profilePic ||
            item?.thumbnail ||
            item?.image;
          const sessionTitle =
            item?.title || item?.sessionTitle || "Daily Horoscope Live";
          const viewers =
            item?.viewersCount ?? item?.viewers ?? item?.viewerCount ?? 1;
          const imageSource = imageUri
            ? resolveImageUri(imageUri)
            : require("../../assets/images/background.png");

          return (
            <TouchableOpacity
              activeOpacity={0.88}
              style={styles.card}
              onPress={() => handleJoinLive(item)}
            >
              <Image
                source={imageSource}
                style={styles.cardImage}
                resizeMode="cover"
              />
              <View style={styles.imageOverlay} />

              <View style={styles.liveTag}>
                <View style={styles.innerDot} />
                <Text style={styles.liveTagText}>LIVE</Text>
              </View>

              <View style={styles.viewersBadge}>
                <Ionicons name="eye" size={RF(10)} color="#fff" />
                <Text style={styles.viewersText}>{viewers}</Text>
              </View>

              <View style={styles.cardFooter}>
                <Text style={styles.astrologerName} numberOfLines={1}>
                  {name}
                </Text>
                <Text style={styles.sessionTitle} numberOfLines={1}>
                  {sessionTitle}
                </Text>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: hp(1.5),
    marginBottom: hp(1),
  },
  header: {
    paddingHorizontal: wp(4),
    marginBottom: hp(1),
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(1.5),
  },
  livePulseDot: {
    width: wp(2.2),
    height: wp(2.2),
    borderRadius: wp(1.1),
    backgroundColor: "#ff3b30",
  },
  title: {
    fontSize: RF(16),
    fontWeight: "700",
    color: "#333",
  },
  subTitle: {
    fontSize: RF(11),
    color: "#777",
    marginTop: hp(0.2),
  },
  listContent: {
    paddingHorizontal: wp(4),
    gap: wp(3),
  },
  card: {
    width: wp(38),
    height: hp(22),
    borderRadius: wp(4),
    overflow: "hidden",
    backgroundColor: "#222",
    position: "relative",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  cardImage: {
    width: "100%",
    height: "100%",
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  liveTag: {
    position: "absolute",
    top: hp(1),
    left: wp(2),
    backgroundColor: "#ff3b30",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: wp(2),
    paddingVertical: hp(0.3),
    borderRadius: wp(2),
    gap: wp(1),
  },
  innerDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#fff",
  },
  liveTagText: {
    color: "#fff",
    fontSize: RF(8.5),
    fontWeight: "800",
  },
  viewersBadge: {
    position: "absolute",
    top: hp(1),
    right: wp(2),
    backgroundColor: "rgba(0,0,0,0.6)",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: wp(1.8),
    paddingVertical: hp(0.3),
    borderRadius: wp(2),
    gap: wp(0.8),
  },
  viewersText: {
    color: "#fff",
    fontSize: RF(9),
    fontWeight: "600",
  },
  cardFooter: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: wp(2.5),
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  astrologerName: {
    color: "#fff",
    fontSize: RF(12),
    fontWeight: "700",
  },
  sessionTitle: {
    color: "#ffc107",
    fontSize: RF(9.5),
    marginTop: hp(0.2),
  },
});
