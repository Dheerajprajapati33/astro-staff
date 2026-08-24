import {
  ActivityIndicator,
  Alert,
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

import { useState } from "react";

import Colors from "../../constants/Colors";import { hp, RF, wp } from "../../utils/responsive";

import { useGetNumerologyMutation } from "../../redux/numerologyApi";

const SacredDetail = () => {
  const router = useRouter();

  const [fullName, setFullName] = useState("");

  const [dob, setDob] = useState("");

  const [getNumerology, { isLoading }] = useGetNumerologyMutation();

  const handleReveal = async () => {
    if (!fullName) {
      Alert.alert("Required", "Please enter your full name");

      return;
    }

    if (!dob) {
      Alert.alert("Required", "Please enter your date of birth");

      return;
    }

    try {
      const response = await getNumerology({
        fullName: fullName,

        dob: dob,
      }).unwrap();

      console.log("Numerology Result", response);

      if (response?.success) {
        router.push({
          pathname: "/yournumber",

          params: {
            fullName: response.data.fullName,

            dob: response.data.dob,

            lifePathNumber: response.data.lifePathNumber.toString(),

            title: response.data.title,

            description: response.data.description,

            aiInsight: response.data.aiInsight,
          },
        });
      }
    } catch (error) {
      console.log("Numerology Error", error);

      Alert.alert(
        "Error",
        error?.data?.message || "Unable to calculate numerology",
      );
    }
  };

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
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons
                name="arrow-back"
                size={RF(22)}
                color={Colors.primary}
              />
            </TouchableOpacity>

            <Text style={styles.headerTitle}>Your Sacred Details</Text>

            <Ionicons name="sparkles" size={RF(20)} color={Colors.primary} />
          </View>

          <View style={styles.card}>
            <View style={styles.topSection}>
              <LinearGradient
                colors={["#FFD45E", "#F4A300"]}
                style={styles.iconCircle}
              >
                <Ionicons name="sparkles-outline" size={RF(34)} color="#FFF" />
              </LinearGradient>

              <Text style={styles.title}>Tell Us About Yourself</Text>

              <Text style={styles.subtitle}>
                Your cosmic journey begins with these{"\n"}
                sacred details
              </Text>
            </View>

            {/* NAME */}

            <View style={styles.inputGroup}>
              <View style={styles.labelRow}>
                <Ionicons
                  name="person-outline"
                  size={RF(18)}
                  color={Colors.primary}
                />

                <Text style={styles.label}>Full Name</Text>
              </View>

              <TextInput
                value={fullName}
                onChangeText={setFullName}
                placeholder="Enter your full name"
                placeholderTextColor="#999"
                style={styles.textInput}
              />
            </View>

            {/* DOB */}

            <View style={styles.inputGroup}>
              <View style={styles.labelRow}>
                <Ionicons
                  name="calendar-outline"
                  size={RF(18)}
                  color={Colors.primary}
                />

                <Text style={styles.label}>Date of Birth</Text>
              </View>

              <TextInput
                value={dob}
                onChangeText={setDob}
                placeholder="YYYY-MM-DD"
                placeholderTextColor="#999"
                style={styles.textInput}
              />
            </View>

            <View style={styles.featureContainer}>
              {/* Numbers */}

              <View style={styles.featureItem}>
                <Ionicons
                  name="star-outline"
                  size={RF(28)}
                  color={Colors.primary}
                />

                <Text style={styles.featureTitle}>Numbers</Text>
              </View>

              <View style={styles.featureDivider} />

              {/* Harmony */}

              <View style={styles.featureItem}>
                <Ionicons
                  name="radio-button-off-outline"
                  size={RF(28)}
                  color={Colors.primary}
                />

                <Text style={styles.featureTitle}>Harmony</Text>
              </View>

              <View style={styles.featureDivider} />

              {/* Balance */}

              <View style={styles.featureItem}>
                <Ionicons
                  name="triangle-outline"
                  size={RF(28)}
                  color={Colors.primary}
                />

                <Text style={styles.featureTitle}>Balance</Text>
              </View>
            </View>

            <TouchableOpacity
              disabled={isLoading}
              onPress={handleReveal}
              style={styles.buttonWrapper}
            >
              <LinearGradient
                colors={["#FFC94A", "#F39C12"]}
                style={styles.revealButton}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <Ionicons
                      name="sparkles-outline"
                      size={RF(22)}
                      color="#FFF"
                    />

                    <Text style={styles.buttonText}>Reveal My Numbers</Text>

                    <Ionicons name="arrow-forward" size={RF(22)} color="#FFF" />
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <View style={styles.privacyContainer}>
            <Ionicons
              name="shield-checkmark-outline"
              size={RF(18)}
              color="#F4A300"
            />

            <Text style={styles.privacyText}>
              Your information remains private and sacred
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SacredDetail;
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

  card: {
    backgroundColor: "#FFF",
    borderRadius: wp(5),
    paddingHorizontal: wp(5),
    paddingVertical: hp(3),

    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 4,
    },

    elevation: 5,
  },

  topSection: {
    alignItems: "center",
    marginBottom: hp(3),
    position: "relative",
  },

  sparkleLeft: {
    position: "absolute",
    left: wp(10),
    top: hp(1),
  },

  sparkleRight: {
    position: "absolute",
    right: wp(10),
    top: hp(2),
  },

  iconCircle: {
    width: wp(22),
    height: wp(22),
    borderRadius: wp(11),

    justifyContent: "center",
    alignItems: "center",

    shadowColor: "#F39C12",
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 4,
    },

    elevation: 6,
  },

  title: {
    marginTop: hp(2),

    color: "#222",

    fontSize: RF(21),

    fontWeight: "700",

    textAlign: "center",
  },

  subtitle: {
    marginTop: hp(0.8),

    color: "#777",

    fontSize: RF(13),

    lineHeight: RF(20),

    textAlign: "center",

    fontWeight: "400",
  },

  inputGroup: {
    marginBottom: hp(2),
  },

  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hp(0.8),
  },

  label: {
    marginLeft: wp(2),

    color: "#444",

    fontSize: RF(13),

    fontWeight: "600",
  },

  input: {
    height: hp(6.5),

    borderRadius: wp(3.5),

    borderWidth: 1,

    borderColor: "#E7E7E7",

    backgroundColor: "#FAFAFA",

    paddingHorizontal: wp(4),

    flexDirection: "row",

    alignItems: "center",

    justifyContent: "space-between",
  },

  textInput: {
    height: hp(6.5),
    borderRadius: wp(3.5),
    borderWidth: 1,
    borderColor: "#E7E7E7",
    backgroundColor: "#FAFAFA",
    paddingHorizontal: wp(4),
    color: "#333",
    fontSize: RF(13),
    fontWeight: "400",
  },

  placeholderText: {
    color: "#999",

    fontSize: RF(13),

    fontWeight: "400",
  },

  featureContainer: {
    flexDirection: "row",

    justifyContent: "space-between",

    alignItems: "center",

    marginTop: hp(1),

    marginBottom: hp(2),

    backgroundColor: "#FFF9F2",

    borderRadius: wp(4),

    paddingVertical: hp(2),

    borderWidth: 1,

    borderColor: "#FFE7CC",
  },
  featureItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: wp(2),
  },

  featureDivider: {
    width: 1,
    height: hp(5),
    backgroundColor: "#F3D8B8",
  },

  featureTitle: {
    marginTop: hp(0.8),
    color: "#555",
    fontSize: RF(12),
    fontWeight: "600",
    textAlign: "center",
  },

  buttonWrapper: {
    marginTop: hp(1.5),
  },

  revealButton: {
    height: hp(6.5),

    borderRadius: wp(4),

    flexDirection: "row",

    justifyContent: "center",

    alignItems: "center",

    shadowColor: "#F39C12",

    shadowOpacity: 0.3,

    shadowRadius: 12,

    shadowOffset: {
      width: 0,
      height: 5,
    },

    elevation: 6,
  },

  buttonText: {
    color: "#FFF",

    fontSize: RF(15),

    fontWeight: "700",

    marginHorizontal: wp(3),
  },

  privacyContainer: {
    flexDirection: "row",

    justifyContent: "center",

    alignItems: "center",

    marginTop: hp(3),

    marginBottom: hp(2),

    paddingHorizontal: wp(6),
  },

  privacyIcon: {
    width: wp(8),

    height: wp(8),

    borderRadius: wp(4),

    backgroundColor: "#FFF4E3",

    justifyContent: "center",

    alignItems: "center",

    marginRight: wp(2),
  },

  privacyText: {
    flex: 1,

    color: "#888",

    fontSize: RF(12),

    lineHeight: RF(18),

    fontWeight: "400",
  },
});
