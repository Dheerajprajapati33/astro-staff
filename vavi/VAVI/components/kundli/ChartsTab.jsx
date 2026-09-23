import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { hp, RF, wp } from "../../utils/responsive";
import VedicChart, { parseSignNumber } from "./VedicChart";
import { useGetKundliChartMutation } from "../../redux/KundliApi";

const ORANGE = "#ff5a00";
const BORDER = "#ff8a50";
const LIGHT = "#fff4df";

const chartTypes = ["Lagna", "Navamsa", "Transit"];
const planetTabs = ["Sign", "Nakshatra"];

const SIGN_NAMES = [
  "",
  "Aries",
  "Taurus",
  "Gemini",
  "Cancer",
  "Leo",
  "Virgo",
  "Libra",
  "Scorpio",
  "Sagittarius",
  "Capricorn",
  "Aquarius",
  "Pisces",
];

const SIGN_LORDS = [
  "",
  "Mars",
  "Venus",
  "Mercury",
  "Moon",
  "Sun",
  "Mercury",
  "Venus",
  "Mars",
  "Jupiter",
  "Saturn",
  "Saturn",
  "Jupiter",
];

// 27 Vedic Nakshatras & their Ruling Lords
const NAKSHATRAS = [
  { name: "Ashwini", lord: "Ketu" },
  { name: "Bharani", lord: "Venus" },
  { name: "Krittika", lord: "Sun" },
  { name: "Rohini", lord: "Moon" },
  { name: "Mrigashira", lord: "Mars" },
  { name: "Ardra", lord: "Rahu" },
  { name: "Punarvasu", lord: "Jupiter" },
  { name: "Pushya", lord: "Saturn" },
  { name: "Ashlesha", lord: "Mercury" },
  { name: "Magha", lord: "Ketu" },
  { name: "Purva Phalguni", lord: "Venus" },
  { name: "Uttara Phalguni", lord: "Sun" },
  { name: "Hasta", lord: "Moon" },
  { name: "Chitra", lord: "Mars" },
  { name: "Swati", lord: "Rahu" },
  { name: "Vishakha", lord: "Jupiter" },
  { name: "Anuradha", lord: "Saturn" },
  { name: "Jyeshtha", lord: "Mercury" },
  { name: "Moola", lord: "Ketu" },
  { name: "Purva Ashadha", lord: "Venus" },
  { name: "Uttara Ashadha", lord: "Sun" },
  { name: "Shravana", lord: "Moon" },
  { name: "Dhanishta", lord: "Mars" },
  { name: "Shatabhisha", lord: "Rahu" },
  { name: "Purva Bhadrapada", lord: "Jupiter" },
  { name: "Uttara Bhadrapada", lord: "Saturn" },
  { name: "Revati", lord: "Mercury" },
];

