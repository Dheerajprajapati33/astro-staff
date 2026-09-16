import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { hp, RF, wp } from "../../utils/responsive";

const InfoTable = ({ title, data }) => {
  return (
    <View style={styles.section}>
      {title ? <Text style={styles.sectionTitle}>{title}</Text> : null}

      <View style={styles.card}>
        {data.map((item, index) => (
          <View
            key={index}
            style={[
              styles.row,
              index % 2 === 0 && styles.lightRow,
              index === data.length - 1 && styles.lastRow,
            ]}
          >
            <Text style={styles.label}>{item.label}</Text>
            <Text style={styles.value}>{item.value}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const BasicTab = ({ data, fullData }) => {
  const sunrise = data?.sunrise || data?.basicDetails?.sunrise || "6:06:24 AM";
  const sunset = data?.sunset || data?.basicDetails?.sunset || "6:43:29 PM";
  const ayanamsha =
    data?.ayanamsha || data?.basicDetails?.ayanamsha || `23° 53' 56"`;

  const isManglik = data?.manglik?.isManglik ?? data?.isManglik ?? true;
  const manglikPercentage =
    data?.manglik?.percentage || data?.manglikPercentage || "23%";
  const manglikDesc =
    data?.manglik?.description ||
    data?.manglikDescription ||
    `You are ${manglikPercentage} manglik, a little bit of manglik is good in today's world`;

  const panchang = data?.panchang || fullData?.panchang || {};
  const avakhada = data?.avakhada || fullData?.avakhada || {};

  const panchangRows = [
    { label: "Tithi", value: panchang?.tithi || "Panchami" },
    { label: "Karana", value: panchang?.karana || "Balava" },
    { label: "Yoga", value: panchang?.yoga || "Saubhagya" },
    { label: "Nakshatra", value: panchang?.nakshatra || "Rohini" },
    { label: "SunRise", value: sunrise },
    { label: "SunSet", value: sunset },
  ];

  const avakhadaRows = [
    { label: "Varna", value: avakhada?.varna || "Brahmin" },
    { label: "Vashya", value: avakhada?.vashya || "Chatushpada" },
    { label: "Yoni", value: avakhada?.yoni || "Sarpa" },
    { label: "Gana", value: avakhada?.gana || "Deva" },
    { label: "Nadi", value: avakhada?.nadi || "Antya" },
    { label: "Sign Lord", value: avakhada?.signLord || "Venus" },
  ];

  return (
    <View>
      <InfoTable
        data={[
          { label: "Sunrise", value: sunrise },
          { label: "Sunset", value: sunset },
          { label: "Ayanamsha", value: ayanamsha },
        ]}
      />

      <Text style={styles.sectionTitle}>Manglik Analysis</Text>

      <View style={styles.manglikCard}>
        <View
          style={[
            styles.yesCircle,
            !isManglik && { backgroundColor: "#4CAF50" },
          ]}
        >
          <Text style={styles.yesText}>{isManglik ? "Yes" : "No"}</Text>
        </View>

        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{fullData?.name || "User Profile"}</Text>
          <Text style={styles.desc}>{manglikDesc}</Text>
        </View>
      </View>

      <InfoTable title="Panchang Details" data={panchangRows} />

      <InfoTable title="Avakhada Details" data={avakhadaRows} />

      <TouchableOpacity style={styles.button} activeOpacity={0.8}>
        <Text style={styles.buttonText}>Consult An Expert</Text>
      </TouchableOpacity>
    </View>
  );
};

export default BasicTab;

const styles = StyleSheet.create({
  section: {
    marginBottom: hp(2),
  },
  sectionTitle: {
    fontSize: RF(14),
    fontWeight: "700",
    color: "#ff5a00",
    marginBottom: hp(1),
  },
  card: {
    borderWidth: 1,
    borderColor: "#ff8a50",
    borderRadius: wp(2),
    overflow: "hidden",
  },
  row: {
    minHeight: hp(4.8),
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: wp(4),
    backgroundColor: "#fff",
  },
  lightRow: {
    backgroundColor: "#fff4df",
  },
  lastRow: {
    borderBottomWidth: 0,
  },
  label: {
    flex: 1,
    fontSize: RF(11),
    color: "#111",
    fontWeight: "400",
  },
  value: {
    flex: 1,
    fontSize: RF(11),
    color: "#111",
    textAlign: "left",
    fontWeight: "500",
  },
  manglikCard: {
    borderWidth: 1,
    borderColor: "#ff8a50",
    borderRadius: wp(2),
    padding: wp(3),
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hp(2),
  },
  yesCircle: {
    width: wp(18),
    height: wp(18),
    borderRadius: wp(9),
    backgroundColor: "#ff5a00",
    alignItems: "center",
    justifyContent: "center",
    marginRight: wp(4),
  },
  yesText: {
    color: "#fff",
    fontSize: RF(16),
    fontWeight: "700",
  },
  name: {
    color: "#ff5a00",
    fontSize: RF(12),
    fontWeight: "700",
  },
  desc: {
    fontSize: RF(11),
    color: "#111",
    marginTop: hp(0.3),
    fontWeight: "400",
  },
  button: {
    height: hp(5.2),
    backgroundColor: "#ff5a00",
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
