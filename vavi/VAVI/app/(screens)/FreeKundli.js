import { useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "../../constants/Colors";
import { hp, RF, wp } from "../../utils/responsive";

import DatePickerModal from "../../components/common/DatePickerModal";
import TimePickerModal from "../../components/common/TimePickerModal";
import StatePickerModal from "../../components/common/StatePickerModal";

import {
  useGenerateKundliMutation,
  useGetFullKundliMutation,
} from "../../redux/KundliApi";

import {
  useDeleteSavedKundliMutation,
  useGetSavedKundliQuery,
  useSaveKundliMutation,
} from "../../redux/SaveKundliApi";

import {
  DEFAULT_COORDINATES,
  getCoordinatesForPlace,
} from "../../utils/cityCoordinates";

export default function FreeKundli() {
  const [activeTab, setActiveTab] = useState("new");

  const [name, setName] = useState("");
  const [gender, setGender] = useState("MALE");
  const [dob, setDob] = useState("");
  const [birthTime, setBirthTime] = useState("");
  const [birthPlace, setBirthPlace] = useState("");
  const [coordinates, setCoordinates] = useState(DEFAULT_COORDINATES);

  const [unknownTime, setUnknownTime] = useState(false);

  // Modals state
  const [showDobPicker, setShowDobPicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showPlacePicker, setShowPlacePicker] = useState(false);

  const [getFullKundli, { isLoading: fullGenerating }] =
    useGetFullKundliMutation();
  const [generateKundli, { isLoading: generating }] =
    useGenerateKundliMutation();

  const [saveKundli] = useSaveKundliMutation();
  const [deleteSavedKundli] = useDeleteSavedKundliMutation();

  const { data: savedData, isLoading: savedLoading } = useGetSavedKundliQuery();

  const handleGenerateKundli = async (customPayload) => {
    try {
      // Guard against React Native onPress event being passed as customPayload
      const isCustomData =
        customPayload &&
        typeof customPayload === "object" &&
        !customPayload.nativeEvent &&
        customPayload.name;

      const resolvedCoords = isCustomData
        ? {
            latitude:
              customPayload.latitude ||
              getCoordinatesForPlace(
                customPayload.city || customPayload.birthPlace,
              ).latitude,
            longitude:
              customPayload.longitude ||
              getCoordinatesForPlace(
                customPayload.city || customPayload.birthPlace,
              ).longitude,
            timezone: customPayload.timezone || "5.5",
          }
        : coordinates?.latitude
          ? coordinates
          : getCoordinatesForPlace(birthPlace || "Delhi");

      const payload = isCustomData
        ? {
            ...customPayload,
            latitude: resolvedCoords.latitude,
            longitude: resolvedCoords.longitude,
            timezone: resolvedCoords.timezone,
          }
        : {
            name: name || "User",
            gender: gender || "MALE",
            dob: dob || "2000-01-01",
            tob: unknownTime ? "12:00:00" : birthTime || "12:00:00",
            city: birthPlace || "Delhi",
            birthPlace: birthPlace || "Delhi",
            latitude: resolvedCoords.latitude,
            longitude: resolvedCoords.longitude,
            timezone: resolvedCoords.timezone,
            la: "hi",
          };

      let response;
      try {
        response = await getFullKundli(payload).unwrap();
      } catch (err) {
        // Fallback to basic generate endpoint if full kundli fails
        response = await generateKundli(payload).unwrap();
      }

      if (!customPayload) {
        try {
          await saveKundli({
            name: name || "User",
            relation: "Self",
            gender: gender || "MALE",
            dob: dob || "2000-01-01",
            tob: unknownTime ? "12:00:00" : birthTime || "12:00:00",
            city: birthPlace || "Delhi",
            birthPlace: birthPlace || "Delhi",
            latitude: resolvedCoords.latitude,
            longitude: resolvedCoords.longitude,
            timezone: resolvedCoords.timezone,
          }).unwrap();
        } catch (saveErr) {
          console.log("save kundli err", saveErr);
        }
      }

      const basePayload =
        response && typeof response === "object"
          ? response?.data && typeof response.data === "object"
            ? { ...response, ...response.data }
            : response
          : {};

      const kundliPayload = {
        ...basePayload,
        dob: basePayload?.dob || payload.dob,
        tob: basePayload?.tob || payload.tob,
        city: basePayload?.city || payload.city,
        birthPlace: basePayload?.birthPlace || payload.birthPlace,
        latitude: resolvedCoords.latitude,
        longitude: resolvedCoords.longitude,
        timezone: resolvedCoords.timezone,
        gender: basePayload?.gender || payload.gender,
        name: basePayload?.name || payload.name,
      };

      router.push({
        pathname: "/kundli",
        params: {
          data: JSON.stringify(kundliPayload),
        },
      });
    } catch (error) {
      console.log("kundli error", error);
    }
  };

  const handleOpenSavedKundli = (item) => {
    handleGenerateKundli({
      name: item.name,
      gender: item.gender ? item.gender.toUpperCase() : "MALE",
      dob: item.dob,
      tob: item.tob,
      city: item.city || item.birthPlace,
      birthPlace: item.birthPlace || item.city,
      la: "hi",
    });
  };

  const handleDeleteSaved = async (id) => {
    try {
      await deleteSavedKundli(id).unwrap();
    } catch (err) {
      console.log("delete saved kundli err", err);
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
            <Ionicons
              name="arrow-back"
              size={RF(24)}
              color={Colors.darkBrown}
            />
          </TouchableOpacity>

          <Text style={styles.logo}>VAVI</Text>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => router.push("/Notification")}
          >
            <Ionicons
              name="notifications-outline"
              size={RF(23)}
              color={Colors.darkBrown}
            />
          </TouchableOpacity>
        </View>

        {/* Heading */}
        <Text style={styles.heading}>Free Kundli Online</Text>

        {/* Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setActiveTab("saved")}
            style={[styles.tab, activeTab === "saved" && styles.activeTab]}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "saved" && styles.activeTabText,
              ]}
            >
              Saved Kundli
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setActiveTab("new")}
            style={[styles.tab, activeTab === "new" && styles.activeTab]}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "new" && styles.activeTabText,
              ]}
            >
              New Kundli
            </Text>
          </TouchableOpacity>
        </View>

        {/* ========================= */}
        {/* NEW KUNDLI TAB */}
        {/* ========================= */}
        {activeTab === "new" && (
          <View style={styles.formCard}>
            {/* Card Heading */}
            <View style={styles.cardHeader}>
              <Ionicons
                name="document-text-outline"
                size={RF(20)}
                color={Colors.primary}
              />

              <View style={{ marginLeft: wp(2) }}>
                <Text style={styles.cardTitle}>Enter Details</Text>
                <Text style={styles.cardSubtitle}>
                  Please enter your birth details to generate Kundli
                </Text>
              </View>
            </View>

            {/* Name */}
            <Text style={styles.label}>Name</Text>
            <View style={styles.inputContainer}>
              <Ionicons
                name="person-outline"
                size={RF(18)}
                color={Colors.primary}
              />
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Enter Name"
                placeholderTextColor="#999"
                style={styles.input}
              />
            </View>

            {/* Gender */}
            <Text style={styles.label}>Gender</Text>
            <View style={styles.genderRow}>
              {[
                { label: "Male", value: "MALE", icon: "male" },
                { label: "Female", value: "FEMALE", icon: "female" },
                { label: "Others", value: "OTHER", icon: "person" },
              ].map((item) => {
                const isSelected = gender === item.value;
                return (
                  <TouchableOpacity
                    key={item.value}
                    activeOpacity={0.8}
                    style={[
                      styles.genderOption,
                      isSelected && styles.genderOptionActive,
                    ]}
                    onPress={() => setGender(item.value)}
                  >
                    <Ionicons
                      name={item.icon}
                      size={RF(16)}
                      color={isSelected ? "#FFF" : Colors.darkBrown}
                    />
                    <Text
                      style={[
                        styles.genderOptionText,
                        isSelected && styles.genderOptionTextActive,
                      ]}
                    >
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Date of Birth */}
            <Text style={styles.label}>Date of Birth</Text>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.pickerInputContainer}
              onPress={() => setShowDobPicker(true)}
            >
              <View style={styles.pickerInputLeft}>
                <Ionicons
                  name="calendar-outline"
                  size={RF(18)}
                  color={Colors.primary}
                />
                <Text
                  style={[
                    styles.pickerInputText,
                    !dob && styles.placeholderText,
                  ]}
                >
                  {dob || "Select Date of Birth"}
                </Text>
              </View>
              <Ionicons name="chevron-down" size={RF(16)} color="#888" />
            </TouchableOpacity>

            {/* Birth Time */}
            <Text style={styles.label}>Birth Time</Text>
            <TouchableOpacity
              activeOpacity={0.8}
              style={[
                styles.pickerInputContainer,
                unknownTime && styles.disabledPicker,
              ]}
              disabled={unknownTime}
              onPress={() => setShowTimePicker(true)}
            >
              <View style={styles.pickerInputLeft}>
                <Ionicons
                  name="time-outline"
                  size={RF(18)}
                  color={unknownTime ? "#BBB" : Colors.primary}
                />
                <Text
                  style={[
                    styles.pickerInputText,
                    (!birthTime || unknownTime) && styles.placeholderText,
                  ]}
                >
                  {unknownTime
                    ? "Time Unknown (12:00:00)"
                    : birthTime
                      ? birthTime.length === 5
                        ? `${birthTime}:00`
                        : birthTime
                      : "Select Birth Time (HH:MM:SS)"}
                </Text>
              </View>
              <Ionicons name="chevron-down" size={RF(16)} color="#888" />
            </TouchableOpacity>

            {/* Unknown Time Checkbox */}
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.checkboxRow}
              onPress={() => {
                const next = !unknownTime;
                setUnknownTime(next);
                if (next) {
                  setBirthTime("12:00:00");
                }
              }}
            >
              <Ionicons
                name={unknownTime ? "checkbox" : "square-outline"}
                size={RF(20)}
                color={Colors.primary}
              />
              <Text style={styles.checkboxText}>
                I don't know my exact time of birth
              </Text>
            </TouchableOpacity>

            {/* Birth Place */}
            <Text style={styles.label}>Birth Place</Text>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.pickerInputContainer}
              onPress={() => setShowPlacePicker(true)}
            >
              <View style={styles.pickerInputLeft}>
                <Ionicons
                  name="location-outline"
                  size={RF(18)}
                  color={Colors.primary}
                />
                <Text
                  style={[
                    styles.pickerInputText,
                    !birthPlace && styles.placeholderText,
                  ]}
                >
                  {birthPlace || "Select Birth Place / State"}
                </Text>
              </View>
              <Ionicons name="search-outline" size={RF(18)} color="#888" />
            </TouchableOpacity>

            {/* Continue Button */}
            <TouchableOpacity
              activeOpacity={0.8}
              style={[
                styles.continueButton,
                (generating || fullGenerating) && { opacity: 0.7 },
              ]}
              disabled={generating || fullGenerating}
              onPress={() => handleGenerateKundli()}
            >
              <Text style={styles.continueText}>
                {generating || fullGenerating ? "Generating..." : "Continue"}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ========================= */}
        {/* SAVED KUNDLI TAB */}
        {/* ========================= */}
        {activeTab === "saved" && (
          <FlatList
            data={savedData?.data || []}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => handleOpenSavedKundli(item)}
                style={styles.savedCard}
              >
                {/* Top Row */}
                <View style={styles.savedTopRow}>
                  <View style={styles.userSection}>
                    <View style={styles.avatar}>
                      <Ionicons name="person" size={RF(26)} color="#FFF" />
                    </View>

                    <View style={styles.userInfo}>
                      <Text style={styles.userName}>
                        {item.name}
                        <Text style={styles.gender}> ({item.gender})</Text>
                      </Text>

                      <Text style={styles.dateText}>
                        {item.dob}, {item.tob}
                      </Text>

                      <Text style={styles.placeText}>
                        {item.birthPlace || item.city}
                      </Text>
                    </View>
                  </View>

                  {/* Action Buttons */}
                  <View style={styles.actionRow}>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      style={styles.actionButton}
                      onPress={() => handleOpenSavedKundli(item)}
                    >
                      <Ionicons
                        name="eye-outline"
                        size={RF(16)}
                        color={Colors.primary}
                      />
                    </TouchableOpacity>

                    <TouchableOpacity
                      activeOpacity={0.8}
                      style={styles.actionButton}
                      onPress={() => handleDeleteSaved(item.id)}
                    >
                      <Ionicons
                        name="trash-outline"
                        size={RF(16)}
                        color="#F44336"
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Divider */}
                <View style={styles.divider} />

                {/* Bottom Details */}
                <View style={styles.detailRow}>
                  <View style={styles.detailItem}>
                    <Ionicons
                      name="calendar-outline"
                      size={RF(17)}
                      color={Colors.primary}
                    />
                    <Text style={styles.detailLabel}>Date</Text>
                    <Text style={styles.detailValue}>{item.dob}</Text>
                  </View>

                  <View style={styles.detailItem}>
                    <Ionicons
                      name="time-outline"
                      size={RF(17)}
                      color={Colors.primary}
                    />
                    <Text style={styles.detailLabel}>Time</Text>
                    <Text style={styles.detailValue}>{item.tob}</Text>
                  </View>

                  <View style={styles.detailItem}>
                    <Ionicons
                      name="location-outline"
                      size={RF(17)}
                      color={Colors.primary}
                    />
                    <Text style={styles.detailLabel}>Place</Text>
                    <Text style={styles.detailValue}>{item.birthPlace}</Text>
                  </View>

                  <View style={styles.detailItem}>
                    <Ionicons
                      name="male-female-outline"
                      size={RF(17)}
                      color={Colors.primary}
                    />
                    <Text style={styles.detailLabel}>Gender</Text>
                    <Text style={styles.detailValue}>{item.gender}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />
        )}
      </KeyboardAwareScrollView>

      {/* Date of Birth Picker Modal */}
      <DatePickerModal
        visible={showDobPicker}
        onClose={() => setShowDobPicker(false)}
        onSelectDate={(date) => setDob(date)}
        initialDate={dob}
      />

      {/* Time of Birth Picker Modal */}
      <TimePickerModal
        visible={showTimePicker}
        onClose={() => setShowTimePicker(false)}
        onSelectTime={(time) => setBirthTime(time)}
        initialTime={birthTime}
      />

      {/* Birth Place / State Picker Modal */}
      <StatePickerModal
        visible={showPlacePicker}
        onClose={() => setShowPlacePicker(false)}
        onSelectState={(place, item) => {
          setBirthPlace(place);
          if (item && item.latitude) {
            setCoordinates(item);
          } else {
            setCoordinates(getCoordinatesForPlace(place));
          }
        }}
        selectedState={birthPlace}
        title="Select Birth Place"
      />
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
    paddingBottom: hp(12),
  },

  /* ================= HEADER ================= */
  header: {
    marginTop: hp(1),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  logo: {
    fontSize: RF(28),
    color: Colors.primary,
    fontWeight: "700",
    letterSpacing: 1,
  },

  heading: {
    marginTop: hp(2),
    textAlign: "center",
    color: Colors.darkBrown,
    fontSize: RF(20),
    fontWeight: "600",
  },

  /* ================= TABS ================= */
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    borderRadius: wp(8),
    borderWidth: 1,
    borderColor: Colors.primary,
    overflow: "hidden",
    marginTop: hp(2),
    marginBottom: hp(2),
  },

  tab: {
    flex: 1,
    height: hp(6),
    justifyContent: "center",
    alignItems: "center",
  },

  activeTab: {
    backgroundColor: Colors.primary,
  },

  tabText: {
    color: Colors.darkBrown,
    fontSize: RF(14),
    fontWeight: "500",
  },

  activeTabText: {
    color: "#FFF",
    fontWeight: "600",
  },

  /* ================= FORM CARD ================= */
  formCard: {
    backgroundColor: "#FFF",
    borderRadius: wp(4),
    padding: wp(4),
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    elevation: 3,
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hp(2),
  },

  cardTitle: {
    color: Colors.darkBrown,
    fontSize: RF(15),
    fontWeight: "600",
  },

  cardSubtitle: {
    marginTop: hp(0.2),
    color: "#888",
    fontSize: RF(11),
    fontWeight: "400",
  },

  /* ================= INPUT & GENDER ================= */
  label: {
    marginBottom: hp(0.8),
    marginTop: hp(1.4),
    color: Colors.darkBrown,
    fontSize: RF(13),
    fontWeight: "500",
  },

  inputContainer: {
    height: hp(6.5),
    borderWidth: 1,
    borderColor: "#E7E7E7",
    borderRadius: wp(3),
    backgroundColor: "#FFF",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: wp(3),
  },

  input: {
    flex: 1,
    marginLeft: wp(3),
    color: Colors.darkBrown,
    fontSize: RF(14),
    fontWeight: "400",
  },

  genderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: hp(0.5),
  },

  genderOption: {
    flex: 1,
    height: hp(5.5),
    marginHorizontal: wp(1),
    borderRadius: wp(2.5),
    borderWidth: 1.2,
    borderColor: "#E7E7E7",
    backgroundColor: "#FAFAFA",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: wp(2),
  },

  genderOptionActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },

  genderOptionText: {
    marginLeft: wp(1.5),
    fontSize: RF(13),
    fontWeight: "500",
    color: Colors.darkBrown,
  },

  genderOptionTextActive: {
    color: "#FFF",
    fontWeight: "700",
  },

  /* ================= PICKER INPUTS ================= */
  pickerInputContainer: {
    height: hp(6.5),
    borderWidth: 1,
    borderColor: "#E7E7E7",
    borderRadius: wp(3),
    backgroundColor: "#FFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: wp(3),
  },

  pickerInputLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  pickerInputText: {
    marginLeft: wp(3),
    color: Colors.darkBrown,
    fontSize: RF(14),
    fontWeight: "500",
  },

  placeholderText: {
    color: "#999",
    fontWeight: "400",
  },

  disabledPicker: {
    backgroundColor: "#F7F7F7",
    borderColor: "#EFEFEF",
    opacity: 0.6,
  },

  /* ================= CHECKBOX ================= */
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: hp(1.8),
  },

  checkboxText: {
    marginLeft: wp(2),
    color: "#666",
    fontSize: RF(12),
    fontWeight: "400",
  },

  /* ================= BUTTON ================= */
  continueButton: {
    height: hp(6),
    backgroundColor: Colors.primary,
    borderRadius: wp(3),
    justifyContent: "center",
    alignItems: "center",
    marginTop: hp(3),
  },

  continueText: {
    color: "#FFF",
    fontSize: RF(15),
    fontWeight: "600",
  },

  /* ================= SAVED KUNDLI CARD ================= */
  savedCard: {
    backgroundColor: "#FFF",
    borderRadius: wp(4),
    padding: wp(4),
    marginBottom: hp(2),
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    elevation: 3,
  },

  savedTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  userSection: {
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
  },

  avatar: {
    width: wp(16),
    height: wp(16),
    borderRadius: wp(8),
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },

  userInfo: {
    flex: 1,
    marginLeft: wp(3),
  },

  userName: {
    color: Colors.darkBrown,
    fontSize: RF(15),
    fontWeight: "600",
  },

  gender: {
    color: Colors.primary,
    fontSize: RF(12),
    fontWeight: "500",
  },

  dateText: {
    marginTop: hp(0.4),
    color: "#666",
    fontSize: RF(12),
    fontWeight: "400",
  },

  placeText: {
    marginTop: hp(0.3),
    color: "#888",
    fontSize: RF(12),
    fontWeight: "400",
  },

  /* ================= ACTION BUTTONS ================= */
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  actionButton: {
    width: wp(10),
    height: wp(10),
    borderRadius: wp(5),
    backgroundColor: "#FFF5EF",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: wp(2),
  },

  /* ================= DIVIDER ================= */
  divider: {
    height: 1,
    backgroundColor: "#EEEEEE",
    marginVertical: hp(2),
  },

  /* ================= DETAILS ================= */
  detailRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  detailItem: {
    width: "48%",
    backgroundColor: "#FAFAFA",
    borderRadius: wp(3),
    paddingVertical: hp(1.3),
    paddingHorizontal: wp(3),
    marginBottom: hp(1.5),
  },

  detailLabel: {
    marginTop: hp(0.6),
    color: "#888",
    fontSize: RF(11),
    fontWeight: "500",
  },

  detailValue: {
    marginTop: hp(0.4),
    color: Colors.darkBrown,
    fontSize: RF(13),
    fontWeight: "600",
  },
});
