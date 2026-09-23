import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

import Colors from "../../constants/Colors";
import { hp, RF, wp } from "../../utils/responsive";

import DatePickerModal from "../../components/common/DatePickerModal";
import TimePickerModal from "../../components/common/TimePickerModal";
import StatePickerModal from "../../components/common/StatePickerModal";

import { useMatchKundliMutation } from "../../redux/KundliApi";

const KundliMatching = () => {
  const router = useRouter();

  // Boy Details State
  const [boyName, setBoyName] = useState("");
  const [boyDob, setBoyDob] = useState("");
  const [boyTob, setBoyTob] = useState("");
  const [boyCity, setBoyCity] = useState("");
  const [boyUnknownTime, setBoyUnknownTime] = useState(false);

  // Girl Details State
  const [girlName, setGirlName] = useState("");
  const [girlDob, setGirlDob] = useState("");
  const [girlTob, setGirlTob] = useState("");
  const [girlCity, setGirlCity] = useState("");
  const [girlUnknownTime, setGirlUnknownTime] = useState(false);

  // Modals Visibility
  const [showBoyDobPicker, setShowBoyDobPicker] = useState(false);
  const [showBoyTimePicker, setShowBoyTimePicker] = useState(false);
  const [showBoyPlacePicker, setShowBoyPlacePicker] = useState(false);

  const [showGirlDobPicker, setShowGirlDobPicker] = useState(false);
  const [showGirlTimePicker, setShowGirlTimePicker] = useState(false);
  const [showGirlPlacePicker, setShowGirlPlacePicker] = useState(false);

  // RTK Query API Hook
  const [matchKundli, { isLoading }] = useMatchKundliMutation();

  const formatTimeTo12Hr = (time24) => {
    if (!time24) return "";
    const parts = time24.split(":");
    let hour = parseInt(parts[0], 10);
    const min = parts[1] || "00";
    if (isNaN(hour)) return time24;
    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12;
    return `${hour}:${min} ${ampm}`;
  };

  const handleClearBoy = () => {
    setBoyName("");
    setBoyDob("");
    setBoyTob("");
    setBoyCity("");
    setBoyUnknownTime(false);
  };

  const handleClearGirl = () => {
    setGirlName("");
    setGirlDob("");
    setGirlTob("");
    setGirlCity("");
    setGirlUnknownTime(false);
  };

  const handleMatchHoroscope = async () => {
    if (!boyName.trim()) {
      Alert.alert("Missing Field", "Please enter Boy's name");
      return;
    }
    if (!boyDob) {
      Alert.alert("Missing Field", "Please select Boy's date of birth");
      return;
    }
    if (!boyUnknownTime && !boyTob) {
      Alert.alert(
        "Missing Field",
        "Please select Boy's birth time or check 'Unknown time'",
      );
      return;
    }
    if (!boyCity.trim()) {
      Alert.alert("Missing Field", "Please select or enter Boy's birth place");
      return;
    }

    if (!girlName.trim()) {
      Alert.alert("Missing Field", "Please enter Girl's name");
      return;
    }
    if (!girlDob) {
      Alert.alert("Missing Field", "Please select Girl's date of birth");
      return;
    }
    if (!girlUnknownTime && !girlTob) {
      Alert.alert(
        "Missing Field",
        "Please select Girl's birth time or check 'Unknown time'",
      );
      return;
    }
    if (!girlCity.trim()) {
      Alert.alert("Missing Field", "Please select or enter Girl's birth place");
      return;
    }

    const payload = {
      boyName: boyName.trim(),
      boyDob: boyDob,
      boyTob: boyUnknownTime ? "12:00:00" : boyTob || "12:00:00",
      boyCity: boyCity.trim(),
      girlName: girlName.trim(),
      girlDob: girlDob,
      girlTob: girlUnknownTime ? "12:00:00" : girlTob || "12:00:00",
      girlCity: girlCity.trim(),
      la: "hi",
      details: true,
    };

    try {
      const response = await matchKundli(payload).unwrap();
      const matchData = response?.data || response;

      router.push({
        pathname: "/CompatibilityResult",
        params: {
          data: JSON.stringify(matchData),
          boyName: boyName.trim(),
          girlName: girlName.trim(),
        },
      });
    } catch (error) {
      console.log("Kundli match error:", error);
      Alert.alert(
        "Match Failed",
        error?.data?.message ||
          error?.message ||
          "Failed to match Kundlis. Please check the entered birth details and try again.",
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid={true}
        extraScrollHeight={20}
        extraHeight={120}
        contentContainerStyle={styles.content}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity activeOpacity={0.8} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={RF(22)} color={Colors.primary} />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Kundli Matching</Text>

          <Ionicons name="sparkles" size={RF(20)} color={Colors.primary} />
        </View>

        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.heroIconContainer}>
            <LinearGradient
              colors={["#FFF8EF", "#FFE7C7"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.heroIconCircle}
            >
              <Ionicons
                name="sparkles-outline"
                size={RF(34)}
                color={Colors.primary}
              />
            </LinearGradient>
          </View>

          <Text style={styles.heroTitle}>Traditional Horoscope Matching</Text>
          <Text style={styles.heroSubtitle}>
            Enter both your details to match your horoscopes & check Gun Milan
          </Text>

          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Ionicons name="star" size={RF(13)} color={Colors.primary} />
            <View style={styles.dividerLine} />
          </View>
        </View>

        {/* =========================
            BOY DETAILS CARD
        ========================== */}
        <View style={styles.formCard}>
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleRow}>
              <Ionicons
                name="person-outline"
                size={RF(22)}
                color={Colors.primary}
              />
              <Text style={styles.cardTitle}>Boy's Details</Text>
            </View>

            <TouchableOpacity activeOpacity={0.8} onPress={handleClearBoy}>
              <Text style={styles.clearText}>Clear</Text>
            </TouchableOpacity>
          </View>

          {/* Name & DOB */}
          <View style={styles.row}>
            <View style={styles.halfInput}>
              <Text style={styles.label}>Name</Text>
              <View style={styles.inputBox}>
                <Ionicons
                  name="person-outline"
                  size={RF(16)}
                  color={Colors.primary}
                />
                <TextInput
                  placeholder="Enter name"
                  placeholderTextColor="#999"
                  value={boyName}
                  onChangeText={setBoyName}
                  style={styles.input}
                />
              </View>
            </View>

            <View style={styles.halfInput}>
              <Text style={styles.label}>Birth Date</Text>
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.inputBox}
                onPress={() => setShowBoyDobPicker(true)}
              >
                <Text
                  numberOfLines={1}
                  style={[styles.pickerText, !boyDob && styles.placeholderText]}
                >
                  {boyDob || "YYYY-MM-DD"}
                </Text>
                <Ionicons name="calendar-outline" size={RF(18)} color="#777" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Birth Time + Unknown Time */}
          <View style={styles.row}>
            <View style={styles.halfInput}>
              <Text style={styles.label}>Birth Time</Text>
              <TouchableOpacity
                activeOpacity={0.8}
                disabled={boyUnknownTime}
                style={[
                  styles.inputBox,
                  boyUnknownTime && styles.inputDisabled,
                ]}
                onPress={() => setShowBoyTimePicker(true)}
              >
                <Text
                  numberOfLines={1}
                  style={[
                    styles.pickerText,
                    (!boyTob || boyUnknownTime) && styles.placeholderText,
                  ]}
                >
                  {boyUnknownTime
                    ? "12:00 PM (Default)"
                    : boyTob
                      ? formatTimeTo12Hr(boyTob)
                      : "HH:MM"}
                </Text>
                <Ionicons
                  name="time-outline"
                  size={RF(18)}
                  color={boyUnknownTime ? "#BBB" : "#777"}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.halfInput}>
              <Text style={styles.labelInvisible}>.</Text>
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.checkboxRow}
                onPress={() => {
                  const next = !boyUnknownTime;
                  setBoyUnknownTime(next);
                  if (next) setBoyTob("12:00:00");
                }}
              >
                <View
                  style={[
                    styles.checkbox,
                    boyUnknownTime && styles.checkboxActive,
                  ]}
                >
                  {boyUnknownTime && (
                    <Ionicons name="checkmark" size={RF(12)} color="#FFF" />
                  )}
                </View>
                <Text style={styles.checkboxText}>
                  I don't know exact{"\n"}time of birth
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Birth Place */}
          <Text style={styles.label}>Birth Place</Text>
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.inputBoxFull}
            onPress={() => setShowBoyPlacePicker(true)}
          >
            <Ionicons
              name="location-outline"
              size={RF(18)}
              color={Colors.primary}
            />
            <Text
              numberOfLines={1}
              style={[
                styles.pickerText,
                !boyCity && styles.placeholderText,
                { flex: 1, marginLeft: wp(2) },
              ]}
            >
              {boyCity || "Select or enter birth place"}
            </Text>
            <Ionicons name="search-outline" size={RF(18)} color="#777" />
          </TouchableOpacity>
        </View>

        {/* =========================
            GIRL DETAILS CARD
        ========================== */}
        <View style={styles.formCard}>
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleRow}>
              <Ionicons
                name="person-outline"
                size={RF(22)}
                color={Colors.primary}
              />
              <Text style={styles.cardTitle}>Girl's Details</Text>
            </View>

            <TouchableOpacity activeOpacity={0.8} onPress={handleClearGirl}>
              <Text style={styles.clearText}>Clear</Text>
            </TouchableOpacity>
          </View>

          {/* Name & DOB */}
          <View style={styles.row}>
            <View style={styles.halfInput}>
              <Text style={styles.label}>Name</Text>
              <View style={styles.inputBox}>
                <Ionicons
                  name="person-outline"
                  size={RF(16)}
                  color={Colors.primary}
                />
                <TextInput
                  placeholder="Enter name"
                  placeholderTextColor="#999"
                  value={girlName}
                  onChangeText={setGirlName}
                  style={styles.input}
                />
              </View>
            </View>

            <View style={styles.halfInput}>
              <Text style={styles.label}>Birth Date</Text>
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.inputBox}
                onPress={() => setShowGirlDobPicker(true)}
              >
                <Text
                  numberOfLines={1}
                  style={[
                    styles.pickerText,
                    !girlDob && styles.placeholderText,
                  ]}
                >
                  {girlDob || "YYYY-MM-DD"}
                </Text>
                <Ionicons name="calendar-outline" size={RF(18)} color="#777" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Birth Time + Unknown Time */}
          <View style={styles.row}>
            <View style={styles.halfInput}>
              <Text style={styles.label}>Birth Time</Text>
              <TouchableOpacity
                activeOpacity={0.8}
                disabled={girlUnknownTime}
                style={[
                  styles.inputBox,
                  girlUnknownTime && styles.inputDisabled,
                ]}
                onPress={() => setShowGirlTimePicker(true)}
              >
                <Text
                  numberOfLines={1}
                  style={[
                    styles.pickerText,
                    (!girlTob || girlUnknownTime) && styles.placeholderText,
                  ]}
                >
                  {girlUnknownTime
                    ? "12:00 PM (Default)"
                    : girlTob
                      ? formatTimeTo12Hr(girlTob)
                      : "HH:MM"}
                </Text>
                <Ionicons
                  name="time-outline"
                  size={RF(18)}
                  color={girlUnknownTime ? "#BBB" : "#777"}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.halfInput}>
              <Text style={styles.labelInvisible}>.</Text>
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.checkboxRow}
                onPress={() => {
                  const next = !girlUnknownTime;
                  setGirlUnknownTime(next);
                  if (next) setGirlTob("12:00:00");
                }}
              >
                <View
                  style={[
                    styles.checkbox,
                    girlUnknownTime && styles.checkboxActive,
                  ]}
                >
                  {girlUnknownTime && (
                    <Ionicons name="checkmark" size={RF(12)} color="#FFF" />
                  )}
                </View>
                <Text style={styles.checkboxText}>
                  I don't know exact{"\n"}time of birth
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Birth Place */}
          <Text style={styles.label}>Birth Place</Text>
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.inputBoxFull}
            onPress={() => setShowGirlPlacePicker(true)}
          >
            <Ionicons
              name="location-outline"
              size={RF(18)}
              color={Colors.primary}
            />
            <Text
              numberOfLines={1}
              style={[
                styles.pickerText,
                !girlCity && styles.placeholderText,
                { flex: 1, marginLeft: wp(2) },
              ]}
            >
              {girlCity || "Select or enter birth place"}
            </Text>
            <Ionicons name="search-outline" size={RF(18)} color="#777" />
          </TouchableOpacity>
        </View>

        {/* Match Horoscope Button */}
        <TouchableOpacity
          activeOpacity={0.9}
          disabled={isLoading}
          style={[styles.buttonWrapper, isLoading && { opacity: 0.8 }]}
          onPress={handleMatchHoroscope}
        >
          <LinearGradient
            colors={["#43A047", "#2E7D32"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.matchButton}
          >
            <View style={styles.buttonIconContainer}>
              {isLoading ? (
                <ActivityIndicator size="small" color="#2E7D32" />
              ) : (
                <Ionicons name="sparkles" size={RF(18)} color="#2E7D32" />
              )}
            </View>

            <Text style={styles.matchButtonText}>
              {isLoading ? "Matching Horoscopes..." : "Match Horoscope"}
            </Text>

            <Ionicons name="arrow-forward" size={RF(20)} color="#FFF" />
          </LinearGradient>
        </TouchableOpacity>
      </KeyboardAwareScrollView>

      {/* Boy Date Picker */}
      <DatePickerModal
        visible={showBoyDobPicker}
        onClose={() => setShowBoyDobPicker(false)}
        onSelectDate={(date) => setBoyDob(date)}
        initialDate={boyDob}
      />

      {/* Boy Time Picker */}
      <TimePickerModal
        visible={showBoyTimePicker}
        onClose={() => setShowBoyTimePicker(false)}
        onSelectTime={(time) => setBoyTob(time)}
        initialTime={boyTob}
      />

      {/* Boy Place Picker */}
      <StatePickerModal
        visible={showBoyPlacePicker}
        onClose={() => setShowBoyPlacePicker(false)}
        onSelectState={(place) => setBoyCity(place)}
        selectedState={boyCity}
        title="Select Boy's Birth Place"
      />

      {/* Girl Date Picker */}
      <DatePickerModal
        visible={showGirlDobPicker}
        onClose={() => setShowGirlDobPicker(false)}
        onSelectDate={(date) => setGirlDob(date)}
        initialDate={girlDob}
      />

      {/* Girl Time Picker */}
      <TimePickerModal
        visible={showGirlTimePicker}
        onClose={() => setShowGirlTimePicker(false)}
        onSelectTime={(time) => setGirlTob(time)}
        initialTime={girlTob}
      />

      {/* Girl Place Picker */}
      <StatePickerModal
        visible={showGirlPlacePicker}
        onClose={() => setShowGirlPlacePicker(false)}
        onSelectState={(place) => setGirlCity(place)}
        selectedState={girlCity}
        title="Select Girl's Birth Place"
      />
    </SafeAreaView>
  );
};

