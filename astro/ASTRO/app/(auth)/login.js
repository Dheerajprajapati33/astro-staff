import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";

import Typography from "../../constants/Typography";
import { hp, RF, wp } from "../../utils/responsive";

import { useSendLoginOtpMutation } from "../../redux/LoginApi";

const ORANGE = "#ff6a00";
const GREEN = "#198c35";

export default function Login() {
  const [phone, setPhone] = useState("");

  const [sendLoginOtp, { isLoading }] = useSendLoginOtpMutation();

  const handleLogin = async () => {
    if (phone.length !== 10) {
      Alert.alert(
        "Invalid Number",
        "Please enter valid 10 digit mobile number",
      );

      return;
    }

    try {
      const response = await sendLoginOtp(phone).unwrap();

      console.log("LOGIN OTP RESPONSE:", response);

      if (response?.success) {
        router.push({
          pathname: "/otp",
          params: {
            phone: phone,
          },
        });
      }
    } catch (error) {
      console.log("LOGIN ERROR:", error);

      Alert.alert(
        "Login Failed",
        error?.data?.message || "Something went wrong",
      );
    }
  };

  return (
    <ImageBackground
      source={require("../../assets/images/login.png")}
      resizeMode="cover"
      style={styles.background}
    >
      <SafeAreaView style={styles.container}>
        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.logoSpace} />

          <View style={styles.taglineBox}>
            <Text style={styles.taglineText}>
              Guiding Futures, Inspiring Lives
            </Text>

            <Text style={styles.taglineText}>— Through Astrology —</Text>
          </View>

          <View style={styles.formBox}>
            <Text style={styles.label}>Login with your phone number</Text>

            <View style={styles.inputBox}>
              <Text style={styles.flag}>🇮🇳</Text>

              <Text style={styles.code}>+91</Text>

              <Ionicons name="chevron-down" size={RF(15)} color="#111" />

              <View style={styles.line} />

              <TextInput
                placeholder="Enter phone number"
                placeholderTextColor="#aaa"
                keyboardType="phone-pad"
                maxLength={10}
                value={phone}
                onChangeText={setPhone}
                style={styles.input}
              />
            </View>

            <TouchableOpacity
              activeOpacity={0.85}
              style={[
                styles.continueBtn,
                isLoading && {
                  opacity: 0.6,
                },
              ]}
              disabled={isLoading}
              onPress={handleLogin}
            >
              <Text style={styles.continueText}>
                {isLoading ? "Sending OTP..." : "Continue"}
              </Text>

              {!isLoading && (
                <Ionicons name="arrow-forward" size={RF(20)} color="#fff" />
              )}
            </TouchableOpacity>

            <View style={styles.secureRow}>
              <Ionicons
                name="shield-checkmark-outline"
                size={RF(15)}
                color={ORANGE}
              />

              <Text style={styles.secureText}>Secure & Trusted</Text>
            </View>

            <TouchableOpacity
              style={styles.signupRow}
              onPress={() => router.push("/register")}
            >
              <Text style={styles.noAccountText}>I have no account?</Text>

              <Text style={styles.signupText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: wp(100),
    height: hp(100),
  },
  container: {
    flex: 1,
  },
  taglineBox: {
    alignItems: "center",
    marginBottom: hp(5),
    marginTop: -hp(12),
  },

  taglineText: {
    fontSize: RF(13),
    color: "#ff6a00",
    fontWeight: "700",
    textAlign: "center",
    fontFamily: Typography?.bold,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: wp(11),
  },

  logoSpace: {
    height: hp(43),
  },

  formBox: {
    width: "100%",
  },
  label: {
    fontSize: RF(13),
    color: "#111",
    marginBottom: hp(1),
    fontWeight: "700",
    fontFamily: Typography?.bold,
  },
  inputBox: {
    height: hp(6.3),
    borderWidth: 1,
    borderColor: "#ffb066",
    borderRadius: wp(3),
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: wp(2.5),
  },
  flag: {
    fontSize: RF(14),
    marginRight: wp(1.5),
  },
  code: {
    fontSize: RF(12),
    color: "#111",
    fontWeight: "700",
    fontFamily: Typography?.bold,
    marginRight: wp(1),
  },
  line: {
    width: 1,
    height: hp(3),
    backgroundColor: "#ddd",
    marginHorizontal: wp(3),
  },
  input: {
    flex: 1,
    fontSize: RF(12),
    color: "#111",
    fontWeight: "700",
    fontFamily: Typography?.bold,
  },
  continueBtn: {
    height: hp(6.3),
    borderRadius: wp(3),
    backgroundColor: ORANGE,
    marginTop: hp(2.1),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: wp(3),
  },
  continueText: {
    color: "#fff",
    fontSize: RF(14),
    fontWeight: "800",
    fontFamily: Typography?.bold,
  },
  secureRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: hp(2.6),
  },
  secureText: {
    color: ORANGE,
    fontSize: RF(10),
    fontWeight: "700",
    marginLeft: wp(1),
    fontFamily: Typography?.bold,
  },

  signupRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: hp(2),
  },

  noAccountText: {
    fontSize: RF(11),
    color: "#555",
    fontWeight: "700",
    fontFamily: Typography?.bold,
  },

  signupText: {
    fontSize: RF(11),
    color: ORANGE,
    fontWeight: "800",
    fontFamily: Typography?.bold,
  },
});

// const response = await loginUser(payload).unwrap();

// if (response?.data?.id) {
//   await AsyncStorage.setItem("userData", JSON.stringify(response.data));
// }

// router.replace("/(tabs)");
