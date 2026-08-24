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
import Colors from "../../constants/Colors";import { hp, RF, wp } from "../../utils/responsive";

import { useGenerateKundliMutation } from "../../redux/KundliApi";

import {
  useGetSavedKundliQuery,
  useSaveKundliMutation,
} from "../../redux/SaveKundliApi";

export default function FreeKundli() {
  const [activeTab, setActiveTab] = useState("new");

  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");
  const [birthTime, setBirthTime] = useState("");
  const [birthPlace, setBirthPlace] = useState("");

  const [unknownTime, setUnknownTime] = useState(false);

  const [generateKundli, { isLoading: generating }] =
    useGenerateKundliMutation();

  const [saveKundli] = useSaveKundliMutation();

  const { data: savedData, isLoading: savedLoading } = useGetSavedKundliQuery();

  const handleGenerateKundli = async () => {
    try {
      const payload = {
        name: name,

        gender: gender,

        dob: dob,

        tob: birthTime,

        birthPlace: birthPlace,
      };

      const response = await generateKundli(payload).unwrap();

      await saveKundli({
        name: name,

        relation: "Self",

        gender: gender,

        dob: dob,

        tob: birthTime,

        birthPlace: birthPlace,

        latitude: "19.0760",

        longitude: "72.8777",

        timezone: "5.5",
      }).unwrap();

      router.push({
        pathname: "/kundli",

        params: {
          data: JSON.stringify(response.data),
        },
      });
    } catch (error) {
      console.log("kundli error", error);
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

            <View style={styles.inputContainer}>
              <Ionicons
                name="male-female-outline"
                size={RF(18)}
                color={Colors.primary}
              />

              <TextInput
                value={gender}
                onChangeText={setGender}
                placeholder="Enter Gender"
                placeholderTextColor="#999"
                style={styles.input}
              />
            </View>

            {/* Date of Birth */}

            <Text style={styles.label}>Date of Birth</Text>

            <View style={styles.inputContainer}>
              <Ionicons
                name="calendar-outline"
                size={RF(18)}
                color={Colors.primary}
              />

              <TextInput
                value={dob}
                onChangeText={setDob}
                placeholder="dd-mm-yyyy"
                placeholderTextColor="#999"
                style={styles.input}
              />
            </View>

            {/* Birth Time */}

            <Text style={styles.label}>Birth Time</Text>

            <View style={styles.inputContainer}>
              <Ionicons
                name="time-outline"
                size={RF(18)}
                color={Colors.primary}
              />

              <TextInput
                value={birthTime}
                onChangeText={setBirthTime}
                placeholder="HH:MM"
                placeholderTextColor="#999"
                style={styles.input}
              />
            </View>

            {/* Unknown Time */}

            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.checkboxRow}
              onPress={() => setUnknownTime(!unknownTime)}
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

            <View style={styles.inputContainer}>
              <Ionicons
                name="location-outline"
                size={RF(18)}
                color={Colors.primary}
              />

              <TextInput
                value={birthPlace}
                onChangeText={setBirthPlace}
                placeholder="Enter your birth place"
                placeholderTextColor="#999"
                style={styles.input}
              />

              <Ionicons name="search-outline" size={RF(18)} color="#888" />
            </View>

            {/* Continue Button */}

            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.continueButton}
              onPress={handleGenerateKundli}
            >
              <Text style={styles.continueText}>Continue</Text>
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
              <View style={styles.savedCard}>
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

                      <Text style={styles.placeText}>{item.birthPlace}</Text>
                    </View>
                  </View>

                  {/* Action Buttons */}

                  <View style={styles.actionRow}>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      style={styles.actionButton}
                    >
                      <Ionicons
                        name="create-outline"
                        size={RF(16)}
                        color={Colors.primary}
                      />
                    </TouchableOpacity>

                    <TouchableOpacity
                      activeOpacity={0.8}
                      style={styles.actionButton}
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
              </View>
            )}
          />
        )}
      </KeyboardAwareScrollView>
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

  /* ================= INPUT ================= */

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

  /* ================= CHECKBOX ================= */

  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: hp(2),
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
