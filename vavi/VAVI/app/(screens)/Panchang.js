import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import Colors from "../../constants/Colors";
import { hp, RF, wp } from "../../utils/responsive";
import { useGetPanchangMutation } from "../../redux/PanchangApi";
import DatePickerModal from "../../components/common/DatePickerModal";
import StatePickerModal from "../../components/common/StatePickerModal";

const getFormattedDate = (d = new Date()) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const formatTime = (val) => {
  if (!val) return "--";
  if (typeof val === "string") {
    if (val.includes("T")) {
      try {
        const d = new Date(val);
        return d.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });
      } catch (e) {
        return val;
      }
    }
    return val;
  }
  return formatValue(val);
};

const formatValue = (val) => {
  if (val === null || val === undefined || val === "") return "--";
  if (typeof val === "string" || typeof val === "number") return String(val);

  if (Array.isArray(val)) {
    if (val.length === 0) return "--";
    return (
      val
        .map((item) => {
          if (typeof item === "string") return item;
          if (typeof item === "object" && item !== null) {
            const name = item?.name || item?.title || item?.value || "";
            const paksha = item?.paksha ? ` (${item.paksha})` : "";
            let timing = "";
            if (item?.start && item?.end) {
              timing = ` [${formatTime(item.start)} - ${formatTime(item.end)}]`;
            } else if (item?.end) {
              timing = ` (till ${formatTime(item.end)})`;
            }
            const label = `${name}${paksha}${timing}`.trim();
            return label || JSON.stringify(item);
          }
          return String(item);
        })
        .filter(Boolean)
        .join(", ") || "--"
    );
  }

  if (typeof val === "object") {
    if (val.name && val.paksha) return `${val.name} (${val.paksha})`;
    if (val.name) return String(val.name);
    if (val.start && val.end) {
      return `${formatTime(val.start)} - ${formatTime(val.end)}`;
    }
    if (val.start) return formatTime(val.start);
    if (val.end) return formatTime(val.end);
    if (val.time) return formatTime(val.time);
    if (val.value) return String(val.value);
    return JSON.stringify(val);
  }

  return String(val);
};

const getPeriod = (periods, nameQuery) => {
  if (!Array.isArray(periods)) return null;
  const found = periods.find((p) =>
    (p?.name || p?.title || "").toLowerCase().includes(nameQuery.toLowerCase()),
  );
  if (!found) return null;
  if (found.start && found.end) {
    return `${formatTime(found.start)} to ${formatTime(found.end)}`;
  }
  return formatValue(found);
};

