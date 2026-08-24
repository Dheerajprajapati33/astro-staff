import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";import { hp, RF, wp } from "../../utils/responsive";

const ORANGE = "#ff5a00";
const BORDER = "#ff9b5c";
const LIGHT = "#fff7ed";

const reportTabs = ["Manglik", "Kalsarpa", "Sadesati"];

const ReportTab = () => {
  const [active, setActive] = useState("Manglik");

  return (
    <View>
      <View style={styles.pillRow}>
        {reportTabs.map((item) => (
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

      {active === "Manglik" && <Manglik />}
      {active === "Kalsarpa" && <Kalsarpa />}
      {active === "Sadesati" && <Sadesati />}

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>☏ Consult An Expert</Text>
      </TouchableOpacity>
    </View>
  );
};

const Manglik = () => {
  return (
    <View>
      <Text style={styles.title}>Manglik Analysis</Text>

      {[
        ["True", "Manglik By Mars"],
        ["False", "Manglik By Saturn"],
        ["False", "Manglik By RahuKetu"],
      ].map((item, index) => (
        <View key={index} style={styles.statusCard}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{item[0]}</Text>
          </View>
          <Text style={styles.cardText}>{item[1]}</Text>
        </View>
      ))}

      <Text style={styles.title}>Aggregate response</Text>

      <View style={styles.messageCard}>
        <Text style={styles.cardText}>You are 11.5% manglik.</Text>
      </View>
    </View>
  );
};

const Kalsarpa = () => {
  return (
    <View>
      <Text style={styles.title}>Kaalsarp Dosh</Text>

      <View style={styles.statusCard}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>False</Text>
        </View>
        <Text style={styles.cardText}>You do not have kaal-sarp dosha</Text>
      </View>

      <Text style={styles.title}>Remedies of Kaalsarp Dosh</Text>

      <View style={styles.remedyCard}>
        <Text style={styles.remedyText}>
          Kaal Sarpa Dosh Nivaran Puja is recommended. A person having Kaal
          Sarpa Yoga in his/her kundli should worship Lord Shiva regularly and
          for better results, one can also chant the Moola Mantra of Lord Shiva.
          This mantra acts as a Kaal Sarpa Dosha Nivaran mantra.
          <Text style={styles.readMore}> Read More</Text>
        </Text>
      </View>
    </View>
  );
};

const Sadesati = () => {
  const headers = [
    "Start Date",
    "End Date",
    "Zodiac",
    "Type",
    "Status",
    "Dhaiya",
  ];
  const data = [
    ["09-06-2000", "19-01-2001", "Taurus", "Sade Sati", "false", "2nd Dhaiya"],
    ["19-01-2001", "01-02-2001", "Aries", "Sade Sati", "true", "1st Dhaiya"],
    ["01-02-2001", "25-07-2002", "Taurus", "Sade Sati", "false", "2nd Dhaiya"],
    ["25-07-2002", "06-01-2003", "Gemini", "Sade Sati", "false", "3rd Dhaiya"],
    ["06-01-2003", "11-04-2003", "Taurus", "Sade Sati", "true", "2nd Dhaiya"],
    ["11-04-2003", "08-09-2004", "Gemini", "Sade Sati", "false", "3rd Dhaiya"],
    ["12-01-2005", "28-05-2005", "Gemini", "Sade Sati", "true", "3rd Dhaiya"],
    [
      "04-11-2006",
      "09-01-2007",
      "Leo",
      "Ardhashtama Shani",
      "false",
      "Small Panoti",
    ],
  ];

  return (
    <View>
      <Text style={styles.title}>Sadesati Analysis</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.table}>
          <View style={styles.headerRow}>
            {headers.map((h) => (
              <Text key={h} style={styles.headerCell}>
                {h}
              </Text>
            ))}
          </View>

          {data.map((row, index) => (
            <View
              key={index}
              style={[styles.tableRow, index % 2 === 0 && styles.lightRow]}
            >
              {row.map((cell, i) => (
                <Text key={i} style={styles.bodyCell}>
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

export default ReportTab;

const styles = StyleSheet.create({
  pillRow: {
    flexDirection: "row",
    gap: wp(3),
    marginBottom: hp(2.5),
  },
  pill: {
    width: wp(26),
    height: hp(4.2),
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
    fontWeight: "700",
    fontWeight: "500",
  },
  activeText: {
    color: "#fff",
  },
  title: {
    fontSize: RF(15),
    color: "#111",
    fontWeight: "700",
    marginBottom: hp(1.3),
    fontWeight: "700",
  },
  statusCard: {
    minHeight: hp(6.5),
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: wp(2),
    backgroundColor: LIGHT,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: wp(3),
    marginBottom: hp(1.4),
  },
  badge: {
    width: wp(13),
    height: hp(4.8),
    borderRadius: wp(1.5),
    backgroundColor: ORANGE,
    alignItems: "center",
    justifyContent: "center",
    marginRight: wp(3),
  },
  badgeText: {
    color: "#fff",
    fontSize: RF(9),
    fontWeight: "700",
    fontWeight: "700",
  },
  cardText: {
    flex: 1,
    color: "#111",
    fontSize: RF(11),
    fontWeight: "400",
  },
  messageCard: {
    minHeight: hp(6),
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: wp(2),
    backgroundColor: LIGHT,
    justifyContent: "center",
    paddingHorizontal: wp(4),
    marginBottom: hp(2),
  },
  remedyCard: {
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: wp(2),
    backgroundColor: LIGHT,
    padding: wp(4),
    marginBottom: hp(2),
  },
  remedyText: {
    fontSize: RF(11),
    color: "#111",
    lineHeight: hp(2.4),
    fontWeight: "400",
  },
  readMore: {
    color: ORANGE,
    fontWeight: "700",
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
    width: wp(20),
    minHeight: hp(5),
    color: "#fff",
    textAlign: "center",
    textAlignVertical: "center",
    fontSize: RF(8.5),
    fontWeight: "700",
    paddingHorizontal: wp(1),
    fontWeight: "700",
  },
  tableRow: {
    flexDirection: "row",
    backgroundColor: "#fff",
  },
  lightRow: {
    backgroundColor: LIGHT,
  },
  bodyCell: {
    width: wp(20),
    minHeight: hp(5),
    color: "#111",
    textAlign: "center",
    textAlignVertical: "center",
    fontSize: RF(8.5),
    paddingHorizontal: wp(1),
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
    marginTop: hp(1),
  },
  buttonText: {
    color: "#fff",
    fontSize: RF(13),
    fontWeight: "700",
    fontWeight: "700",
  },
});
