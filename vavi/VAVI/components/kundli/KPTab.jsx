import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";import { hp, RF, wp } from "../../utils/responsive";

const ORANGE = "#ff5a00";
const BORDER = "#ff8a50";
const LIGHT = "#fff8ef";

const planetData = [
  ["Ascendant", "1", "Pisces", "Jupiter", "Rahu", "Jupiter"],
  ["Sun", "12", "Pisces", "Jupiter", "Moon", "Mercury"],
  ["Moon", "2", "Taurus", "Venus", "Mercury", "Saturn"],
  ["Mars", "10", "Sagittarius", "Jupiter", "Sun", "Jupiter"],
  ["Mercury", "1", "Aries", "Mars", "Jupiter", "Venus"],
  ["Jupiter", "5", "Cancer", "Moon", "Rahu", "Ketu"],
  ["Venus", "12", "Aquarius", "Saturn", "Moon", "Jupiter"],
  ["Saturn", "3", "Gemini", "Mercury", "Saturn", "Jupiter"],
  ["Rahu", "2", "Taurus", "Venus", "Venus", "Venus"],
  ["Ketu", "8", "Scorpio", "Mars", "Ketu", "Mercury"],
];

const cuspsData = [
  ["1", `9° 24' 10.68"`, "Aries", "Mars", "Rahu", "Bharani", "Venus"],
  ["2", `9° 40' 48.96"`, "Taurus", "Venus", "Mercury", "Mrigashira", "Mars"],
  ["3", `6° 32' 32.52"`, "Gemini", "Mercury", "Rahu", "Ardra", "Rahu"],
  ["4", `0° 47' 37.20"`, "Cancer", "Moon", "Sun", "Pushya", "Saturn"],
  ["5", `26° 43' 27.72"`, "Leo", "Sun", "Rahu", "Magha", "Ketu"],
  ["6", `26° 57' 23.16"`, "Virgo", "Mercury", "Saturn", "Chitra", "Mars"],
  ["7", `9° 24' 10.68"`, "Libra", "Venus", "Rahu", "Vishakha", "Jupiter"],
  ["8", `9° 40' 48.96"`, "Scorpio", "Mars", "Mercury", "Jyeshtha", "Mercury"],
  [
    "9",
    `6° 32' 32.52"`,
    "Sagittarius",
    "Jupiter",
    "Rahu",
    "PurvaShadha",
    "Venus",
  ],
];

const KPTab = () => {
  return (
    <View>
      <Text style={styles.title}>Planets</Text>

      <KPTable
        headers={[
          "Planets",
          "Cusp",
          "Sign",
          "Sign Lord",
          "Star Lord",
          "Sub Lord",
        ]}
        data={planetData}
        cellWidth={wp(15.5)}
      />

      <Text style={styles.title}>Cusps</Text>

      <KPTable
        headers={[
          "Cusp",
          "Degree",
          "Sign",
          "Sign Lord",
          "Cusp Sub",
          "Nakshtra",
          "Naks Lord",
        ]}
        data={cuspsData}
        cellWidth={wp(16)}
      />

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>☏ Consult An Expert</Text>
      </TouchableOpacity>
    </View>
  );
};

const KPTable = ({ headers, data, cellWidth }) => {
  return (
    <View style={styles.tableWrapper}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.table}>
          <View style={styles.headerRow}>
            {headers.map((item, index) => (
              <Text
                key={index}
                style={[
                  styles.headerCell,
                  {
                    width: index === 0 ? cellWidth + wp(2) : cellWidth,
                  },
                ]}
              >
                {item}
              </Text>
            ))}
          </View>

          {data.map((row, rowIndex) => (
            <View
              key={rowIndex}
              style={[styles.row, rowIndex % 2 === 0 && styles.lightRow]}
            >
              {row.map((cell, cellIndex) => (
                <Text
                  key={cellIndex}
                  style={[
                    styles.bodyCell,
                    {
                      width: cellIndex === 0 ? cellWidth + wp(2) : cellWidth,
                    },
                  ]}
                >
                  {cell}
                </Text>
              ))}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default KPTab;

const styles = StyleSheet.create({
  title: {
    fontSize: RF(15),
    fontWeight: "700",
    color: "#111",
    marginBottom: hp(1),
  },
  tableWrapper: {
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: wp(2),
    overflow: "hidden",
    marginBottom: hp(2),
  },
  table: {
    backgroundColor: "#fff",
  },
  headerRow: {
    flexDirection: "row",
    backgroundColor: ORANGE,
  },
  headerCell: {
    minHeight: hp(5),
    color: "#fff",
    fontSize: RF(8.5),
    fontWeight: "700",
    textAlign: "center",
    textAlignVertical: "center",
    paddingHorizontal: wp(1),
    borderRightWidth: 0.5,
    borderRightColor: "#ff9b72",
  },
  row: {
    flexDirection: "row",
    backgroundColor: "#fff",
  },
  lightRow: {
    backgroundColor: LIGHT,
  },
  bodyCell: {
    minHeight: hp(5),
    color: "#111",
    fontSize: RF(8.5),
    textAlign: "center",
    textAlignVertical: "center",
    paddingHorizontal: wp(1),
    borderRightWidth: 0.5,
    borderRightColor: "#eee",
    borderBottomWidth: 0.5,
    borderBottomColor: "#eee",
    fontWeight: "400",
  },
  button: {
    height: hp(5.4),
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
