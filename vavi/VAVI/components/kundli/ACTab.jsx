import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";import { hp, RF, wp } from "../../utils/responsive";

const ORANGE = "#ff5a00";

const tabs = ["Sarv", "Sun", "Moon", "Mercury", "Venus"];

const ACTab = () => {
  const [active, setActive] = useState("Sarv");

  return (
    <View>
      <Text style={styles.title}>Ashtakvarga Chart</Text>

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

      <View style={styles.chartBox}>
        <View style={[styles.line, styles.d1]} />
        <View style={[styles.line, styles.d2]} />
        <View style={[styles.line, styles.d3]} />
        <View style={[styles.line, styles.d4]} />
        <View style={[styles.line, styles.d5]} />
        <View style={[styles.line, styles.d6]} />

        <Text style={[styles.greenText, { top: "7%", left: "22%" }]}>21</Text>
        <Text style={[styles.greenText, { top: "7%", right: "23%" }]}>26</Text>
        <Text style={[styles.greenText, { top: "17%", left: "4%" }]}>27</Text>
        <Text style={[styles.greenText, { top: "17%", right: "4%" }]}>35</Text>
        <Text style={[styles.greenText, { top: "42%", left: "22%" }]}>30</Text>
        <Text style={[styles.greenText, { top: "42%", right: "22%" }]}>36</Text>
        <Text style={[styles.greenText, { top: "65%", left: "4%" }]}>25</Text>
        <Text style={[styles.greenText, { top: "65%", right: "4%" }]}>20</Text>
        <Text style={[styles.greenText, { bottom: "7%", left: "22%" }]}>
          28
        </Text>
        <Text style={[styles.greenText, { bottom: "7%", right: "23%" }]}>
          29
        </Text>
        <Text style={[styles.greenText, { bottom: "22%", left: "48%" }]}>
          27
        </Text>
        <Text style={[styles.greenText, { top: "28%", left: "48%" }]}>33</Text>

        {[
          ["1", "25%", "20%"],
          ["2", "18%", "30%"],
          ["3", "42%", "50%"],
          ["4", "18%", "74%"],
          ["5", "25%", "82%"],
          ["6", "48%", "56%"],
          ["7", "75%", "82%"],
          ["8", "82%", "74%"],
          ["9", "55%", "50%"],
          ["10", "82%", "30%"],
          ["11", "75%", "20%"],
          ["12", "48%", "44%"],
        ].map(([num, left, top]) => (
          <Text key={num} style={[styles.numText, { left, top }]}>
            {num}
          </Text>
        ))}
      </View>

      <Text style={styles.desc}>
        Ashtakvarga is a method used to evaluate the strength and patterns
        within a birth chart. It involves assigning numerical scores to each
        planet based on its placement in relation to the other planets.
      </Text>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>☏ Consult An Expert</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ACTab;

const styles = StyleSheet.create({
  title: {
    fontSize: RF(16),
    fontWeight: "700",
    color: "#111",
    marginBottom: hp(1.5),
    fontWeight: "700",
  },
  pillRow: {
    flexDirection: "row",
    gap: wp(2),
    marginBottom: hp(2),
  },
  pill: {
    height: hp(3.5),
    minWidth: wp(15),
    paddingHorizontal: wp(3),
    borderRadius: wp(10),
    borderWidth: 1,
    borderColor: "#ddd",
    alignItems: "center",
    justifyContent: "center",
  },
  activePill: {
    backgroundColor: ORANGE,
    borderColor: ORANGE,
  },
  pillText: {
    fontSize: RF(10),
    color: "#111",
    fontWeight: "600",
    fontWeight: "500",
  },
  activeText: {
    color: "#fff",
  },
  chartBox: {
    width: "100%",
    height: hp(34),
    borderWidth: 2,
    borderColor: "#111",
    position: "relative",
    marginBottom: hp(2),
    overflow: "hidden",
  },
  line: {
    position: "absolute",
    height: 1.3,
    backgroundColor: "#111",
  },
  d1: {
    width: "142%",
    top: "50%",
    left: "-21%",
    transform: [{ rotate: "45deg" }],
  },
  d2: {
    width: "142%",
    top: "50%",
    left: "-21%",
    transform: [{ rotate: "-45deg" }],
  },
  d3: {
    width: "70%",
    top: "25%",
    left: "-10%",
    transform: [{ rotate: "-45deg" }],
  },
  d4: {
    width: "70%",
    top: "25%",
    right: "-10%",
    transform: [{ rotate: "45deg" }],
  },
  d5: {
    width: "70%",
    bottom: "25%",
    left: "-10%",
    transform: [{ rotate: "45deg" }],
  },
  d6: {
    width: "70%",
    bottom: "25%",
    right: "-10%",
    transform: [{ rotate: "-45deg" }],
  },
  greenText: {
    position: "absolute",
    fontSize: RF(17),
    color: "#0b6b1c",
    fontWeight: "700",
    fontWeight: "700",
  },
  numText: {
    position: "absolute",
    fontSize: RF(10),
    color: "#111",
    fontWeight: "600",
    fontWeight: "500",
  },
  desc: {
    fontSize: RF(12),
    color: "#111",
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
    fontWeight: "700",
  },
});