export default KundliMatching;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF8F4",
  },
  content: {
    paddingHorizontal: wp(4),
    paddingBottom: hp(6),
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: hp(1),
    marginBottom: hp(2),
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    color: Colors.primary,
    fontSize: RF(18),
    fontWeight: "700",
    marginHorizontal: wp(2),
  },
  heroSection: {
    alignItems: "center",
    marginBottom: hp(2.5),
  },
  heroIconContainer: {
    marginBottom: hp(1.5),
  },
  heroIconCircle: {
    width: wp(20),
    height: wp(20),
    borderRadius: wp(10),
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#F39C12",
    shadowOpacity: 0.18,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    elevation: 5,
  },
  heroTitle: {
    color: "#222",
    fontSize: RF(19),
    fontWeight: "700",
    textAlign: "center",
  },
  heroSubtitle: {
    marginTop: hp(0.5),
    color: "#777",
    textAlign: "center",
    fontSize: RF(12),
    lineHeight: RF(18),
    fontWeight: "400",
    paddingHorizontal: wp(4),
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginTop: hp(1.5),
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#F3D7B6",
    marginHorizontal: wp(3),
  },
  formCard: {
    backgroundColor: "#FFF",
    borderRadius: wp(4.5),
    padding: wp(4),
    marginBottom: hp(2),
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: hp(1.5),
  },
  cardTitleRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardTitle: {
    marginLeft: wp(2),
    color: "#222",
    fontSize: RF(16),
    fontWeight: "700",
  },
  clearText: {
    color: Colors.primary,
    fontSize: RF(13),
    fontWeight: "600",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: hp(1.5),
  },
  halfInput: {
    width: "48%",
  },
  label: {
    color: "#444",
    fontSize: RF(12.5),
    fontWeight: "600",
    marginBottom: hp(0.6),
  },
  labelInvisible: {
    color: "transparent",
    marginBottom: hp(0.6),
    fontSize: RF(12.5),
  },
  inputBox: {
    height: hp(5.8),
    backgroundColor: "#FAFAFA",
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: wp(3),
    paddingHorizontal: wp(3),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  inputBoxFull: {
    height: hp(5.8),
    backgroundColor: "#FAFAFA",
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: wp(3),
    paddingHorizontal: wp(3),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  input: {
    flex: 1,
    marginLeft: wp(2),
    color: "#222",
    fontSize: RF(12.5),
    fontWeight: "400",
  },
  inputDisabled: {
    backgroundColor: "#F0F0F0",
    borderColor: "#E0E0E0",
  },
  pickerText: {
    fontSize: RF(12.5),
    color: "#222",
    fontWeight: "400",
    flex: 1,
  },
  placeholderText: {
    color: "#999",
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: hp(0.8),
  },
  checkbox: {
    width: wp(5),
    height: wp(5),
    borderRadius: wp(1),
    borderWidth: 1.5,
    borderColor: "#CFCFCF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: wp(2),
    backgroundColor: "#FFF",
  },
  checkboxActive: {
    backgroundColor: "#43A047",
    borderColor: "#43A047",
  },
  checkboxText: {
    flex: 1,
    color: "#666",
    fontSize: RF(11),
    lineHeight: RF(15),
    fontWeight: "400",
  },
  buttonWrapper: {
    marginTop: hp(1),
    marginBottom: hp(2),
  },
  matchButton: {
    height: hp(6.5),
    borderRadius: wp(4),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: wp(4),
    shadowColor: "#2E7D32",
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    elevation: 5,
  },
  buttonIconContainer: {
    width: wp(9),
    height: wp(9),
    borderRadius: wp(4.5),
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  matchButtonText: {
    flex: 1,
    textAlign: "center",
    color: "#FFFFFF",
    fontSize: RF(15),
    fontWeight: "700",
    marginHorizontal: wp(2),
  },
});
