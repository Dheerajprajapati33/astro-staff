import { useMemo, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { hp, RF, wp } from "../../utils/responsive";

const ORANGE = "#ff5a00";
const BORDER = "#ff9b5c";
const LIGHT = "#fff7ed";

const reportTabs = ["Manglik", "Kalsarpa", "Sadesati"];

const ReportTab = ({ data, fullData }) => {
  const [active, setActive] = useState("Manglik");

  const doshas = data || fullData?.doshas || fullData?.report || {};

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

      {active === "Manglik" && <Manglik data={doshas?.manglik} />}
      {active === "Kalsarpa" && (
        <Kalsarpa data={doshas?.kaalsarp || doshas?.kalsarpa} />
      )}
      {active === "Sadesati" && <Sadesati data={doshas?.sadesati} />}

      <TouchableOpacity style={styles.button} activeOpacity={0.8}>
        <Text style={styles.buttonText}>☏ Consult An Expert</Text>
      </TouchableOpacity>
    </View>
  );
};

const Manglik = ({ data }) => {
  const isMars = data?.isManglikByMars ? "True" : "False";
  const isSaturn = data?.isManglikBySaturn ? "True" : "False";
  const isRahuKetu = data?.isManglikByRahuKetu ? "True" : "False";
  const percentage = data?.percentage || "11.5%";

  const items = [
    [data ? isMars : "True", "Manglik By Mars"],
    [data ? isSaturn : "False", "Manglik By Saturn"],
    [data ? isRahuKetu : "False", "Manglik By RahuKetu"],
  ];

  return (
    <View>
      <Text style={styles.title}>Manglik Analysis</Text>

      {items.map((item, index) => (
        <View key={index} style={styles.statusCard}>
          <View
            style={[
              styles.badge,
              item[0] === "False" && { backgroundColor: "#4CAF50" },
            ]}
          >
            <Text style={styles.badgeText}>{item[0]}</Text>
          </View>
          <Text style={styles.cardText}>{item[1]}</Text>
        </View>
      ))}

      <Text style={styles.title}>Aggregate response</Text>

      <View style={styles.messageCard}>
        <Text style={styles.cardText}>
          {data?.description || `You are ${percentage} manglik.`}
        </Text>
      </View>
    </View>
  );
};

const Kalsarpa = ({ data }) => {
  const hasDosh = data?.hasKaalsarp ?? data?.isDosha ?? false;
  const status = hasDosh ? "True" : "False";
  const message =
    data?.message ||
    (hasDosh ? "You have Kaal-Sarp dosha" : "You do not have kaal-sarp dosha");
  const remedies =
    data?.remedies ||
    data?.remedy ||
    `Kaal Sarpa Dosh Nivaran Puja is recommended. A person having Kaal Sarpa Yoga in his/her kundli should worship Lord Shiva regularly and for better results, one can also chant the Moola Mantra of Lord Shiva. This mantra acts as a Kaal Sarpa Dosha Nivaran mantra.`;

  return (
    <View>
      <Text style={styles.title}>Kaalsarp Dosh</Text>

      <View style={styles.statusCard}>
        <View
          style={[styles.badge, !hasDosh && { backgroundColor: "#4CAF50" }]}
        >
          <Text style={styles.badgeText}>{status}</Text>
        </View>
        <Text style={styles.cardText}>{message}</Text>
      </View>

      <Text style={styles.title}>Remedies of Kaalsarp Dosh</Text>

      <View style={styles.remedyCard}>
        <Text style={styles.remedyText}>
          {remedies}
          <Text style={styles.readMore}> Read More</Text>
        </Text>
      </View>
    </View>
  );
};

const defaultSadesatiData = [
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

const Sadesati = ({ data }) => {
  const headers = [
    "Start Date",
    "End Date",
    "Zodiac",
    "Type",
    "Status",
    "Dhaiya",
  ];

  const rows = useMemo(() => {
    const raw = data?.phases || data?.timeline;
    if (!raw || !Array.isArray(raw) || raw.length === 0)
      return defaultSadesatiData;
    return raw.map((p) => [
      p.startDate || p.start || "Start",
      p.endDate || p.end || "End",
      p.zodiac || p.sign || "Sign",
      p.type || "Sade Sati",
      p.isCurrentlyActive ? "true" : "false",
      p.dhaiya || p.phase || "Dhaiya",
    ]);
  }, [data]);

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

          {rows.map((row, index) => (
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
  },
});
