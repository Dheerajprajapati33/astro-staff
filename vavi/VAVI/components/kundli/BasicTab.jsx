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
  const basic = data?.basicDetails || fullData?.basic || data || {};
  const panchang = data?.panchang || fullData?.panchang || {};
  const avakhada = data?.avakhada || fullData?.avakhada || {};

  const name = basic?.name || fullData?.name || "User";
  const gender = basic?.gender || fullData?.gender || "MALE";
  const dob = basic?.dob || fullData?.dob || "-";
  const tob = basic?.tob || fullData?.tob || "-";
  const birthPlace =
    basic?.birthPlace ||
    basic?.city ||
    fullData?.birthPlace ||
    fullData?.city ||
    "-";
  const latitude =
    basic?.latitude || fullData?.latitude
      ? `${basic?.latitude || fullData?.latitude}° N`
      : "-";
  const longitude =
    basic?.longitude || fullData?.longitude
      ? `${basic?.longitude || fullData?.longitude}° E`
      : "-";

  const sunrise =
    basic?.sunrise || panchang?.sunrise || fullData?.sunrise || "06:00:00 AM";

  const sunset =
    basic?.sunset || panchang?.sunset || fullData?.sunset || "06:30:00 PM";

  const moonrise =
    basic?.moonrise || panchang?.moonrise || fullData?.moonrise || "-";

  const moonset =
    basic?.moonset || panchang?.moonset || fullData?.moonset || "-";

  const ayanamsha =
    basic?.ayanamsha || fullData?.ayanamsha || "Lahiri (Chitra Paksha)";

  const mangalData =
    fullData?.mangal_dosha ||
    data?.mangal_dosha ||
    fullData?.doshas?.manglik ||
    data?.manglik;

  const isManglik =
    mangalData?.has_dosha ??
    mangalData?.hasDosha ??
    mangalData?.isManglik ??
    data?.isManglik ??
    false;

  const manglikPercentage =
    mangalData?.percentage ||
    mangalData?.score ||
    data?.manglikPercentage ||
    (isManglik ? "23%" : "0%");

  const manglikDesc =
    mangalData?.description ||
    mangalData?.remedies ||
    data?.manglikDescription ||
    (isManglik
      ? `You are ${manglikPercentage} manglik. Appropriate astrological remedies or pujas are recommended.`
      : "You do not have Manglik Dosha in your birth chart. Your chart is clear.");

  const getVal = (item, fallback = "-") => {
    if (item === undefined || item === null || item === "") return fallback;
    if (typeof item === "string" || typeof item === "number")
      return String(item);
    if (typeof item === "object")
      return item.name || item.title || item.value || fallback;
    return String(item);
  };

  const birthRows = [
    { label: "Name", value: name },
    { label: "Gender", value: gender },
    { label: "Date of Birth", value: dob },
    { label: "Time of Birth", value: tob },
    { label: "Birth Place", value: birthPlace },
    { label: "Latitude", value: latitude },
    { label: "Longitude", value: longitude },
    { label: "Sunrise", value: sunrise },
    { label: "Sunset", value: sunset },
    { label: "Ayanamsha", value: ayanamsha },
  ];

  const panchangRows = [
    { label: "Tithi", value: getVal(panchang?.tithi, "Panchami") },
    { label: "Karana", value: getVal(panchang?.karana, "Balava") },
    { label: "Yoga", value: getVal(panchang?.yoga, "Saubhagya") },
    { label: "Nakshatra", value: getVal(panchang?.nakshatra, "Rohini") },
    {
      label: "Vaara (Day)",
      value: getVal(panchang?.vaara || panchang?.day, "Monday"),
    },
    { label: "Sunrise", value: sunrise },
    { label: "Sunset", value: sunset },
    { label: "Moonrise", value: moonrise },
    { label: "Moonset", value: moonset },
  ];

  const avakhadaRows = [
    { label: "Varna", value: getVal(avakhada?.varna, "Brahmin") },
    { label: "Vashya", value: getVal(avakhada?.vashya, "Chatushpada") },
    { label: "Yoni", value: getVal(avakhada?.yoni, "Sarpa") },
    { label: "Gana", value: getVal(avakhada?.gan || avakhada?.gana, "Deva") },
    { label: "Nadi", value: getVal(avakhada?.nadi, "Antya") },
    {
      label: "Sign / Rasi",
      value: getVal(avakhada?.sign || avakhada?.rasi, "Mesha"),
    },
    {
      label: "Sign Lord",
      value: getVal(avakhada?.signLord || avakhada?.sign_lord, "Mars"),
    },
    { label: "Nakshatra", value: getVal(avakhada?.nakshatra, "Ashwini") },
    {
      label: "Nakshatra Lord",
      value: getVal(
        avakhada?.nakshatraLord || avakhada?.nakshatra_lord,
        "Ketu",
      ),
    },
    {
      label: "Charan (Pada)",
      value: getVal(avakhada?.charan || avakhada?.pada, "1"),
    },
  ];

  return (
    <View>
      <InfoTable title="Basic Birth Details" data={birthRows} />

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
          <Text style={styles.name}>{name}</Text>
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