export default function Panchang() {
  const router = useRouter();

  const [date, setDate] = useState(getFormattedDate());
  const [place, setPlace] = useState("Delhi");
  const [language, setLanguage] = useState("hi");
  const [panchang, setPanchang] = useState(null);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showLocationPicker, setShowLocationPicker] = useState(false);

  const [getPanchang, { isLoading }] = useGetPanchangMutation();

  const handleGetPanchang = async (
    targetDate = date,
    targetPlace = place,
    targetLa = language,
  ) => {
    const queryDate = targetDate || date;
    const queryPlace = targetPlace || place;
    const queryLa = targetLa || language || "hi";

    if (!queryDate) {
      Alert.alert("Required", "Please enter date (YYYY-MM-DD)");
      return;
    }

    if (!queryPlace) {
      Alert.alert("Required", "Please enter place");
      return;
    }

    try {
      const response = await getPanchang({
        date: queryDate,
        place: queryPlace,
        la: queryLa,
      }).unwrap();

      console.log("Panchang Response:", response);

      if (response?.success && response?.data) {
        setPanchang(response.data);
      } else if (response?.data) {
        setPanchang(response.data);
      } else if (
        response &&
        typeof response === "object" &&
        !response?.message
      ) {
        setPanchang(response);
      }
    } catch (error) {
      console.log("Panchang fetch error:", error);
      Alert.alert("Error", error?.data?.message || "Unable to fetch Panchang");
    }
  };

  useEffect(() => {
    handleGetPanchang(getFormattedDate(), "Delhi", "hi");
  }, []);

  const handleQuickDate = (offsetDays) => {
    const d = new Date();
    d.setDate(d.getDate() + offsetDays);
    const newDate = getFormattedDate(d);
    setDate(newDate);
    handleGetPanchang(newDate, place, language);
  };

  const timings = [
    {
      id: 1,
      title: "Sunrise",
      time: formatTime(panchang?.sunrise || panchang?.sunRise),
      icon: "weather-sunset-up",
    },
    {
      id: 2,
      title: "Sunset",
      time: formatTime(panchang?.sunset || panchang?.sunSet),
      icon: "weather-sunset-down",
    },
    {
      id: 3,
      title: "Moonrise",
      time: formatTime(panchang?.moonrise || panchang?.moonRise),
      icon: "moon-waning-crescent",
    },
    {
      id: 4,
      title: "Moonset",
      time: formatTime(panchang?.moonset || panchang?.moonSet),
      icon: "moon-waning-crescent",
    },
  ];

  // Abhijit Muhurta extraction (handles both direct object and auspicious_period array)
  const abhijitStart =
    panchang?.abhijitMuhurta?.start ||
    panchang?.abhijit_muhurta?.start ||
    panchang?.abhijit?.start ||
    (Array.isArray(panchang?.auspicious_period)
      ? panchang.auspicious_period.find((p) =>
          (p?.name || "").toLowerCase().includes("abhijit"),
        )?.start
      : null);

  const abhijitEnd =
    panchang?.abhijitMuhurta?.end ||
    panchang?.abhijit_muhurta?.end ||
    panchang?.abhijit?.end ||
    (Array.isArray(panchang?.auspicious_period)
      ? panchang.auspicious_period.find((p) =>
          (p?.name || "").toLowerCase().includes("abhijit"),
        )?.end
      : null);

  // Inauspicious Muhurta extraction
  const rahuKaal =
    panchang?.kaal?.rahukaal ||
    panchang?.rahukaal ||
    panchang?.rahu_kaal ||
    panchang?.kaal?.rahu ||
    getPeriod(panchang?.inauspicious_period, "rahu");

  const gulikaKaal =
    panchang?.kaal?.gulika ||
    panchang?.gulika ||
    panchang?.gulika_kaal ||
    getPeriod(panchang?.inauspicious_period, "guli");

  const yamagandaKaal =
    panchang?.kaal?.yamaganda ||
    panchang?.yamaganda ||
    panchang?.yamaghanta ||
    getPeriod(panchang?.inauspicious_period, "yama");

  // Core Panchang Elements
  const rawPanchangRows = [
    {
      label: "Tithi",
      value: formatValue(panchang?.tithi || panchang?.tithiDetails),
    },
    {
      label: "Nakshatra",
      value: formatValue(panchang?.nakshatra || panchang?.nakshatraDetails),
    },
    {
      label: "Yoga",
      value: formatValue(panchang?.yoga || panchang?.yogaDetails),
    },
    {
      label: "Karana",
      value: formatValue(panchang?.karana || panchang?.karanaDetails),
    },
    {
      label: "Paksha",
      value: formatValue(panchang?.paksha),
    },
    {
      label: "Vara (Day)",
      value: formatValue(panchang?.vaara || panchang?.day || panchang?.vara),
    },
  ];

  // Filter only elements that have valid data (not "--")
  const panchangDetails = rawPanchangRows.filter((row) => row.value !== "--");

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={RF(22)} color={Colors.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Daily Panchang</Text>
          <View style={{ width: wp(6) }} />
        </View>

        {/* Quick Date Selector */}
        <View style={styles.quickDateRow}>
          <TouchableOpacity
            style={styles.quickDateBtn}
            onPress={() => handleQuickDate(-1)}
          >
            <Text style={styles.quickDateText}>Yesterday</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.quickDateBtn, styles.quickDateActive]}
            onPress={() => handleQuickDate(0)}
          >
            <Text style={[styles.quickDateText, styles.quickDateActiveText]}>
              Today
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickDateBtn}
            onPress={() => handleQuickDate(1)}
          >
            <Text style={styles.quickDateText}>Tomorrow</Text>
          </TouchableOpacity>
        </View>

        {/* Input Card */}
        <View style={styles.inputCard}>
          <View style={styles.inputCardHeader}>
            <Text style={styles.inputTitle}>Panchang Location & Date</Text>
            {/* Language Toggle */}
            <View style={styles.langToggle}>
              <TouchableOpacity
                style={[
                  styles.langBtn,
                  language === "hi" && styles.langBtnActive,
                ]}
                onPress={() => {
                  setLanguage("hi");
                  handleGetPanchang(date, place, "hi");
                }}
              >
                <Text
                  style={[
                    styles.langText,
                    language === "hi" && styles.langTextActive,
                  ]}
                >
                  हिंदी
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.langBtn,
                  language === "en" && styles.langBtnActive,
                ]}
                onPress={() => {
                  setLanguage("en");
                  handleGetPanchang(date, place, "en");
                }}
              >
                <Text
                  style={[
                    styles.langText,
                    language === "en" && styles.langTextActive,
                  ]}
                >
                  EN
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Date Picker Input Box */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => setShowDatePicker(true)}
            style={styles.inputBox}
          >
            <Ionicons
              name="calendar-outline"
              size={RF(18)}
              color={Colors.primary}
            />
            <Text style={styles.pickerValueText}>
              {date || "Select Date (YYYY-MM-DD)"}
            </Text>
            <Ionicons name="chevron-down" size={RF(16)} color="#888" />
          </TouchableOpacity>

          {/* Location Picker / Input Box */}
          <View style={styles.inputBox}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setShowLocationPicker(true)}
              style={styles.locationIconBtn}
            >
              <Ionicons
                name="location-outline"
                size={RF(18)}
                color={Colors.primary}
              />
            </TouchableOpacity>
            <TextInput
              placeholder="Enter Place (e.g. Delhi, Gorakhpur)"
              placeholderTextColor="#999"
              value={place}
              onChangeText={setPlace}
              style={styles.input}
            />
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setShowLocationPicker(true)}
              style={styles.stateSelectBtn}
            >
              <Ionicons name="search-outline" size={RF(16)} color="#888" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => handleGetPanchang(date, place, language)}
            style={styles.buttonWrapper}
            disabled={isLoading}
          >
            <LinearGradient
              colors={["#FF9800", "#FF6A00"]}
              style={styles.getButton}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <>
                  <Ionicons
                    name="sparkles-outline"
                    size={RF(20)}
                    color="#FFF"
                  />
                  <Text style={styles.getButtonText}>Get Panchang</Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Loading Indicator */}
        {isLoading && !panchang && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={styles.loadingText}>Fetching Panchang Details...</Text>
          </View>
        )}

        {/* Panchang Content */}
        {panchang && (
          <>
            {/* Location & Date Badge */}
            <View style={styles.locationCard}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setShowLocationPicker(true)}
                style={styles.locationLeft}
              >
                <Ionicons
                  name="location-outline"
                  size={RF(20)}
                  color={Colors.primary}
                />
                <Text style={styles.locationText}>
                  {formatValue(panchang?.place || place || "Location")}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setShowDatePicker(true)}
                style={styles.dateBadge}
              >
                <Ionicons
                  name="calendar"
                  size={RF(14)}
                  color={Colors.primary}
                />
                <Text style={styles.dateBadgeText}>
                  {formatValue(panchang?.date || date)}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Timings (Sunrise / Sunset / Moonrise / Moonset) */}
            <View style={styles.timingCard}>
              {timings.map((item, index) => (
                <View
                  key={item.id}
                  style={[
                    styles.timingItem,
                    index !== timings.length - 1 && styles.timingBorder,
                  ]}
                >
                  <LinearGradient
                    colors={["#FF9800", "#FF6A00"]}
                    style={styles.timingHeader}
                  >
                    <MaterialCommunityIcons
                      name={item.icon}
                      size={RF(17)}
                      color="#FFF"
                    />
                    <Text style={styles.timingTitle}>{item.title}</Text>
                  </LinearGradient>
                  <View style={styles.timingBody}>
                    <Text style={styles.timingValue}>{item.time}</Text>
                  </View>
                </View>
              ))}
            </View>

            {/* Core Panchang Elements (Only displayed when returned by the API) */}
            {panchangDetails.length > 0 && (
              <View style={styles.infoCard}>
                <View style={styles.cardHeader}>
                  <MaterialCommunityIcons
                    name="compass-outline"
                    size={RF(22)}
                    color={Colors.primary}
                  />
                  <Text style={styles.cardTitle}>Panchang Elements</Text>
                </View>
                {panchangDetails.map((item, idx) => (
                  <View key={item.label}>
                    <View style={styles.tableRow}>
                      <Text style={styles.leftLabel}>{item.label}</Text>
                      <Text style={styles.rightValue}>{item.value}</Text>
                    </View>
                    {idx !== panchangDetails.length - 1 && (
                      <View style={styles.divider} />
                    )}
                  </View>
                ))}
              </View>
            )}

            {/* Abhijit Muhurta (Auspicious) */}
            {(abhijitStart || abhijitEnd) && (
              <View style={styles.infoCard}>
                <View style={styles.cardHeader}>
                  <MaterialCommunityIcons
                    name="clock-time-four-outline"
                    size={RF(22)}
                    color={Colors.primary}
                  />
                  <Text style={styles.cardTitle}>
                    Abhijit Muhurta (Auspicious)
                  </Text>
                </View>
                <View style={styles.tableRow}>
                  <Text style={styles.leftLabel}>Start Time</Text>
                  <Text style={styles.rightValue}>
                    {formatTime(abhijitStart)}
                  </Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.tableRow}>
                  <Text style={styles.leftLabel}>End Time</Text>
                  <Text style={styles.rightValue}>
                    {formatTime(abhijitEnd)}
                  </Text>
                </View>
              </View>
            )}

            {/* Inauspicious Timings (Kaal) */}
            {(rahuKaal || gulikaKaal || yamagandaKaal) && (
              <View style={styles.infoCard}>
                <View style={styles.cardHeader}>
                  <MaterialCommunityIcons
                    name="alert-outline"
                    size={RF(22)}
                    color="#E53935"
                  />
                  <Text style={[styles.cardTitle, { color: "#C62828" }]}>
                    Inauspicious Timings (अशुभ काल)
                  </Text>
                </View>
                {rahuKaal ? (
                  <>
                    <View style={styles.tableRow}>
                      <Text style={styles.leftLabel}>Rahukaal (राहुकाल)</Text>
                      <Text style={[styles.rightValue, { color: "#C62828" }]}>
                        {formatValue(rahuKaal)}
                      </Text>
                    </View>
                    <View style={styles.divider} />
                  </>
                ) : null}
                {gulikaKaal ? (
                  <>
                    <View style={styles.tableRow}>
                      <Text style={styles.leftLabel}>Gulika (गुलिक काल)</Text>
                      <Text style={styles.rightValue}>
                        {formatValue(gulikaKaal)}
                      </Text>
                    </View>
                    <View style={styles.divider} />
                  </>
                ) : null}
                {yamagandaKaal ? (
                  <View style={styles.tableRow}>
                    <Text style={styles.leftLabel}>Yamaganda (यमगंड)</Text>
                    <Text style={styles.rightValue}>
                      {formatValue(yamagandaKaal)}
                    </Text>
                  </View>
                ) : null}
              </View>
            )}
          </>
        )}

        {/* Date Picker Modal */}
        <DatePickerModal
          visible={showDatePicker}
          onClose={() => setShowDatePicker(false)}
          onSelectDate={(selectedDateStr) => {
            setDate(selectedDateStr);
            setShowDatePicker(false);
            handleGetPanchang(selectedDateStr, place, language);
          }}
          initialDate={date}
          maxDate={new Date(2050, 11, 31)}
        />

        {/* State/Location Picker Modal */}
        <StatePickerModal
          visible={showLocationPicker}
          onClose={() => setShowLocationPicker(false)}
          onSelectState={(selectedLocStr) => {
            setPlace(selectedLocStr);
            setShowLocationPicker(false);
            handleGetPanchang(date, selectedLocStr, language);
          }}
          selectedState={place}
          title="Select Panchang Location"
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF8F4",
  },
  content: {
    paddingHorizontal: wp(4),
    paddingBottom: hp(4),
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: hp(1),
    marginBottom: hp(1.5),
  },
  backButton: {
    padding: wp(1),
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    color: Colors.primary,
    fontSize: RF(19),
    fontWeight: "700",
  },
  quickDateRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: hp(1.5),
  },
  quickDateBtn: {
    flex: 1,
    marginHorizontal: wp(1),
    paddingVertical: hp(0.8),
    backgroundColor: "#FFE8D6",
    borderRadius: wp(2.5),
    alignItems: "center",
  },
  quickDateActive: {
    backgroundColor: Colors.primary,
  },
  quickDateText: {
    fontSize: RF(12),
    fontWeight: "600",
    color: Colors.darkBrown,
  },
  quickDateActiveText: {
    color: "#FFF",
  },
  inputCard: {
    backgroundColor: Colors.white,
    borderRadius: wp(4),
    padding: wp(4),
    marginBottom: hp(2),
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },
  inputCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: hp(1.5),
  },
  inputTitle: {
    color: Colors.darkBrown,
    fontSize: RF(15),
    fontWeight: "600",
  },
  langToggle: {
    flexDirection: "row",
    backgroundColor: "#FFF2E2",
    borderRadius: wp(2),
    padding: wp(0.8),
  },
  langBtn: {
    paddingHorizontal: wp(2.5),
    paddingVertical: hp(0.4),
    borderRadius: wp(1.5),
  },
  langBtnActive: {
    backgroundColor: Colors.primary,
  },
  langText: {
    fontSize: RF(11),
    fontWeight: "600",
    color: Colors.darkBrown,
  },
  langTextActive: {
    color: "#FFF",
  },
  inputBox: {
    height: hp(6),
    backgroundColor: "#FFF9F2",
    borderWidth: 1,
    borderColor: "#F4D7B8",
    borderRadius: wp(3),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: wp(3),
    marginBottom: hp(1.2),
  },
  pickerValueText: {
    flex: 1,
    marginLeft: wp(2),
    color: Colors.darkBrown,
    fontSize: RF(13),
    fontWeight: "500",
  },
  locationIconBtn: {
    paddingRight: wp(1),
  },
  stateSelectBtn: {
    padding: wp(1),
  },
  input: {
    flex: 1,
    marginLeft: wp(2),
    color: Colors.darkBrown,
    fontSize: RF(13),
    fontWeight: "500",
  },
  buttonWrapper: {
    marginTop: hp(0.5),
  },
  getButton: {
    height: hp(5.8),
    borderRadius: wp(3.5),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#FF9800",
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  getButtonText: {
    color: "#FFF",
    fontSize: RF(14.5),
    fontWeight: "700",
    marginLeft: wp(2),
  },
  loadingContainer: {
    paddingVertical: hp(4),
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginTop: hp(1),
    fontSize: RF(13),
    color: Colors.darkBrown,
    fontWeight: "500",
  },
  locationCard: {
    backgroundColor: Colors.white,
    borderRadius: wp(3.5),
    paddingHorizontal: wp(4),
    paddingVertical: hp(1.4),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    marginBottom: hp(1.8),
  },
  locationLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationText: {
    marginLeft: wp(2),
    color: "#222",
    fontSize: RF(14),
    fontWeight: "600",
  },
  dateBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF2E2",
    paddingHorizontal: wp(2.5),
    paddingVertical: hp(0.5),
    borderRadius: wp(2),
  },
  dateBadgeText: {
    marginLeft: wp(1.2),
    fontSize: RF(11.5),
    color: Colors.primary,
    fontWeight: "600",
  },
  timingCard: {
    flexDirection: "row",
    backgroundColor: Colors.white,
    borderRadius: wp(3.5),
    overflow: "hidden",
    marginBottom: hp(1.8),
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  timingItem: {
    flex: 1,
  },
  timingBorder: {
    borderRightWidth: 1,
    borderRightColor: "#EFEFEF",
  },
  timingHeader: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: hp(1),
  },
  timingTitle: {
    color: "#FFF",
    fontSize: RF(10.5),
    fontWeight: "600",
    marginTop: hp(0.3),
    textAlign: "center",
  },
  timingBody: {
    paddingVertical: hp(1.2),
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: wp(1),
  },
  timingValue: {
    color: "#444",
    fontSize: RF(10.5),
    fontWeight: "600",
    textAlign: "center",
  },
  infoCard: {
    backgroundColor: Colors.white,
    borderRadius: wp(3.5),
    padding: wp(4),
    marginBottom: hp(1.8),
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hp(1.5),
  },
  cardTitle: {
    color: "#222",
    fontSize: RF(14.5),
    fontWeight: "700",
    marginLeft: wp(2),
  },
  tableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: hp(1),
  },
  divider: {
    height: 1,
    backgroundColor: "#F2F2F2",
  },
  leftLabel: {
    flex: 1,
    color: "#555",
    fontSize: RF(13),
    fontWeight: "500",
  },
  rightValue: {
    flex: 1.3,
    textAlign: "right",
    color: Colors.primary,
    fontSize: RF(13),
    fontWeight: "700",
  },
});
