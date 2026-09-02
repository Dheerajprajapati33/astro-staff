import { useState } from "react";

import {
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

import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

import Colors from "../../constants/Colors";import { hp, RF, wp } from "../../utils/responsive";

const TarotReading = () => {
  const router = useRouter();

  const [name, setName] = useState("");

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

            <Text style={styles.headerTitle}>Tarot Reading</Text>

            <Ionicons name="sparkles" size={RF(20)} color={Colors.primary} />
          </View>

          {/* Main Card */}

          <View style={styles.card}>
            {/* Decorative Moon */}

            <Ionicons
              name="moon-outline"
              size={RF(34)}
              color="#F5C16C"
              style={styles.moonIcon}
            />

            {/* Decorative Stars */}

            <Ionicons
              name="sparkles"
              size={RF(12)}
              color="#F5C16C"
              style={styles.star1}
            />

            <Ionicons
              name="sparkles"
              size={RF(10)}
              color="#F5C16C"
              style={styles.star2}
            />

            <Ionicons
              name="star"
              size={RF(10)}
              color="#F5C16C"
              style={styles.star3}
            />

            <Ionicons
              name="sparkles"
              size={RF(11)}
              color="#F5C16C"
              style={styles.star4}
            />

            {/* Left Leaf */}

            <Ionicons
              name="leaf-outline"
              size={RF(34)}
              color="#E8C98F"
              style={styles.leftLeaf}
            />

            {/* Right Leaf */}

            <Ionicons
              name="leaf-outline"
              size={RF(34)}
              color="#E8C98F"
              style={styles.rightLeaf}
            />

            {/* Center Tarot Icon */}

            <View style={styles.iconOuterCircle}>
              <View style={styles.iconInnerCircle}>
                <LinearGradient
                  colors={["#FFA726", "#F57C00"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.iconGradient}
                >
                  <MaterialCommunityIcons
                    name="cards-playing-outline"
                    size={RF(30)}
                    color="#FFF"
                  />
                </LinearGradient>
              </View>
            </View>

            {/* Content starts in Part 3 */}
            {/* Heading */}

            <Text style={styles.title}>Enter your name</Text>

            <Text style={styles.orangeTitle}>to get cards</Text>

            {/* Decorative Divider */}

            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />

              <Ionicons name="star" size={RF(13)} color={Colors.primary} />

              <View style={styles.dividerLine} />
            </View>

            {/* Subtitle */}

            <Text style={styles.subtitle}>
              Your energy shapes your reading —{"\n"}
              take a moment to focus and think
              {"\n"}
              of a question.
            </Text>

            {/* Name Input */}

            <View style={styles.inputContainer}>
              <Ionicons
                name="person-outline"
                size={RF(20)}
                color={Colors.primary}
              />

              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Enter your name"
                placeholderTextColor="#A8A8A8"
                style={styles.input}
              />
            </View>

            {/* Continue Button starts in Part 4 */}
            {/* Continue Button */}

            <TouchableOpacity
              activeOpacity={0.9}
              style={styles.buttonWrapper}
            onPress={() => {

  if(!name.trim()){

    Alert.alert(
      "Required",
      "Please enter your name"
    );

    return;

  }


  router.push({
    pathname:"/pickcard",
    params:{
      name:name
    }
  });


}}
            >
              <LinearGradient
                colors={["#FF9A1F", "#FF6B00"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.continueButton}
              >
                {/* Left Icon */}

                <MaterialCommunityIcons
                  name="cards-playing-outline"
                  size={RF(24)}
                  color="#FFF"
                />

                {/* Button Text */}

                <Text style={styles.buttonText}>Continue to Draw Cards</Text>

                {/* Right Arrow */}

                <Ionicons name="arrow-forward" size={RF(20)} color="#FFF" />
              </LinearGradient>
            </TouchableOpacity>

            {/* Bottom Decorative Waves */}

            <View style={styles.waveContainer}>
              <View style={styles.waveOne} />

              <View style={styles.waveTwo} />

              <View style={styles.waveThree} />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default TarotReading;

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
    backgroundColor: "#FFFFFF",
    borderRadius: wp(6),

    paddingHorizontal: wp(6),
    paddingTop: hp(4),
    paddingBottom: hp(3),

    alignItems: "center",

    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 4,
    },

    elevation: 5,

    overflow: "hidden",

    position: "relative",
  },

  moonIcon: {
    position: "absolute",
    top: hp(2.2),
    left: wp(8),
  },

  star1: {
    position: "absolute",
    top: hp(3),
    left: wp(22),
  },

  star2: {
    position: "absolute",
    top: hp(7),
    left: wp(10),
  },

  star3: {
    position: "absolute",
    top: hp(4),
    right: wp(16),
  },

  star4: {
    position: "absolute",
    top: hp(8),
    right: wp(8),
  },

  leftLeaf: {
    position: "absolute",
    top: hp(9),
    left: wp(7),

    transform: [
      {
        rotate: "-18deg",
      },
    ],
  },

  rightLeaf: {
    position: "absolute",
    top: hp(9),
    right: wp(7),

    transform: [
      {
        rotate: "18deg",
      },
    ],
  },

  iconOuterCircle: {
    width: wp(30),
    height: wp(30),

    borderRadius: wp(15),

    backgroundColor: "#FFF6EB",

    justifyContent: "center",
    alignItems: "center",

    marginTop: hp(2),
  },

  iconInnerCircle: {
    width: wp(24),
    height: wp(24),

    borderRadius: wp(12),

    backgroundColor: "#FFF",

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

  iconGradient: {
    width: wp(18),
    height: wp(18),

    borderRadius: wp(9),

    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    marginTop: hp(3),

    color: "#222",

    fontSize: RF(24),

    fontWeight: "700",

    textAlign: "center",
  },

  orangeTitle: {
    color: Colors.primary,

    fontSize: RF(24),

    fontWeight: "700",

    textAlign: "center",

    marginTop: hp(0.2),
  },

  dividerContainer: {
    flexDirection: "row",

    alignItems: "center",

    width: "100%",

    marginTop: hp(2),

    marginBottom: hp(2),
  },

  dividerLine: {
    flex: 1,

    height: 1,

    backgroundColor: "#F3D7B6",

    marginHorizontal: wp(3),
  },

  subtitle: {
    color: "#777",

    fontSize: RF(13),

    lineHeight: RF(21),

    textAlign: "center",

    fontWeight: "400",

    marginBottom: hp(3),
  },

  inputContainer: {
    width: "100%",

    height: hp(6.5),

    borderWidth: 1,

    borderColor: "#FFD8B0",

    borderRadius: wp(4),

    backgroundColor: "#FFFDFB",

    flexDirection: "row",

    alignItems: "center",

    paddingHorizontal: wp(4),

    marginBottom: hp(3),
  },

  input: {
    flex: 1,

    marginLeft: wp(3),

    color: "#222",

    fontSize: RF(14),

    fontWeight: "400",
  },

  buttonWrapper: {
    width: "100%",
  },

  continueButton: {
    height: hp(6.8),

    borderRadius: wp(4),

    flexDirection: "row",

    alignItems: "center",

    justifyContent: "space-between",

    paddingHorizontal: wp(4),

    shadowColor: "#FF7A00",

    shadowOpacity: 0.3,

    shadowRadius: 12,

    shadowOffset: {
      width: 0,
      height: 5,
    },

    elevation: 6,
  },

  buttonText: {
    flex: 1,

    textAlign: "center",

    color: "#FFF",

    fontSize: RF(15),

    fontWeight: "700",

    marginHorizontal: wp(3),
  },

  waveContainer: {
    width: "100%",

    alignItems: "center",

    marginTop: hp(3),

    marginBottom: hp(1),
  },

  waveOne: {
    width: "92%",

    height: hp(1.2),

    borderRadius: hp(2),

    backgroundColor: "#FFF2E2",

    marginBottom: hp(0.5),
  },

  waveTwo: {
    width: "76%",

    height: hp(0.9),

    borderRadius: hp(2),

    backgroundColor: "#FFE8CC",

    marginBottom: hp(0.5),
  },

  waveThree: {
    width: "58%",

    height: hp(0.7),

    borderRadius: hp(2),

    backgroundColor: "#FFDDB5",
  },
});