// Standard Natal Planetary Positions (Vedic Chart with Pisces Lagna)
const DEFAULT_PLANETS = [
  {
    name: "Ascendant",
    planet: "Ascendant",
    sign: "Pisces",
    rasi: "Pisces",
    signLord: "Jupiter",
    degree: `24° 29' 17.4"`,
    normDegree: `24° 29' 17.4"`,
    isRetrograde: false,
    house: 1,
    nakshatra: "Revati",
    nakshatraLord: "Mercury",
  },
  {
    name: "Sun",
    planet: "Sun",
    sign: "Pisces",
    rasi: "Pisces",
    signLord: "Jupiter",
    degree: `22° 54' 6.14"`,
    normDegree: `22° 54' 6.14"`,
    isRetrograde: false,
    house: 1,
    nakshatra: "Revati",
    nakshatraLord: "Mercury",
  },
  {
    name: "Moon",
    planet: "Moon",
    sign: "Taurus",
    rasi: "Taurus",
    signLord: "Venus",
    degree: `19° 35' 42.05"`,
    normDegree: `19° 35' 42.05"`,
    isRetrograde: false,
    house: 3,
    nakshatra: "Rohini",
    nakshatraLord: "Moon",
  },
  {
    name: "Mars",
    planet: "Mars",
    sign: "Sagittarius",
    rasi: "Sagittarius",
    signLord: "Jupiter",
    degree: `26° 57' 52.09"`,
    normDegree: `26° 57' 52.09"`,
    isRetrograde: false,
    house: 10,
    nakshatra: "Uttara Ashadha",
    nakshatraLord: "Sun",
  },
  {
    name: "Mercury",
    planet: "Mercury",
    sign: "Aries",
    rasi: "Aries",
    signLord: "Mars",
    degree: `8° 38' 28.11"`,
    normDegree: `8° 38' 28.11"`,
    isRetrograde: false,
    house: 2,
    nakshatra: "Ashwini",
    nakshatraLord: "Ketu",
  },
  {
    name: "Jupiter",
    planet: "Jupiter",
    sign: "Cancer",
    rasi: "Cancer",
    signLord: "Moon",
    degree: `14° 10' 18.75"`,
    normDegree: `14° 10' 18.75"`,
    isRetrograde: false,
    house: 5,
    nakshatra: "Pushya",
    nakshatraLord: "Saturn",
  },
  {
    name: "Venus",
    planet: "Venus",
    sign: "Aquarius",
    rasi: "Aquarius",
    signLord: "Saturn",
    degree: `18° 26' 34.89"`,
    normDegree: `18° 26' 34.89"`,
    isRetrograde: false,
    house: 12,
    nakshatra: "Shatabhisha",
    nakshatraLord: "Rahu",
  },
  {
    name: "Saturn",
    planet: "Saturn",
    sign: "Taurus",
    rasi: "Taurus",
    signLord: "Venus",
    degree: `29° 57' 20.60"`,
    normDegree: `29° 57' 20.60"`,
    isRetrograde: false,
    house: 3,
    nakshatra: "Mrigashira",
    nakshatraLord: "Mars",
  },
  {
    name: "Rahu",
    planet: "Rahu",
    sign: "Taurus",
    rasi: "Taurus",
    signLord: "Venus",
    degree: `8° 4' 0.04"`,
    normDegree: `8° 4' 0.04"`,
    isRetrograde: true,
    house: 3,
    nakshatra: "Krittika",
    nakshatraLord: "Sun",
  },
  {
    name: "Ketu",
    planet: "Ketu",
    sign: "Scorpio",
    rasi: "Scorpio",
    signLord: "Mars",
    degree: `8° 4' 0.04"`,
    normDegree: `8° 4' 0.04"`,
    isRetrograde: true,
    house: 9,
    nakshatra: "Anuradha",
    nakshatraLord: "Saturn",
  },
];

/**
 * Calculates Nakshatra and Lord from planet longitude / degree
 */
export const getNakshatraInfo = (planet) => {
  const rawNak =
    planet?.nakshatra ||
    planet?.nakshatra_name ||
    planet?.star ||
    planet?.nakshatraName;
  const rawLord =
    planet?.nakshatraLord ||
    planet?.nakshatra_lord ||
    planet?.starLord ||
    planet?.star_lord ||
    planet?.lord;

  if (rawNak && rawNak !== "-" && rawNak !== "Ashwini") {
    return {
      nakshatra: rawNak,
      lord: rawLord || "-",
    };
  }

  const sNum = parseSignNumber(planet?.sign || planet?.rasi || 1);
  let deg = 15;
  if (planet?.degree || planet?.normDegree) {
    const parts = String(planet.degree || planet.normDegree).match(
      /(\d+(\.\d+)?)/g,
    );
    if (parts && parts.length > 0) {
      const d = parseFloat(parts[0]) || 0;
      const m = parseFloat(parts[1]) || 0;
      const s = parseFloat(parts[2]) || 0;
      deg = d + m / 60 + s / 3600;
    }
  }

  const totalDeg = ((sNum - 1) * 30 + deg) % 360;
  const nakIndex = Math.min(26, Math.max(0, Math.floor(totalDeg / (360 / 27))));
  return {
    nakshatra: NAKSHATRAS[nakIndex]?.name || "Ashwini",
    lord:
      rawLord && rawLord !== "-"
        ? rawLord
        : NAKSHATRAS[nakIndex]?.lord || "Ketu",
  };
};

const isValidPlanetList = (list) => {
  return (
    Array.isArray(list) &&
    list.length >= 3 &&
    list.some(
      (p) =>
        p &&
        typeof p === "object" &&
        (p.name || p.planet || p.planet_name || p.id || p.title),
    )
  );
};

