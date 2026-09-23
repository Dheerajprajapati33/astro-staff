import React, { useMemo, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Svg, { Line, Rect, Text as SvgText } from "react-native-svg";
import { hp, RF, wp } from "../../utils/responsive";
import { parseSignNumber } from "./VedicChart";

const ORANGE = "#ff5a00";
const BORDER = "#ff8a50";
const GREEN = "#0b6b1c";

const tabs = [
  "Sarv",
  "Sun",
  "Moon",
  "Mars",
  "Mercury",
  "Jupiter",
  "Venus",
  "Saturn",
];

const defaultScores = [28, 26, 27, 35, 30, 36, 25, 20, 28, 29, 27, 33];

// Layout coordinates for Ashtakvarga houses in 400x400 North Indian Chart
const ASHTAK_COORDINATES = {
  1: { signX: 200, signY: 165, scoreX: 200, scoreY: 80 },
  2: { signX: 130, signY: 70, scoreX: 75, scoreY: 40 },
  3: { signX: 70, signY: 130, scoreX: 35, scoreY: 75 },
  4: { signX: 165, signY: 200, scoreX: 85, scoreY: 200 },
  5: { signX: 70, signY: 270, scoreX: 35, scoreY: 325 },
  6: { signX: 130, signY: 330, scoreX: 75, scoreY: 360 },
  7: { signX: 200, signY: 235, scoreX: 200, scoreY: 320 },
  8: { signX: 270, signY: 330, scoreX: 325, scoreY: 360 },
  9: { signX: 330, signY: 270, scoreX: 365, scoreY: 325 },
  10: { signX: 235, signY: 200, scoreX: 315, scoreY: 200 },
  11: { signX: 330, signY: 130, scoreX: 365, scoreY: 75 },
  12: { signX: 270, signY: 70, scoreX: 325, scoreY: 40 },
};

const ACTab = ({ data, fullData }) => {
  const [active, setActive] = useState("Sarv");

  // Determine Lagna Sign
  const lagnaSign = useMemo(() => {
    const ascSign =
      fullData?.basic?.ascendant ||
      fullData?.ascendant ||
      fullData?.avakhada?.sign ||
      fullData?.planets?.find?.(
        (p) =>
          (p.name || p.planet || "").toLowerCase() === "ascendant" ||
          (p.name || p.planet || "").toLowerCase() === "lagna",
      )?.sign;
    return parseSignNumber(ascSign || 1);
  }, [fullData]);

  const scores = useMemo(() => {
    const actKey = active.toLowerCase();
    const ashtakObj = fullData?.ashtakvarga || data || {};

    // 1. If looking for Sarvashtakvarga
    if (actKey === "sarv") {
      const chartValues = ashtakObj?.chart?.values || ashtakObj?.values;
      if (Array.isArray(chartValues) && chartValues.length >= 12) {
        return chartValues.map((item) =>
          typeof item === "object" ? (item.score ?? item.value ?? 0) : item,
        );
      }
      const rawSarv =
        ashtakObj?.sarvashtakavarga ||
        ashtakObj?.sarvashtakvarga ||
        ashtakObj?.sarv ||
        ashtakObj?.total ||
        ashtakObj?.scores;
      if (Array.isArray(rawSarv) && rawSarv.length >= 12) {
        return rawSarv.map((s) =>
          typeof s === "object" ? (s.score ?? s.value ?? 0) : s,
        );
      }
    }

    // 2. Specific planet ashtakvarga
    const planetScores =
      ashtakObj?.[actKey] ||
      ashtakObj?.planets?.[actKey] ||
      ashtakObj?.chart?.[actKey] ||
      data?.[actKey];

    if (Array.isArray(planetScores) && planetScores.length >= 12) {
      return planetScores.map((s) =>
        typeof s === "object" ? (s.score ?? s.value ?? 0) : s,
      );
    }
    if (planetScores && typeof planetScores === "object") {
      const vals = Object.values(planetScores).map((s) =>
        typeof s === "object" ? (s.score ?? s.value ?? 0) : s,
      );
      if (vals.length >= 12) return vals;
    }

    // 3. Fallback to chart values
    const chartVals = ashtakObj?.chart?.values || ashtakObj?.values;
    if (Array.isArray(chartVals) && chartVals.length >= 12) {
      return chartVals.map((item) =>
        typeof item === "object" ? (item.score ?? item.value ?? 0) : item,
      );
    }

    return defaultScores;
  }, [data, fullData, active]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ashtakvarga Chart</Text>

      {/* Planet Selection Pills */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.pillScroll}
      >
        <View style={styles.pillRow}>
          {tabs.map((item) => (
            <TouchableOpacity
              key={item}
              onPress={() => setActive(item)}
              style={[styles.pill, active === item && styles.activePill]}
            >
              <Text
                style={[styles.pillText, active === item && styles.activeText]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Ashtakvarga SVG Chart */}
      <View style={styles.chartWrapper}>
        <Svg width="100%" height="100%" viewBox="0 0 400 400">
          <Rect
            x="1"
            y="1"
            width="398"
            height="398"
            fill="#fff"
            stroke={ORANGE}
            strokeWidth="2.5"
          />

          <Line
            x1="0"
            y1="0"
            x2="400"
            y2="400"
            stroke={ORANGE}
            strokeWidth="1.8"
          />
          <Line
            x1="0"
            y1="400"
            x2="400"
            y2="0"
            stroke={ORANGE}
            strokeWidth="1.8"
          />

          <Line
            x1="200"
            y1="0"
            x2="0"
            y2="200"
            stroke={ORANGE}
            strokeWidth="1.8"
          />
          <Line
            x1="0"
            y1="200"
            x2="200"
            y2="400"
            stroke={ORANGE}
            strokeWidth="1.8"
          />
          <Line
            x1="200"
            y1="400"
            x2="400"
            y2="200"
            stroke={ORANGE}
            strokeWidth="1.8"
          />
          <Line
            x1="400"
            y1="200"
            x2="200"
            y2="0"
            stroke={ORANGE}
            strokeWidth="1.8"
          />

          {Array.from({ length: 12 }, (_, i) => i + 1).map((houseNum) => {
            const coords = ASHTAK_COORDINATES[houseNum];
            const signNum = ((lagnaSign - 1 + (houseNum - 1)) % 12) + 1;
            const scoreVal = scores[houseNum - 1] ?? "-";

            return (
              <React.Fragment key={houseNum}>
                {/* Zodiac Sign Number */}
                <SvgText
                  x={coords.signX}
                  y={coords.signY}
                  fill={ORANGE}
                  fontSize="15"
                  fontWeight="bold"
                  textAnchor="middle"
                  alignmentBaseline="middle"
                >
                  {signNum}
                </SvgText>

                {/* Ashtakvarga Score */}
                <SvgText
                  x={coords.scoreX}
                  y={coords.scoreY}
                  fill={GREEN}
                  fontSize="20"
                  fontWeight="bold"
                  textAnchor="middle"
                  alignmentBaseline="middle"
                >
                  {scoreVal}
                </SvgText>
              </React.Fragment>
            );
          })}
        </Svg>
      </View>

      <Text style={styles.desc}>
        Ashtakvarga is a Vedic mathematical method used to evaluate the strength
        and patterns within a birth chart. It assigns numerical scores (bindus)
        to each house based on beneficial planetary transits.
      </Text>

      <TouchableOpacity style={styles.button} activeOpacity={0.85}>
        <Text style={styles.buttonText}>☏ Consult An Expert</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ACTab;

const styles = StyleSheet.create({
  container: {
    paddingBottom: hp(2),
  },
  title: {
    fontSize: RF(16),
    fontWeight: "700",
    color: "#111",
    marginBottom: hp(1.5),
  },
  pillScroll: {
    marginBottom: hp(2),
  },
  pillRow: {
    flexDirection: "row",
    gap: wp(2),
  },
  pill: {
    height: hp(3.8),
    minWidth: wp(16),
    paddingHorizontal: wp(3),
    borderRadius: wp(10),
    borderWidth: 1,
    borderColor: BORDER,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  activePill: {
    backgroundColor: ORANGE,
    borderColor: ORANGE,
  },
  pillText: {
    fontSize: RF(10.5),
    color: "#111",
    fontWeight: "500",
  },
  activeText: {
    color: "#fff",
    fontWeight: "700",
  },
  chartWrapper: {
    width: wp(90),
    height: wp(90),
    alignSelf: "center",
    marginBottom: hp(2),
    backgroundColor: "#fff",
  },
  desc: {
    fontSize: RF(11.5),
    color: "#333",
    lineHeight: hp(2.3),
    marginBottom: hp(2),
    fontWeight: "400",
  },
  button: {
    height: hp(5.4),
    backgroundColor: ORANGE,
    borderRadius: wp(2),
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: RF(13),
    fontWeight: "700",
  },
});
