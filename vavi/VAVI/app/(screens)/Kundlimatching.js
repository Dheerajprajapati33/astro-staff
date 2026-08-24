import { useState } from "react";

import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { useRouter } from "expo-router";

import { LinearGradient } from "expo-linear-gradient";

import { Ionicons } from "@expo/vector-icons";

import Colors from "../../constants/Colors";import { hp, RF, wp } from "../../utils/responsive";

const KundliMatching = () => {
  const router = useRouter();

  const [boyUnknownTime, setBoyUnknownTime] = useState(false);

  const [girlUnknownTime, setGirlUnknownTime] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.content}
        >
          {/* Header */}

          <View style={styles.header}>
            <TouchableOpacity activeOpacity={0.8} onPress={() => router.back()}>
              <Ionicons
                name="arrow-back"
                size={RF(22)}
                color={Colors.primary}
              />
            </TouchableOpacity>

            <Text style={styles.headerTitle}>Kundli Matching</Text>

            <Ionicons name="sparkles" size={RF(20)} color={Colors.primary} />
          </View>

          {/* Hero Section */}

          <View style={styles.heroSection}>
            {/* Horoscope Icon */}

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

            {/* Heading */}

            <Text style={styles.heroTitle}>Traditional Horoscope Matching</Text>

            {/* Subtitle */}

            <Text style={styles.heroSubtitle}>
              Enter both your details to match your horoscopes
            </Text>

            {/* Decorative Divider */}

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

              <TouchableOpacity activeOpacity={0.8}>
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
                    style={styles.input}
                  />
                </View>
              </View>

              <View style={styles.halfInput}>
                <Text style={styles.label}>Birth Date</Text>

                <View style={styles.inputBox}>
                  <TextInput
                    placeholder="dd-mm-yyyy"
                    placeholderTextColor="#999"
                    style={styles.input}
                  />

                  <Ionicons
                    name="calendar-outline"
                    size={RF(18)}
                    color="#777"
                  />
                </View>
              </View>
            </View>

            {/* Boy Details Continue in Part 3 */}
            {/* Birth Time + Unknown Time */}

            <View style={styles.row}>
              <View style={styles.halfInput}>
                <Text style={styles.label}>Birth Time</Text>

                <View style={styles.inputBox}>
                  <TextInput
                    placeholder="HH:MM"
                    placeholderTextColor="#999"
                    style={styles.input}
                  />

                  <Ionicons name="time-outline" size={RF(18)} color="#777" />
                </View>
              </View>

              <View style={styles.halfInput}>
                <Text style={styles.labelInvisible}>.</Text>

                <TouchableOpacity
                  activeOpacity={0.8}
                  style={styles.checkboxRow}
                  onPress={() => setBoyUnknownTime(!boyUnknownTime)}
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
                    I don't know my{"\n"}
                    exact time of birth
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Birth Place */}

            <Text style={styles.label}>Birth Place</Text>

            <View style={styles.inputBoxFull}>
              <TextInput
                placeholder="Enter birth place"
                placeholderTextColor="#999"
                style={styles.input}
              />

              <Ionicons name="location-outline" size={RF(18)} color="#777" />
            </View>
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

              <TouchableOpacity activeOpacity={0.8}>
                <Text style={styles.clearText}>Clear</Text>
              </TouchableOpacity>
            </View>

            {/* Girl Details starts in Part 4 */}
            {/* Name & Birth Date */}

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
                    style={styles.input}
                  />
                </View>
              </View>

              <View style={styles.halfInput}>
                <Text style={styles.label}>Birth Date</Text>

                <View style={styles.inputBox}>
                  <TextInput
                    placeholder="dd-mm-yyyy"
                    placeholderTextColor="#999"
                    style={styles.input}
                  />

                  <Ionicons
                    name="calendar-outline"
                    size={RF(18)}
                    color="#777"
                  />
                </View>
              </View>
            </View>

            {/* Birth Time + Unknown Time */}

            <View style={styles.row}>
              <View style={styles.halfInput}>
                <Text style={styles.label}>Birth Time</Text>

                <View style={styles.inputBox}>
                  <TextInput
                    placeholder="HH:MM"
                    placeholderTextColor="#999"
                    style={styles.input}
                  />

                  <Ionicons name="time-outline" size={RF(18)} color="#777" />
                </View>
              </View>

              <View style={styles.halfInput}>
                <Text style={styles.labelInvisible}>.</Text>

                <TouchableOpacity
                  activeOpacity={0.8}
                  style={styles.checkboxRow}
                  onPress={() => setGirlUnknownTime(!girlUnknownTime)}
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
                    I don't know my{"\n"}
                    exact time of birth
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Birth Place */}

            <Text style={styles.label}>Birth Place</Text>

            <View style={styles.inputBoxFull}>
              <TextInput
                placeholder="Enter birth place"
                placeholderTextColor="#999"
                style={styles.input}
              />

              <Ionicons name="location-outline" size={RF(18)} color="#777" />
            </View>
          </View>

          {/* Bottom Button starts in Part 5 */}
          {/* Match Horoscope Button */}

          <TouchableOpacity
            activeOpacity={0.9}
            style={styles.buttonWrapper}
            onPress={() => {
              // TODO: Navigate to Matching Result Screen
            }}
          >
            <LinearGradient
              colors={["#43A047", "#2E7D32"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.matchButton}
            >
              {/* Left Icon */}

              <View style={styles.buttonIconContainer}>
                <Ionicons name="sparkles" size={RF(18)} color="#2E7D32" />
              </View>

              {/* Button Text */}

              <Text style={styles.matchButtonText}>Match Horoscope</Text>

              {/* Right Arrow */}

              <Ionicons name="arrow-forward" size={RF(20)} color="#FFF" />
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
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
    paddingBottom: hp(4),
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
    width: wp(22),
    height: wp(22),
    borderRadius: wp(11),

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
    fontSize: RF(20),
    fontWeight: "700",
    textAlign: "center",
  },

  heroSubtitle: {
    marginTop: hp(0.7),

    color: "#777",

    textAlign: "center",

    fontSize: RF(13),

    lineHeight: RF(20),

    fontWeight: "400",

    paddingHorizontal: wp(6),
  },

  dividerContainer: {
    flexDirection: "row",

    alignItems: "center",

    width: "100%",

    marginTop: hp(2),
  },

  dividerLine: {
    flex: 1,

    height: 1,

    backgroundColor: "#F3D7B6",

    marginHorizontal: wp(3),
  },

  formCard: {
    backgroundColor: "#FFF",

    borderRadius: wp(5),

    padding: wp(4.5),

    marginBottom: hp(2),

    shadowColor: "#000",

    shadowOpacity: 0.06,

    shadowRadius: 10,

    shadowOffset: {
      width: 0,
      height: 4,
    },

    elevation: 5,
  },

  cardHeader: {
    flexDirection: "row",

    justifyContent: "space-between",

    alignItems: "center",

    marginBottom: hp(2),
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
    marginBottom: hp(2),
  },

  halfInput: {
    width: "48%",
  },

  label: {
    color: "#444",
    fontSize: RF(13),
    fontWeight: "600",
    marginBottom: hp(0.8),
  },

  labelInvisible: {
    color: "transparent",
    marginBottom: hp(0.8),
    fontSize: RF(13),
  },

  inputBox: {
    height: hp(6.3),

    backgroundColor: "#FAFAFA",

    borderWidth: 1,

    borderColor: "#ECECEC",

    borderRadius: wp(3.5),

    paddingHorizontal: wp(3),

    flexDirection: "row",

    alignItems: "center",

    justifyContent: "space-between",
  },

  inputBoxFull: {
    height: hp(6.3),

    backgroundColor: "#FAFAFA",

    borderWidth: 1,

    borderColor: "#ECECEC",

    borderRadius: wp(3.5),

    paddingHorizontal: wp(3),

    flexDirection: "row",

    alignItems: "center",

    justifyContent: "space-between",

    marginTop: hp(0.6),
  },

  input: {
    flex: 1,

    marginLeft: wp(2),

    color: "#222",

    fontSize: RF(13),

    fontWeight: "400",
  },

  checkboxRow: {
    flexDirection: "row",

    alignItems: "center",

    marginTop: hp(1.5),
  },

  checkbox: {
    width: wp(5.3),

    height: wp(5.3),

    borderRadius: wp(1.3),

    borderWidth: 1.5,

    borderColor: "#CFCFCF",

    justifyContent: "center",

    alignItems: "center",

    marginRight: wp(2.5),

    backgroundColor: "#FFF",
  },

  checkboxActive: {
    backgroundColor: "#43A047",
    borderColor: "#43A047",
  },

  checkboxText: {
    flex: 1,

    color: "#666",

    fontSize: RF(11.5),

    lineHeight: RF(16),

    fontWeight: "400",
  },
  buttonWrapper: {
    marginTop: hp(2),
    marginBottom: hp(3),
  },

  matchButton: {
    height: hp(6.8),

    borderRadius: wp(4),

    flexDirection: "row",

    alignItems: "center",

    justifyContent: "space-between",

    paddingHorizontal: wp(4),

    shadowColor: "#2E7D32",

    shadowOpacity: 0.3,

    shadowRadius: 12,

    shadowOffset: {
      width: 0,
      height: 5,
    },

    elevation: 6,
  },

  buttonIconContainer: {
    width: wp(10),

    height: wp(10),

    borderRadius: wp(5),

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

    marginHorizontal: wp(3),
  },
});