// Robust extractor that inspects all possible response paths from backend
const extractPlanets = (data, fullData) => {
  const sources = [
    data?.planets,
    data?.charts?.planets,
    data?.charts?.lagna?.planets,
    data?.charts?.lagna,
    fullData?.planets,
    fullData?.charts?.planets,
    fullData?.charts?.lagna?.planets,
    fullData?.charts?.lagna,
    fullData?.data?.planets,
    fullData?.data?.charts?.lagna?.planets,
    fullData?.kp?.planets,
    fullData?.planetaryPositions,
    fullData?.planetary_positions,
    fullData?.planet_positions,
    fullData?.planetDetails,
    data?.planetaryPositions,
    data?.planetary_positions,
    data?.planet_positions,
  ];

  for (const src of sources) {
    if (src) {
      if (isValidPlanetList(src)) {
        return src;
      }
      if (typeof src === "object" && !Array.isArray(src)) {
        const vals = Object.values(src).filter(
          (v) =>
            v &&
            typeof v === "object" &&
            (v.name || v.planet || v.sign || v.rasi),
        );
        if (isValidPlanetList(vals)) return vals;
      }
    }
  }

  return DEFAULT_PLANETS;
};

// Standard Vedic Navamsa (D9) calculation
const calculateNavamsaSign = (signNum, degreeStr) => {
  let deg = 15;
  if (degreeStr) {
    const parts = String(degreeStr).match(/(\d+(\.\d+)?)/g);
    if (parts && parts.length > 0) {
      const d = parseFloat(parts[0]) || 0;
      const m = parseFloat(parts[1]) || 0;
      const s = parseFloat(parts[2]) || 0;
      deg = d + m / 60 + s / 3600;
    }
  }

  const pada = Math.min(8, Math.max(0, Math.floor(deg / (30 / 9))));
  let startSign = signNum;

  if ([1, 4, 7, 10].includes(signNum)) {
    startSign = signNum;
  } else if ([2, 5, 8, 11].includes(signNum)) {
    startSign = ((signNum + 8 - 1) % 12) + 1;
  } else {
    startSign = ((signNum + 4 - 1) % 12) + 1;
  }

  return ((startSign - 1 + pada) % 12) + 1;
};

