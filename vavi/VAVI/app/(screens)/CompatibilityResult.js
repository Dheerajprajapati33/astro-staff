import { useMemo } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import Svg, { Circle, Path } from "react-native-svg";

import Colors from "../../constants/Colors";
import { hp, RF, wp } from "../../utils/responsive";

const toSafeString = (val, fallback = "") => {
  if (val === null || val === undefined) return fallback;
  if (typeof val === "string") return val.trim();
  if (typeof val === "number" || typeof val === "boolean") return String(val);
  if (typeof val === "object") {
    if (typeof val.description === "string" && val.description.trim())
      return val.description.trim();
    if (typeof val.text === "string" && val.text.trim()) return val.text.trim();
    if (typeof val.report === "string" && val.report.trim())
      return val.report.trim();
    if (typeof val.status === "string" && val.status.trim())
      return val.status.trim();
    if (typeof val.name === "string" && val.name.trim()) return val.name.trim();
    if (typeof val.msg === "string" && val.msg.trim()) return val.msg.trim();
  }
  return fallback;
};

export default function CompatibilityResult() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const matchData = useMemo(() => {
    let raw = params?.data;
    if (!raw) return null;
    if (typeof raw === "string") {
      try {
        raw = JSON.parse(raw);
      } catch (e) {
        console.log("Error parsing match data:", e);
      }
    }
    return raw?.data || raw;
  }, [params?.data]);

  const boyName = toSafeString(params?.boyName, "Boy");
  const girlName = toSafeString(params?.girlName, "Girl");

  const {
    totalScore,
    maxScore,
    kootas,
    statusText,
    statusColor,
    statusBg,
    needleEnd,
    message,
  } = useMemo(() => {
    const root = matchData || {};
    const gunMilan =
      root?.gunMilan ||
      root?.guna_milan ||
      root?.ashtakoot ||
      root?.gunaMilan ||
      root?.guna ||
      root;

    // Extract total score from API response
    const total = Number(
      gunMilan?.total_points ??
        gunMilan?.totalPoints ??
        gunMilan?.score ??
        gunMilan?.points ??
        root?.score ??
        root?.total_points ??
        0,
    );

    const max = Number(
      gunMilan?.maximum_points ??
        gunMilan?.max_points ??
        gunMilan?.maxScore ??
        36,
    );

    // Look for Gunas array in various possible Prokerala & backend keys
    const rawGunaArray =
      (Array.isArray(gunMilan?.guna) && gunMilan.guna) ||
      (Array.isArray(gunMilan?.gunas) && gunMilan.gunas) ||
      (Array.isArray(gunMilan?.kootas) && gunMilan.kootas) ||
      (Array.isArray(gunMilan?.ashtakoot) && gunMilan.ashtakoot) ||
      (Array.isArray(gunMilan?.ashtakoota) && gunMilan.ashtakoota) ||
      (Array.isArray(gunMilan?.breakdown) && gunMilan.breakdown) ||
      (Array.isArray(root?.guna) && root.guna) ||
      (Array.isArray(root?.gunas) && root.gunas) ||
      (Array.isArray(root?.kootas) && root.kootas) ||
      (Array.isArray(root?.ashtakoot) && root.ashtakoot) ||
      (Array.isArray(root?.ashtakoota) && root.ashtakoota) ||
      (Array.isArray(root?.breakdown) && root.breakdown) ||
      null;

    const extractKoota = (id, defaultMax, searchKeys) => {
      // 1. Search in array by id or name/koot substring
      if (rawGunaArray && rawGunaArray.length > 0) {
        const found = rawGunaArray.find((item) => {
          if (!item || typeof item !== "object") return false;
          if (item.id === id) return true;
          const name = toSafeString(
            item.name || item.title || item.koot || item.koota,
            "",
          ).toLowerCase();
          return searchKeys.some((k) => name.includes(k));
        });

        if (found) {
          const s = Number(
            found.obtained_points ??
              found.points ??
              found.score ??
              found.value ??
              found.received_points ??
              0,
          );
          const m = Number(
            found.maximum_points ??
              found.max_points ??
              found.max ??
              found.total ??
              defaultMax,
          );
          const desc = toSafeString(found.description || found.desc, "");
          return {
            score: isNaN(s) ? 0 : s,
            max: isNaN(m) ? defaultMax : m,
            description: desc || null,
          };
        }

        // If standard 8 items are present in index order
        if (rawGunaArray.length === 8 && rawGunaArray[id - 1]) {
          const fallbackItem = rawGunaArray[id - 1];
          if (fallbackItem && typeof fallbackItem === "object") {
            const s = Number(
              fallbackItem.obtained_points ??
                fallbackItem.points ??
                fallbackItem.score ??
                fallbackItem.value ??
                0,
            );
            const m = Number(
              fallbackItem.maximum_points ??
                fallbackItem.max_points ??
                fallbackItem.max ??
                defaultMax,
            );
            const desc = toSafeString(
              fallbackItem.description || fallbackItem.desc,
              "",
            );
            return {
              score: isNaN(s) ? 0 : s,
              max: isNaN(m) ? defaultMax : m,
              description: desc || null,
            };
          }
        }
      }

      // 2. Search in object keys (e.g. gunMilan.varna or root.varna)
      for (const key of searchKeys) {
        const val =
          gunMilan?.[key] ??
          root?.[key] ??
          gunMilan?.koota?.[key] ??
          root?.koota?.[key] ??
          gunMilan?.breakdown?.[key] ??
          root?.breakdown?.[key];

        if (val !== undefined && val !== null) {
          if (typeof val === "number") {
            return { score: val, max: defaultMax, description: null };
          }
          if (typeof val === "object") {
            const s = Number(
              val.obtained_points ??
                val.points ??
                val.score ??
                val.value ??
                val.received_points ??
                0,
            );
            const m = Number(
              val.maximum_points ??
                val.max_points ??
                val.max ??
                val.total ??
                defaultMax,
            );
            const desc = toSafeString(val.description || val.desc, "");
            return {
              score: isNaN(s) ? 0 : s,
              max: isNaN(m) ? defaultMax : m,
              description: desc || null,
            };
          }
        }
      }

      return { score: 0, max: defaultMax, description: null };
    };

    const varna = extractKoota(1, 1, ["varna", "varn"]);
    const vasya = extractKoota(2, 2, ["vasya", "vashya"]);
    const tara = extractKoota(3, 3, ["tara", "dina"]);
    const yoni = extractKoota(4, 4, ["yoni"]);
    const maitri = extractKoota(5, 5, [
      "graha_maitri",
      "grahamaitri",
      "maitri",
      "rasi_adhipathi",
      "rasi_adhipati",
      "rashi_adhipati",
      "adhipathi",
      "adhipati",
    ]);
    const gana = extractKoota(6, 6, ["gana", "gan"]);
    const bhakoot = extractKoota(7, 7, [
      "bhakoot",
      "bhakut",
      "bhakoota",
      "rashi",
      "rasi",
    ]);
    const nadi = extractKoota(8, 8, ["nadi"]);

    const list = [
      {
        id: 1,
        title: "Varna",
        subtitle: varna.description || "Work & Ego Compatibility",
        score: `${varna.score}/${varna.max}`,
        obtained: varna.score,
        max: varna.max,
        icon: "briefcase-outline",
        progress: Math.min(
          100,
          Math.round((varna.score / (varna.max || 1)) * 100),
        ),
      },
      {
        id: 2,
        title: "Vasya",
        subtitle: vasya.description || "Mutual Attraction & Dominance",
        score: `${vasya.score}/${vasya.max}`,
        obtained: vasya.score,
        max: vasya.max,
        icon: "heart-outline",
        progress: Math.min(
          100,
          Math.round((vasya.score / (vasya.max || 1)) * 100),
        ),
      },
      {
        id: 3,
        title: "Tara",
        subtitle: tara.description || "Destiny, Comfort & Health",
        score: `${tara.score}/${tara.max}`,
        obtained: tara.score,
        max: tara.max,
        icon: "star-outline",
        progress: Math.min(
          100,
          Math.round((tara.score / (tara.max || 1)) * 100),
        ),
      },
      {
        id: 4,
        title: "Yoni",
        subtitle: yoni.description || "Physical & Biological Compatibility",
        score: `${yoni.score}/${yoni.max}`,
        obtained: yoni.score,
        max: yoni.max,
        icon: "account-heart-outline",
        progress: Math.min(
          100,
          Math.round((yoni.score / (yoni.max || 1)) * 100),
        ),
      },
      {
        id: 5,
        title: "Graha Maitri (Rasi Adhipathi)",
        subtitle: maitri.description || "Mental & Intellectual Friendship",
        score: `${maitri.score}/${maitri.max}`,
        obtained: maitri.score,
        max: maitri.max,
        icon: "handshake-outline",
        progress: Math.min(
          100,
          Math.round((maitri.score / (maitri.max || 1)) * 100),
        ),
      },
      {
        id: 6,
        title: "Gana",
        subtitle: gana.description || "Temperament & Behavior Matching",
        score: `${gana.score}/${gana.max}`,
        obtained: gana.score,
        max: gana.max,
        icon: "account-group-outline",
        progress: Math.min(
          100,
          Math.round((gana.score / (gana.max || 1)) * 100),
        ),
      },
      {
        id: 7,
        title: "Bhakoot",
        subtitle: bhakoot.description || "Family Welfare & Financial Bond",
        score: `${bhakoot.score}/${bhakoot.max}`,
        obtained: bhakoot.score,
        max: bhakoot.max,
        icon: "home-heart",
        progress: Math.min(
          100,
          Math.round((bhakoot.score / (bhakoot.max || 1)) * 100),
        ),
      },
      {
        id: 8,
        title: "Nadi",
        subtitle: nadi.description || "Genetic Harmony & Progeny Health",
        score: `${nadi.score}/${nadi.max}`,
        obtained: nadi.score,
        max: nadi.max,
        icon: "pulse",
        progress: Math.min(
          100,
          Math.round((nadi.score / (nadi.max || 1)) * 100),
        ),
      },
    ];

    let sText = "Good Compatibility";
    let sColor = "#38A44D";
    let sBg = "#EEF9EE";

    if (total >= 28) {
      sText = "Excellent Compatibility";
      sColor = "#2E7D32";
      sBg = "#E8F5E9";
    } else if (total >= 18) {
      sText = "Good Compatibility";
      sColor = "#38A44D";
      sBg = "#EEF9EE";
    } else if (total >= 14) {
      sText = "Moderate Compatibility";
      sColor = "#F57C00";
      sBg = "#FFF3E0";
    } else {
      sText = "Low Compatibility";
      sColor = "#D32F2F";
      sBg = "#FFEBEE";
    }

    // Needle coordinates on Gauge SVG
    const ratio = Math.max(0, Math.min(1, total / (max || 36)));
    const angleRad = Math.PI * (1 - ratio);
    const cx = 110;
    const cy = 110;
    const needleLength = 55;
    const endX = Math.round(cx + needleLength * Math.cos(angleRad));
    const endY = Math.round(cy - needleLength * Math.sin(angleRad));

    const rawMsg =
      root?.message ||
      root?.description ||
      root?.conclusion?.report ||
      root?.conclusion;
    const extractedMsg = toSafeString(rawMsg, "");

    return {
      totalScore: total,
      maxScore: max,
      kootas: list,
      statusText: sText,
      statusColor: sColor,
      statusBg: sBg,
      needleEnd: { x: endX, y: endY },
      message: extractedMsg || null,
    };
  }, [matchData]);

  const getScoreBadgeStyles = (obtained, max) => {
    if (obtained === 0) {
      return {
        bg: "#FEE2E2",
        textColor: "#DC2626",
      };
    }
    if (obtained < max) {
      return {
        bg: "#FEF3C7",
        textColor: "#D97706",
      };
    }
    return {
      bg: "#EAF8EA",
      textColor: "#36A853",
    };
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity activeOpacity={0.8} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={RF(22)} color={Colors.primary} />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Compatibility Result</Text>

          <TouchableOpacity activeOpacity={0.8}>
            <MaterialCommunityIcons
              name="creation"
              size={RF(20)}
              color={Colors.primary}
            />
          </TouchableOpacity>
        </View>

        {/* Pair Names Banner */}
        <View style={styles.namesBanner}>
          <Text style={styles.pairNamesText}>
            {boyName} <Text style={{ color: Colors.primary }}>&hearts;</Text>{" "}
            {girlName}
          </Text>
        </View>

        {/* Compatibility Score Card */}
        <View style={styles.scoreCard}>
          {/* Gauge */}
          <View style={styles.gaugeContainer}>
            <Svg width={wp(60)} height={hp(16)} viewBox="0 0 220 140">
              {/* Red Arc (Low) */}
              <Path
                d="M35 110 A75 75 0 0 1 80 35"
                stroke="#FF5722"
                strokeWidth="12"
                fill="none"
                strokeLinecap="round"
              />

              {/* Yellow Arc (Medium) */}
              <Path
                d="M80 35 A75 75 0 0 1 140 35"
                stroke="#FFC107"
                strokeWidth="12"
                fill="none"
                strokeLinecap="round"
              />

              {/* Green Arc (High) */}
              <Path
                d="M140 35 A75 75 0 0 1 185 110"
                stroke="#4CAF50"
                strokeWidth="12"
                fill="none"
                strokeLinecap="round"
              />

              {/* Needle */}
              <Path
                d={`M110 110 L${needleEnd.x} ${needleEnd.y}`}
                stroke="#444"
                strokeWidth="4"
                strokeLinecap="round"
              />

              <Circle cx="110" cy="110" r="6" fill="#333" />
            </Svg>
          </View>

          {/* Score */}
          <View style={styles.scoreSection}>
            <Text style={styles.scoreValue}>
              <Text style={styles.scoreHighlight}>{totalScore}</Text>
              <Text style={styles.totalScore}>/{maxScore}</Text>
            </Text>

            <Text style={styles.scoreLabel}>Gun Milan Compatibility Score</Text>

            <View style={[styles.statusBadge, { backgroundColor: statusBg }]}>
              <Ionicons name="sparkles" size={RF(12)} color={statusColor} />
              <Text style={[styles.statusText, { color: statusColor }]}>
                {statusText}
              </Text>
            </View>
          </View>
        </View>

        {/* Detailed Breakdown */}
        <View style={styles.sectionHeader}>
          <View style={styles.sectionIcon}>
            <Ionicons name="list" size={RF(18)} color={Colors.primary} />
          </View>

          <View>
            <Text style={styles.sectionTitle}>
              Ashtakoot Detailed Breakdown
            </Text>
            <Text style={styles.sectionSubtitle}>
              Explore how well you both connect in 8 key areas of Vedic Milan
            </Text>
          </View>
        </View>

        {/* Breakdown Cards */}
        {kootas.map((item) => {
          const badgeStyles = getScoreBadgeStyles(item.obtained, item.max);
          return (
            <View key={item.id} style={styles.breakdownCard}>
              {/* Top Row */}
              <View style={styles.breakdownHeader}>
                <View style={styles.leftContent}>
                  <View style={styles.iconBox}>
                    <MaterialCommunityIcons
                      name={item.icon}
                      size={RF(18)}
                      color={Colors.primary}
                    />
                  </View>

                  <View style={styles.textContent}>
                    <Text style={styles.breakdownTitle}>
                      {toSafeString(item.title)}
                    </Text>
                    <Text style={styles.breakdownSubtitle}>
                      {toSafeString(item.subtitle)}
                    </Text>
                  </View>
                </View>

                {/* Score Badge */}
                <View
                  style={[
                    styles.scoreCircle,
                    { backgroundColor: badgeStyles.bg },
                  ]}
                >
                  <Text
                    style={[
                      styles.scoreCircleText,
                      { color: badgeStyles.textColor },
                    ]}
                  >
                    {toSafeString(item.score)}
                  </Text>
                </View>
              </View>

              {/* Progress */}
              <View style={styles.progressBackground}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${item.progress}%`,
                      backgroundColor:
                        item.obtained === 0 ? "#EF4444" : Colors.primary,
                    },
                  ]}
                />
              </View>
            </View>
          );
        })}

        {/* Note / Result Message Card */}
        <View style={styles.noteCard}>
          <View style={styles.noteHeader}>
            <Ionicons
              name="information-circle-outline"
              size={RF(18)}
              color={Colors.primary}
            />
            <Text style={styles.noteTitle}>Astrological Interpretation</Text>
          </View>

          <Text style={styles.noteDescription}>
            {message ||
              "This Gun Milan score is calculated on traditional Vedic Ashta Koota principles out of 36 points. A score of 18 points or higher is traditionally considered auspicious for a harmonious marriage."}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF8F4",
  },
  content: {
    paddingHorizontal: wp(4),
    paddingBottom: hp(4),
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: hp(1),
    marginBottom: hp(1.5),
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    color: Colors.primary,
    fontSize: RF(18),
    fontWeight: "700",
    marginHorizontal: wp(2),
  },
  namesBanner: {
    backgroundColor: "#FFF2E6",
    paddingVertical: hp(1),
    paddingHorizontal: wp(4),
    borderRadius: wp(3),
    alignItems: "center",
    marginBottom: hp(2),
    borderWidth: 1,
    borderColor: "#FFDFC6",
  },
  pairNamesText: {
    color: "#444",
    fontSize: RF(14),
    fontWeight: "700",
  },
  scoreCard: {
    backgroundColor: Colors.white,
    borderRadius: wp(5),
    paddingVertical: hp(2.5),
    paddingHorizontal: wp(4),
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    elevation: 3,
  },
  gaugeContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  scoreSection: {
    alignItems: "center",
    marginTop: hp(-1),
  },
  scoreValue: {
    flexDirection: "row",
  },
  scoreHighlight: {
    color: Colors.primary,
    fontSize: RF(28),
    fontWeight: "700",
  },
  totalScore: {
    color: "#555",
    fontSize: RF(17),
    fontWeight: "600",
  },
  scoreLabel: {
    color: "#444",
    fontSize: RF(13),
    fontWeight: "500",
    marginTop: hp(0.3),
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: wp(3.5),
    paddingVertical: hp(0.6),
    borderRadius: wp(6),
    marginTop: hp(1.2),
  },
  statusText: {
    fontSize: RF(12),
    fontWeight: "600",
    marginLeft: wp(1.5),
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: hp(3),
    marginBottom: hp(1.5),
  },
  sectionIcon: {
    width: wp(10),
    height: wp(10),
    borderRadius: wp(5),
    backgroundColor: "#FFF1E8",
    justifyContent: "center",
    alignItems: "center",
    marginRight: wp(3),
  },
  sectionTitle: {
    color: "#222",
    fontSize: RF(15),
    fontWeight: "700",
  },
  sectionSubtitle: {
    color: "#777",
    fontSize: RF(11),
    fontWeight: "400",
    marginTop: hp(0.2),
  },
  breakdownCard: {
    backgroundColor: Colors.white,
    borderRadius: wp(4),
    padding: wp(3.5),
    marginBottom: hp(1.4),
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    elevation: 2,
  },
  breakdownHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  leftContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconBox: {
    width: wp(11),
    height: wp(11),
    borderRadius: wp(5.5),
    backgroundColor: "#FFF4EC",
    justifyContent: "center",
    alignItems: "center",
    marginRight: wp(3),
  },
  textContent: {
    flex: 1,
  },
  breakdownTitle: {
    color: "#222",
    fontSize: RF(14),
    fontWeight: "700",
  },
  breakdownSubtitle: {
    color: "#777",
    fontSize: RF(11),
    fontWeight: "400",
    marginTop: hp(0.2),
  },
  scoreCircle: {
    minWidth: wp(14),
    height: wp(8.5),
    borderRadius: wp(4.5),
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: wp(2.5),
  },
  scoreCircleText: {
    fontSize: RF(12),
    fontWeight: "700",
  },
  progressBackground: {
    width: "100%",
    height: hp(0.9),
    backgroundColor: "#F3E6DD",
    borderRadius: hp(1),
    overflow: "hidden",
    marginTop: hp(1.4),
  },
  progressFill: {
    height: "100%",
    borderRadius: hp(1),
  },
  noteCard: {
    backgroundColor: "#FFFDF8",
    borderRadius: wp(4),
    borderWidth: 1,
    borderColor: "#FFE3C6",
    padding: wp(4),
    marginTop: hp(1),
    marginBottom: hp(3),
  },
  noteHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hp(1),
  },
  noteTitle: {
    color: Colors.primary,
    fontSize: RF(14),
    fontWeight: "700",
    marginLeft: wp(2),
  },
  noteDescription: {
    color: "#666",
    fontSize: RF(12),
    lineHeight: RF(19),
    fontWeight: "400",
  },
});
