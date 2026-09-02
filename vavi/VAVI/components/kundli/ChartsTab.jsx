import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";import { hp, RF, wp } from "../../utils/responsive";

const ORANGE = "#ff5a00";
const BORDER = "#ff8a50";
const LIGHT = "#fff4df";

const chartTypes = ["Lagna", "Navamsa", "Transit"];
const planetTabs = ["Sign", "Nakshatra"];

const chartLines = [
  { x1: "0%", y1: "0%", x2: "50%", y2: "50%" },
  { x1: "50%", y1: "50%", x2: "100%", y2: "0%" },
  { x1: "0%", y1: "100%", x2: "50%", y2: "50%" },
  { x1: "50%", y1: "50%", x2: "100%", y2: "100%" },
];

const signData = [
  ["Ascendant", "Pisces", "Jupiter", `24° 29' 17.4"`, "false", "1"],
  ["Sun", "Pisces", "Jupiter", `22° 54' 6.14"`, "false", "1"],
  ["Moon", "Taurus", "Venus", `19° 35' 42.05"`, "false", "3"],
  ["Mars", "Sagittarius", "Jupiter", `26° 57' 52.09"`, "false", "10"],
  ["Mercury", "Aries", "Mars", `8° 38' 28.11"`, "false", "2"],
  ["Jupiter", "Cancer", "Moon", `14° 10' 18.75"`, "false", "5"],
  ["Venus", "Aquarius", "Saturn", `18° 26' 34.89"`, "false", "12"],
  ["Saturn", "Taurus", "Venus", `29° 57' 20.60"`, "false", "3"],
  ["Rahu", "Taurus", "Venus", `8° 4' 0.04"`, "true", "3"],
];

const nakshatraData = [
  ["Ascendant", "Revati", "Mercury", "1"],
  ["Sun", "Revati", "Mercury", "1"],
  ["Moon", "Rohini", "Moon", "3"],
  ["Mars", "UttroShadha", "Sun", "10"],
  ["Mercury", "Ashwini", "Ketu", "2"],
  ["Jupiter", "Pushya", "Saturn", "5"],
  ["Venus", "Shatabhisha", "Rahu", "12"],
  ["Saturn", "Mrigashira", "Mars", "3"],
  ["Rahu", "Krittika", "Sun", "3"],
  ["Ketu", "Anuradha", "Saturn", "9"],
];

const ChartsTab = () => {
  const [activeChart, setActiveChart] = useState("Lagna");
  const [activePlanetTab, setActivePlanetTab] = useState("Sign");

  return (
    <View>
      <Text style={styles.title}>Lagna Chart</Text>

      <View style={styles.chartBtnRow}>
        {chartTypes.map((item) => (
          <TouchableOpacity
            key={item}
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

      <View style={styles.chartBox}>
        <View style={[styles.diagonal, styles.d1]} />
        <View style={[styles.diagonal, styles.d2]} />
        <View style={[styles.diagonal, styles.d3]} />
        <View style={[styles.diagonal, styles.d4]} />

        <Text style={[styles.planetText, { top: hp(2), left: wp(2) }]}>Mo</Text>
        <Text style={[styles.planetText, { top: hp(2), left: wp(15) }]}>
          Me
        </Text>
        <Text style={[styles.planetText, { top: hp(2), right: wp(10) }]}>
          Ve
        </Text>

        <Text style={[styles.planetText, { top: hp(8), left: wp(2) }]}>Ra</Text>
        <Text style={[styles.planetText, { top: hp(8), left: wp(8) }]}>Sa</Text>

        <Text style={[styles.planetText, { top: hp(7), left: wp(36) }]}>
          As
        </Text>
        <Text style={[styles.planetText, { top: hp(7), left: wp(48) }]}>
          Su
        </Text>

        <Text style={[styles.planetText, { top: hp(25), left: wp(3) }]}>
          Ju
        </Text>
        <Text style={[styles.planetText, { top: hp(25), right: wp(14) }]}>
          Ma
        </Text>
        <Text style={[styles.planetText, { top: hp(25), right: wp(3) }]}>
          Ke
        </Text>

        {[
          ["1", "25%", "18%"],
          ["2", "20%", "25%"],
          ["3", "45%", "49%"],
          ["4", "20%", "76%"],
          ["5", "25%", "82%"],
          ["6", "48%", "55%"],
          ["7", "78%", "82%"],
          ["8", "83%", "76%"],
          ["9", "55%", "49%"],
          ["10", "82%", "25%"],
          ["11", "78%", "18%"],
          ["12", "48%", "43%"],
        ].map(([num, left, top]) => (
          <Text key={num} style={[styles.numText, { left, top }]}>
            {num}
          </Text>
        ))}
      </View>

      <Text style={styles.title}>Planets</Text>

      <View style={styles.planetTabRow}>
        {planetTabs.map((item) => (
          <TouchableOpacity
            key={item}
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

      {activePlanetTab === "Sign" ? <SignTable /> : <NakshatraTable />}

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>☏ Consult An Expert</Text>
      </TouchableOpacity>
    </View>
  );
};

const SignTable = () => {
  const headers = [
    "Planets",
    "Sign",
    "Sign Lord",
    "Degree",
    "Retrograde",
    "House",
  ];

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

        {signData.map((row, index) => (
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

const NakshatraTable = () => {
  const headers = ["Planets", "Nakshatra", "Naksh Lord", "House"];

  return (
    <View style={styles.table}>
      <View style={styles.headerRow}>
        {headers.map((h) => (
          <Text key={h} style={[styles.headerCell, { flex: 1 }]}>
            {h}
          </Text>
        ))}
      </View>

      {nakshatraData.map((row, index) => (
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
  },
  chartBox: {
    width: "100%",
    height: hp(34),
    borderWidth: 1.2,
    borderColor: ORANGE,
    marginBottom: hp(2),
    position: "relative",
    overflow: "hidden",
  },
  diagonal: {
    position: "absolute",
    width: "71%",
    height: 1,
    backgroundColor: ORANGE,
    left: "14.5%",
    top: "50%",
  },
  d1: {
    transform: [{ rotate: "45deg" }],
  },
  d2: {
    transform: [{ rotate: "-45deg" }],
  },
  d3: {
    top: "0%",
    left: "-35%",
    width: "100%",
    transform: [{ rotate: "45deg" }],
  },
  d4: {
    top: "0%",
    left: "35%",
    width: "100%",
    transform: [{ rotate: "-45deg" }],
  },
  planetText: {
    position: "absolute",
    fontSize: RF(13),
    fontWeight: "700",
    color: "#111",
  },
  numText: {
    position: "absolute",
    fontSize: RF(14),
    color: ORANGE,
    fontWeight: "700",
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