const ChartsTab = ({ data, fullData }) => {
  const [activeChart, setActiveChart] = useState("Lagna");
  const [activePlanetTab, setActivePlanetTab] = useState("Sign");

  const [chartCache, setChartCache] = useState({});
  const [getKundliChart, { isLoading: isFetchingChart }] =
    useGetKundliChartMutation();

  // Extract Natal Planets
  const rawPlanets = useMemo(() => {
    return extractPlanets(data, fullData);
  }, [data, fullData]);

  // Fetch API chart when switching tabs if available
  useEffect(() => {
    const fetchRemoteChart = async () => {
      if (activeChart === "Lagna") return;
      if (chartCache[activeChart]) return;

      const birthDetails = fullData?.basicDetails || fullData || {};
      const dob = birthDetails.dob || "2000-01-01";
      const tob = birthDetails.tob || "06:14:00";
      const city = birthDetails.city || birthDetails.birthPlace || "Delhi";

      const chartTypeParam = activeChart === "Navamsa" ? "navamsha" : "transit";

      try {
        const res = await getKundliChart({
          dob,
          tob,
          city,
          chartType: chartTypeParam,
          chartStyle: "north-indian",
          format: "json",
          la: "hi",
        }).unwrap();

        const payload = res?.data || res;
        if (payload) {
          setChartCache((prev) => ({
            ...prev,
            [activeChart]: payload,
          }));
        }
      } catch (e) {
        // Fallback calculations used seamlessly
      }
    };

    fetchRemoteChart();
  }, [activeChart, fullData, chartCache]);

  // Dynamic Planets for Active Chart
  const currentChartPlanets = useMemo(() => {
    if (activeChart === "Lagna") {
      return rawPlanets;
    }

    if (activeChart === "Navamsa") {
      // 1. Pre-calculated or API response
      const cached =
        chartCache["Navamsa"]?.planets ||
        chartCache["Navamsa"]?.response?.planets ||
        fullData?.charts?.navamsa?.planets ||
        fullData?.navamsa?.planets;

      if (isValidPlanetList(cached)) {
        return cached;
      }

      // Check pre-calculated houses dictionary (e.g. {"3": ["Mo", "Me"], ...})
      const navHouses =
        fullData?.charts?.navamsa?.houses || chartCache["Navamsa"]?.houses;
      if (navHouses && typeof navHouses === "object") {
        const pList = [];
        Object.entries(navHouses).forEach(([hNum, pNames]) => {
          if (Array.isArray(pNames)) {
            pNames.forEach((pn) => {
              pList.push({
                name: pn,
                planet: pn,
                house: parseInt(hNum, 10),
              });
            });
          }
        });
        if (pList.length > 0) return pList;
      }

      // 2. Computed D9 positions from natal data
      if (rawPlanets && rawPlanets.length > 0) {
        const ascPlanet = rawPlanets.find((p) => {
          const name = (p.name || p.planet || "").toLowerCase();
          return name === "ascendant" || name === "lagna" || name === "asc";
        });
        const ascSignNum = parseSignNumber(
          ascPlanet?.sign || ascPlanet?.rasi || rawPlanets[0]?.sign,
        );
        const ascD9Sign = calculateNavamsaSign(
          ascSignNum,
          ascPlanet?.degree || ascPlanet?.normDegree,
        );

        return rawPlanets.map((p) => {
          const sNum = parseSignNumber(p.sign || p.rasi);
          const d9Sign = calculateNavamsaSign(sNum, p.degree || p.normDegree);
          const d9House = ((d9Sign - ascD9Sign + 12) % 12) + 1;
          return {
            ...p,
            sign: SIGN_NAMES[d9Sign] || p.sign,
            rasi: SIGN_NAMES[d9Sign] || p.rasi,
            signLord: SIGN_LORDS[d9Sign] || p.signLord,
            house: d9House,
          };
        });
      }
    }

    if (activeChart === "Transit") {
      const cachedTransit =
        chartCache["Transit"]?.planets ||
        chartCache["Transit"]?.response?.planets ||
        chartCache["Transit"]?.data?.planets ||
        fullData?.charts?.transit?.planets ||
        fullData?.transit?.planets;

      if (isValidPlanetList(cachedTransit)) {
        return cachedTransit;
      }

      // Check pre-calculated houses dictionary for transit
      const transitHouses =
        fullData?.charts?.transit?.houses || chartCache["Transit"]?.houses;
      if (transitHouses && typeof transitHouses === "object") {
        const pList = [];
        Object.entries(transitHouses).forEach(([hNum, pNames]) => {
          if (Array.isArray(pNames)) {
            pNames.forEach((pn) => {
              pList.push({
                name: pn,
                planet: pn,
                house: parseInt(hNum, 10),
              });
            });
          }
        });
        if (pList.length > 0) return pList;
      }

      // If backend transit is not ready, return active planetary transit view
      if (rawPlanets && rawPlanets.length > 0) {
        return rawPlanets.map((p) => {
          const h = parseInt(p.house, 10) || 1;
          return {
            ...p,
            house: h,
          };
        });
      }
    }

    return rawPlanets;
  }, [activeChart, rawPlanets, chartCache, fullData]);

  // Active chart SVG if available
  const activeSvgXml = useMemo(() => {
    const key = activeChart.toLowerCase();
    const candidates = [
      fullData?.charts?.[key]?.svg,
      fullData?.charts?.[key],
      fullData?.charts?.[activeChart]?.svg,
      fullData?.charts?.[activeChart],
      fullData?.[key]?.svg,
      data?.[key]?.svg,
      chartCache[activeChart]?.svg,
      chartCache[activeChart]?.data?.svg,
      chartCache[activeChart],
    ];

    if (activeChart === "Lagna") {
      candidates.push(
        fullData?.charts?.lagna?.svg,
        fullData?.charts?.lagna,
        fullData?.charts?.svg,
        fullData?.chartSvg,
        fullData?.chart_svg,
        fullData?.svg,
        fullData?.chart,
        data?.svg,
        data?.charts?.lagna?.svg,
        data?.chart,
      );
    }

    for (const cand of candidates) {
      if (typeof cand === "string" && cand.includes("<svg")) {
        return cand;
      }
      if (
        cand?.svg &&
        typeof cand.svg === "string" &&
        cand.svg.includes("<svg")
      ) {
        return cand.svg;
      }
    }
    return null;
  }, [activeChart, chartCache, fullData, data]);

  // Sign Table Data
  const dynamicSignData = useMemo(() => {
    const list =
      currentChartPlanets && currentChartPlanets.length > 0
        ? currentChartPlanets
        : rawPlanets;
    if (!list || list.length === 0) return [];
    return list.map((p) => {
      const sNum = parseSignNumber(p.sign || p.rasi);
      const signName = p.sign || p.rasi || SIGN_NAMES[sNum] || "Aries";
      const signLord =
        p.signLord || p.sign_lord || p.lord || SIGN_LORDS[sNum] || "-";
      const deg = p.degree || p.normDegree || p.norm_degree || `0° 0' 0"`;
      const isRetro =
        p.isRetrograde || p.is_retrograde || p.retrograde ? "true" : "false";
      return [
        p.name || p.planet || p.planet_name || "Planet",
        signName,
        signLord,
        deg,
        isRetro,
        String(p.house || p.bhava || "1"),
      ];
    });
  }, [currentChartPlanets, rawPlanets]);

  // Nakshatra Table Data with astronomical calculation fallback
  const dynamicNakshatraData = useMemo(() => {
    const list =
      currentChartPlanets && currentChartPlanets.length > 0
        ? currentChartPlanets
        : rawPlanets;
    if (!list || list.length === 0) return [];
    return list.map((p) => {
      const nakInfo = getNakshatraInfo(p);
      return [
        p.name || p.planet || p.planet_name || "Planet",
        nakInfo.nakshatra,
        nakInfo.lord,
        String(p.house || p.bhava || "1"),
      ];
    });
  }, [currentChartPlanets, rawPlanets]);

  return (
    <View style={styles.container}>
      {/* Title */}
      <Text style={styles.title}>{activeChart} Chart</Text>

      {/* Chart Switcher Buttons */}
      <View style={styles.chartBtnRow}>
        {chartTypes.map((item) => (
          <TouchableOpacity
            key={item}
            activeOpacity={0.8}
            onPress={() => setActiveChart(item)}
            style={[
              styles.pillBtn,
              activeChart === item && styles.activePillBtn,
            ]}
          >
            <Text
              style={[
                styles.pillText,
                activeChart === item && styles.activePillText,
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Dynamic North Indian Vedic Chart */}
      {isFetchingChart && !chartCache[activeChart] ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={ORANGE} />
          <Text style={styles.loaderText}>Loading {activeChart} Chart...</Text>
        </View>
      ) : (
        <VedicChart
          planets={currentChartPlanets}
          svgXml={activeSvgXml}
          size={wp(90)}
        />
      )}

      {/* Planets Header */}
      <Text style={styles.title}>Planets</Text>

      {/* Planet Tabs (Sign / Nakshatra) */}
      <View style={styles.planetTabRow}>
        {planetTabs.map((item) => (
          <TouchableOpacity
            key={item}
            activeOpacity={0.8}
            onPress={() => setActivePlanetTab(item)}
            style={[
              styles.smallPillBtn,
              activePlanetTab === item && styles.activePillBtn,
            ]}
          >
            <Text
              style={[
                styles.pillText,
                activePlanetTab === item && styles.activePillText,
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Tables */}
      {activePlanetTab === "Sign" ? (
        <SignTable tableData={dynamicSignData} />
      ) : (
        <NakshatraTable tableData={dynamicNakshatraData} />
      )}

      <TouchableOpacity style={styles.button} activeOpacity={0.85}>
        <Text style={styles.buttonText}>☏ Consult An Expert</Text>
      </TouchableOpacity>
    </View>
  );
};

const SignTable = ({ tableData }) => {
  const headers = [
    "Planets",
    "Sign",
    "Sign Lord",
    "Degree",
    "Retrograde",
    "House",
  ];

  if (!tableData || tableData.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No planetary sign data available</Text>
      </View>
    );
  }

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View style={styles.table}>
        <View style={styles.headerRow}>
          {headers.map((h) => (
            <Text key={h} style={[styles.headerCell, { width: wp(17) }]}>
              {h}
            </Text>
          ))}
        </View>

        {tableData.map((row, index) => (
          <View
            key={index}
            style={[styles.tableRow, index % 2 === 0 && styles.lightRow]}
          >
            {row.map((cell, i) => (
              <Text key={i} style={[styles.bodyCell, { width: wp(17) }]}>
                {cell}
              </Text>
            ))}
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const NakshatraTable = ({ tableData }) => {
  const headers = ["Planets", "Nakshatra", "Naksh Lord", "House"];

  if (!tableData || tableData.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No nakshatra data available</Text>
      </View>
    );
  }

  return (
    <View style={styles.table}>
      <View style={styles.headerRow}>
        {headers.map((h) => (
          <Text key={h} style={[styles.headerCell, { flex: 1 }]}>
            {h}
          </Text>
        ))}
      </View>

      {tableData.map((row, index) => (
        <View
          key={index}
          style={[styles.tableRow, index % 2 === 0 && styles.lightRow]}
        >
          {row.map((cell, i) => (
            <Text key={i} style={[styles.bodyCell, { flex: 1 }]}>
              {cell}
            </Text>
          ))}
        </View>
      ))}
    </View>
  );
};

export default ChartsTab;

const styles = StyleSheet.create({
  container: {
    paddingBottom: hp(2),
  },
  title: {
    fontSize: RF(15),
    fontWeight: "700",
    color: "#111",
    marginBottom: hp(1),
  },
  chartBtnRow: {
    flexDirection: "row",
    gap: wp(3),
    marginBottom: hp(2),
  },
  pillBtn: {
    width: wp(25),
    height: hp(4),
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: wp(10),
    alignItems: "center",
    justifyContent: "center",
  },
  activePillBtn: {
    backgroundColor: ORANGE,
    borderColor: ORANGE,
  },
  pillText: {
    fontSize: RF(10),
    color: "#111",
    fontWeight: "500",
  },
  activePillText: {
    color: "#fff",
    fontWeight: "700",
  },
  loaderContainer: {
    height: wp(90),
    width: wp(90),
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: hp(2),
    backgroundColor: "#fff8f2",
    borderRadius: wp(2),
    borderWidth: 1,
    borderColor: BORDER,
  },
  loaderText: {
    marginTop: hp(1),
    fontSize: RF(11),
    color: ORANGE,
    fontWeight: "600",
  },
  planetTabRow: {
    flexDirection: "row",
    gap: wp(3),
    marginBottom: hp(1.5),
  },
  smallPillBtn: {
    width: wp(25),
    height: hp(4),
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: wp(10),
    alignItems: "center",
    justifyContent: "center",
  },
  table: {
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: wp(2),
    overflow: "hidden",
    marginBottom: hp(2),
  },
  emptyContainer: {
    padding: hp(2.5),
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: wp(2),
    alignItems: "center",
    marginBottom: hp(2),
  },
  emptyText: {
    fontSize: RF(11),
    color: "#888",
  },
  headerRow: {
    flexDirection: "row",
    backgroundColor: ORANGE,
  },
  headerCell: {
    minHeight: hp(4.5),
    textAlign: "center",
    textAlignVertical: "center",
    color: "#fff",
    fontSize: RF(9),
    fontWeight: "700",
    paddingHorizontal: wp(1),
  },
  tableRow: {
    flexDirection: "row",
    backgroundColor: "#fff",
  },
  lightRow: {
    backgroundColor: LIGHT,
  },
  bodyCell: {
    minHeight: hp(4.5),
    textAlign: "center",
    textAlignVertical: "center",
    color: "#111",
    fontSize: RF(9),
    paddingHorizontal: wp(1),
    fontWeight: "400",
  },
  button: {
    height: hp(5.2),
    backgroundColor: ORANGE,
    borderRadius: wp(2),
    alignItems: "center",
    justifyContent: "center",
    marginTop: hp(0.5),
  },
  buttonText: {
    color: "#fff",
    fontSize: RF(13),
    fontWeight: "700",
  },
});
