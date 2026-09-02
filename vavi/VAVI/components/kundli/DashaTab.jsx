import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";import { hp, RF, wp } from "../../utils/responsive";

const ORANGE = "#ff5a00";
const BORDER = "#ff8a50";
const LIGHT = "#fff8ef";

const dashaTabs = ["Major dasha", "Yogini"];

const majorData = [
  ["Moon", "Birth", "25-01-2006"],
  ["Mars", "25-01-2006", "24-01-2013"],
  ["Rahu", "24-01-2013", "25-01-2031"],
  ["Jupiter", "25-01-2031", "24-01-2047"],
  ["Saturn", "24-01-2047", "24-01-2066"],
  ["Mercury", "24-01-2066", "24-01-2083"],
  ["Ketu", "24-01-2083", "24-01-2090"],
  ["Venus", "24-01-2090", "25-01-2110"],
  ["Sun", "25-01-2110", "25-01-2116"],
];

const yoginiData = [
  ["Siddha", "Birth", "23-03-2005"],
  ["Sankata", "23-03-2005", "23-03-2013"],
  ["Mangala", "23-03-2013", "23-03-2014"],
  ["Pingala", "23-03-2014", "23-03-2016"],
  ["Dhanya", "23-03-2016", "23-03-2019"],
  ["Bhramari", "23-03-2019", "23-03-2023"],
  ["Bhadrika", "23-03-2023", "23-03-2028"],
  ["Ulka", "23-03-2028", "23-03-2034"],
  ["Siddha", "23-03-2034", "23-03-2041"],
  ["Sankata", "23-03-2041", "23-03-2049"],
  ["Mangala", "23-03-2049", "23-03-2050"],
  ["Pingala", "23-03-2050", "23-03-2052"],
];

const DashaTab = () => {
  const [activeTab, setActiveTab] = useState("Major dasha");

  const isYogini = activeTab === "Yogini";

  return (
    <View>
      <View style={styles.switchRow}>
        {dashaTabs.map((item) => (
          <TouchableOpacity
            key={item}
            onPress={() => setActiveTab(item)}
            activeOpacity={0.8}
            style={[
              styles.switchBtn,
              activeTab === item && styles.activeSwitchBtn,
            ]}
          >
            <Text
              style={[
                styles.switchText,
                activeTab === item && styles.activeSwitchText,
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {isYogini ? (
        <View style={styles.pathRow}>
          <Text style={styles.pathActive}>Bhadrika</Text>
          <Text style={styles.arrow}>›</Text>
          <Text style={styles.pathText}>Sankata</Text>
          <Text style={styles.arrow}>›</Text>
        </View>
      ) : (
        <View style={styles.pathRow}>
          <Text style={styles.pathActive}>Mahadasha</Text>
          <Text style={styles.arrow}>›</Text>
          <Text style={styles.pathText}>Antardasha</Text>
          <Text style={styles.arrow}>›</Text>
          <Text style={styles.pathText}>PratyantarDasha</Text>
          <Text style={styles.arrow}>›</Text>
        </View>
      )}

      <DashaTable data={isYogini ? yoginiData : majorData} />

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>☏ Consult An Expert</Text>
      </TouchableOpacity>
    </View>
  );
};

const DashaTable = ({ data }) => {
  return (
    <View style={styles.table}>
      <View style={styles.headerRow}>
        <Text style={styles.headerCell}>Planet</Text>
        <Text style={styles.headerCell}>Start Date</Text>
        <Text style={styles.headerCell}>End Date</Text>
        <Text style={styles.iconHeader} />
      </View>

      {data.map((row, index) => (
        <TouchableOpacity
          key={index}
          activeOpacity={0.7}
          style={[styles.row, index % 2 === 0 && styles.lightRow]}
        >
          <Text style={styles.bodyCell}>{row[0]}</Text>
          <Text style={styles.bodyCell}>{row[1]}</Text>
          <Text style={styles.bodyCell}>{row[2]}</Text>
          <Text style={styles.iconCell}>›</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default DashaTab;

const styles = StyleSheet.create({
  switchRow: {
    flexDirection: "row",
    gap: wp(3),
    marginBottom: hp(2.5),
  },
  switchBtn: {
    width: wp(30),
    height: hp(4.2),
    borderRadius: wp(10),
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  activeSwitchBtn: {
    backgroundColor: ORANGE,
    borderColor: ORANGE,
  },
  switchText: {
    fontSize: RF(11),
    color: "#111",
    fontWeight: "500",
  },
  activeSwitchText: {
    color: "#fff",
  },
  pathRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hp(2),
    flexWrap: "wrap",
  },
  pathActive: {
    fontSize: RF(12),
    color: "#111",
    fontWeight: "700",
  },
  pathText: {
    fontSize: RF(12),
    color: "#999",
    fontWeight: "700",
  },
  arrow: {
    fontSize: RF(24),
    color: "#111",
    marginHorizontal: wp(3),
    marginTop: -hp(0.4),
  },
  table: {
    borderRadius: wp(2),
    borderWidth: 1,
    borderColor: "#e8e8e8",
    overflow: "hidden",
    marginBottom: hp(2),
  },
  headerRow: {
    flexDirection: "row",
    backgroundColor: ORANGE,
    height: hp(5.5),
    alignItems: "center",
  },
  headerCell: {
    flex: 1,
    color: "#fff",
    fontSize: RF(11),
    textAlign: "center",
    fontWeight: "700",
  },
  iconHeader: {
    width: wp(8),
  },
  row: {
    flexDirection: "row",
    minHeight: hp(5.2),
    alignItems: "center",
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  lightRow: {
    backgroundColor: LIGHT,
  },
  bodyCell: {
    flex: 1,
    textAlign: "center",
    fontSize: RF(11),
    color: "#111",
    fontWeight: "400",
  },
  iconCell: {
    width: wp(8),
    textAlign: "center",
    fontSize: RF(26),
    color: "#111",
    fontWeight: "700",
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
