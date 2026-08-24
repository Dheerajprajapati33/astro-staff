import {
  ImageBackground,
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

const register = () => {
  return (
    <ImageBackground
      source={require("../../assets/images/reg.png")}
      resizeMode="cover"
      style={styles.background}
    >
      <SafeAreaView style={styles.container}>
        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <View style={styles.content}>
            <Text style={styles.title}>Hi Welcome!</Text>

            <Text style={styles.subTitle}>Submit your Mobile number</Text>

            {/* Divider */}
            <View style={styles.dividerContainer}>
              <View style={styles.line} />
              <Text style={styles.star}>✦</Text>
              <View style={styles.line} />
            </View>

            <Text style={styles.loginText}>Log in or Sign up</Text>

            {/* Mobile Input */}
            <View style={styles.inputContainer}>
              <View style={styles.countryCode}>
                <Text style={styles.flag}>🇮🇳</Text>
                <Text style={styles.code}>+91</Text>
              </View>

              <TextInput
                placeholder="Mobile number"
                placeholderTextColor={Colors.textGray}
                keyboardType="phone-pad"
                maxLength={10}
                style={styles.input}
              />
            </View>

            <Text style={styles.counter}>0/10</Text>

            {/* OTP Button */}
            <TouchableOpacity
              style={styles.otpButton}
              onPress={() => router.push("/(auth)/otp")}
            >
              <Text style={styles.otpText}>Send OTP</Text>
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.dividerContainer}>
              <View style={styles.line} />
              <Text style={styles.orText}>OR LOGIN WITH</Text>
              <View style={styles.line} />
            </View>

            {/* Continue Button */}
            <TouchableOpacity style={styles.outlineButton}>
              <Ionicons
                name="phone-portrait-outline"
                size={RF(20)}
                color={Colors.primary}
              />

              <Text style={styles.outlineText}>Continue with Phone Number</Text>
            </TouchableOpacity>

            <Text style={styles.terms}>
              By signing up, you agree to our{" "}
              <Text style={styles.link}>Terms of Use</Text> and{" "}
              <Text style={styles.link}>Privacy Policy</Text>
            </Text>
          </View>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default register;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: wp(100),
    height: hp(100),
  },

  container: {
    flex: 1,
  },

  content: {
    flex: 1,
    paddingHorizontal: wp(8),
    paddingTop: hp(32), // logo ke neeche start hoga
  },

  title: {
    textAlign: "center",
    fontSize: RF(24),
    color: Colors.darkBrown,
    fontWeight: "600",
  },

  subTitle: {
    textAlign: "center",
    marginTop: hp(0.5),
    fontSize: RF(14),
    color: Colors.textGray,
    fontWeight: "400",
  },

  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: hp(2),
  },

  line: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.lightPeach,
  },

  star: {
    marginHorizontal: wp(3),
    color: Colors.primary,
    fontSize: RF(12),
  },

  loginText: {
    textAlign: "center",
    marginTop: hp(0.8),
    color: Colors.darkBrown,
    fontSize: RF(12),
    fontWeight: "600",
  },

  inputContainer: {
    marginTop: hp(2),
    height: hp(6.5),
    borderWidth: 1,
    borderColor: Colors.lightPeach,
    borderRadius: wp(3),
    backgroundColor: Colors.white,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: wp(3),
  },

  countryCode: {
    flexDirection: "row",
    alignItems: "center",
    paddingRight: wp(3),
    borderRightWidth: 1,
    borderRightColor: Colors.lightPeach,
  },

  flag: {
    fontSize: RF(14),
  },

  code: {
    marginLeft: wp(1),
    fontSize: RF(13),
    color: Colors.darkBrown,
    fontWeight: "400",
  },

  input: {
    flex: 1,
    marginLeft: wp(3),
    fontSize: RF(14),
    color: Colors.darkBrown,
    fontWeight: "400",
  },

  counter: {
    textAlign: "right",
    marginTop: hp(0.5),
    color: Colors.textGray,
    fontSize: RF(11),
    fontWeight: "400",
  },

  otpButton: {
    marginTop: hp(2.5),
    height: hp(6.5),
    borderRadius: wp(3),
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },

  otpText: {
    color: Colors.white,
    fontSize: RF(15),
    fontWeight: "600",
  },

  orText: {
    marginHorizontal: wp(3),
    color: Colors.darkBrown,
    fontSize: RF(11),
    fontWeight: "600",
  },

  outlineButton: {
    marginTop: hp(2),
    height: hp(6.5),
    borderRadius: wp(3),
    borderWidth: 1,
    borderColor: Colors.lightPeach,
    backgroundColor: Colors.white,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  outlineText: {
    marginLeft: wp(2),
    color: Colors.primary,
    fontSize: RF(14),
    fontWeight: "600",
  },

  terms: {
    marginTop: hp(2),
    textAlign: "center",
    color: Colors.textGray,
    fontSize: RF(11),
    fontWeight: "400",
    lineHeight: RF(16),
    paddingHorizontal: wp(3),
  },

  link: {
    color: Colors.primary,
    fontWeight: "600",
  },
});
