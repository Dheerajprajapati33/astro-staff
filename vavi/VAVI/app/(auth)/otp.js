import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";
import { useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ImageBackground,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";

import Colors from "../../constants/Colors";import { useVerifyOtpMutation } from "../../redux/authApi";
import { hp, RF, wp } from "../../utils/responsive";

export default function Otp() {
  const params = useLocalSearchParams();

  const phone = Array.isArray(params?.phone)
    ? params.phone[0]
    : params?.phone || "";

  const role = Array.isArray(params?.role)
    ? params.role[0]
    : params?.role || "user";

  const [otpValues, setOtpValues] = useState(["", "", "", "", "", ""]);

  const inputRefs = useRef([]);

  const [verifyOtp, { isLoading }] = useVerifyOtpMutation();

  const handleOtpChange = (value, index) => {
    const numericValue = value.replace(/[^0-9]/g, "");

    // Paste ya autofill me poora 6-digit OTP aa jaye
    if (numericValue.length > 1) {
      const pastedOtp = numericValue.slice(0, 6).split("");

      const updatedOtp = ["", "", "", "", "", ""];

      pastedOtp.forEach((digit, otpIndex) => {
        updatedOtp[otpIndex] = digit;
      });

      setOtpValues(updatedOtp);

      const nextIndex = Math.min(pastedOtp.length, 5);

      inputRefs.current[nextIndex]?.focus();

      if (pastedOtp.length === 6) {
        Keyboard.dismiss();
      }

      return;
    }

    const updatedOtp = [...otpValues];

    updatedOtp[index] = numericValue;

    setOtpValues(updatedOtp);

    if (numericValue && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (numericValue && index === 5) {
      Keyboard.dismiss();
    }
  };

  const handleKeyPress = (event, index) => {
    if (
      event.nativeEvent.key === "Backspace" &&
      !otpValues[index] &&
      index > 0
    ) {
      const updatedOtp = [...otpValues];

      updatedOtp[index - 1] = "";

      setOtpValues(updatedOtp);

      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = async () => {
    Keyboard.dismiss();

    const enteredOtp = otpValues.join("");

    if (!phone) {
      Alert.alert(
        "Phone Number Missing",
        "Phone number was not received. Please login again.",
      );

      router.replace("/(auth)/login");

      return;
    }

    if (enteredOtp.length !== 6) {
      Alert.alert("Invalid OTP", "Please enter the complete 6 digit OTP.");

      return;
    }

    try {
      const response = await verifyOtp({
        phone,
        otp: enteredOtp,
        role: role || "user",
      }).unwrap();

      console.log("Verify OTP Response:", response);

      if (!response?.success) {
        Alert.alert(
          "Verification Failed",
          response?.message || "Unable to verify OTP.",
        );

        return;
      }

      const token = response?.data?.token;
      const user = response?.data?.user;

      if (!token || !user) {
        Alert.alert(
          "Login Failed",
          "Token or user information was not received.",
        );

        return;
      }

      const userData = {
        token,
        user,
        role: user?.role || role || "user",
      };

      await AsyncStorage.setItem("userData", JSON.stringify(userData));

      await AsyncStorage.setItem("token", token);

      await AsyncStorage.setItem("user", JSON.stringify(user));

      console.log("User data saved successfully");

      router.replace("/(tabs)");
    } catch (error) {
      console.log("Verify OTP API Error:", error);

      const errorMessage =
        error?.data?.message ||
        error?.data?.error ||
        error?.error ||
        "OTP verification failed. Please try again.";

      Alert.alert("Verification Failed", errorMessage);
    }
  };

  const handleChangeNumber = () => {
    router.replace("/(auth)/login");
  };

  const maskedPhone = phone
    ? `${phone.slice(0, 2)}XXXXXX${phone.slice(-2)}`
    : "";

  return (
    <ImageBackground
      source={require("../../assets/images/reg.png")}
      resizeMode="cover"
      style={styles.background}
    >
      <SafeAreaView style={styles.container}>
        <KeyboardAwareScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          extraScrollHeight={20}
        >
          <View style={styles.content}>
            <Text style={styles.title}>OTP Verification</Text>

            <Text style={styles.subTitle}>A 6 digit code has been sent to</Text>

            <Text style={styles.mobile}>
              your number{" "}
              <Text style={styles.mobileNumber}>
                +91 {maskedPhone || phone}
              </Text>
            </Text>

            <View style={styles.otpContainer}>
              {otpValues.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(ref) => {
                    inputRefs.current[index] = ref;
                  }}
                  value={digit}
                  style={[styles.otpBox, digit ? styles.filledOtpBox : null]}
                  keyboardType="number-pad"
                  maxLength={index === 0 ? 6 : 1}
                  textAlign="center"
                  selectTextOnFocus
                  editable={!isLoading}
                  onChangeText={(value) => handleOtpChange(value, index)}
                  onKeyPress={(event) => handleKeyPress(event, index)}
                />
              ))}
            </View>

            <TouchableOpacity
              style={[styles.verifyButton, isLoading && styles.disabledButton]}
              onPress={handleVerifyOtp}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              {isLoading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="small" color={Colors.white} />

                  <Text style={styles.loadingText}>Verifying...</Text>
                </View>
              ) : (
                <Text style={styles.verifyText}>Verify OTP</Text>
              )}
            </TouchableOpacity>

            <Text style={styles.timerText}>
              If you didn't receive a code!{" "}
              <Text style={styles.timer}>00:28</Text>
            </Text>

            <TouchableOpacity
              style={styles.changeButton}
              onPress={handleChangeNumber}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              <Ionicons
                name="phone-portrait-outline"
                size={RF(18)}
                color={Colors.primary}
              />

              <Text style={styles.changeText}>
                Wrong Number? Click here to change
              </Text>
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

  scrollContent: {
    flexGrow: 1,
  },

  content: {
    flex: 1,
    paddingHorizontal: wp(8),
    paddingTop: hp(33),
  },

  title: {
    textAlign: "center",
    fontSize: RF(28),
    color: Colors.darkBrown,
    fontWeight: "600",
  },

  subTitle: {
    marginTop: hp(1),
    textAlign: "center",
    color: Colors.textGray,
    fontSize: RF(14),
    fontWeight: "400",
  },

  mobile: {
    textAlign: "center",
    color: Colors.textGray,
    fontSize: RF(14),
    marginTop: hp(0.5),
    fontWeight: "400",
  },

  mobileNumber: {
    color: Colors.primary,
    fontWeight: "600",
  },

  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: hp(3),
  },

  otpBox: {
    width: wp(11),
    height: wp(13),
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: wp(2.5),
    backgroundColor: Colors.white,
    textAlign: "center",
    fontSize: RF(22),
    color: Colors.darkBrown,
    fontWeight: "600",
    paddingVertical: 0,
  },

  filledOtpBox: {
    borderWidth: 2,
  },

  verifyButton: {
    marginTop: hp(5),
    height: hp(7),
    backgroundColor: Colors.primary,
    borderRadius: wp(3),
    justifyContent: "center",
    alignItems: "center",
  },

  disabledButton: {
    opacity: 0.7,
  },

  verifyText: {
    color: Colors.white,
    fontSize: RF(16),
    fontWeight: "600",
  },

  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  loadingText: {
    marginLeft: wp(2),
    color: Colors.white,
    fontSize: RF(16),
    fontWeight: "600",
  },

  timerText: {
    textAlign: "center",
    marginTop: hp(3),
    color: Colors.textGray,
    fontSize: RF(13),
    fontWeight: "400",
  },

  timer: {
    color: Colors.primary,
    fontWeight: "600",
  },

  changeButton: {
    marginTop: hp(4),
    height: hp(6.5),
    borderWidth: 1,
    borderColor: Colors.lightPeach,
    borderRadius: wp(3),
    backgroundColor: Colors.white,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  changeText: {
    marginLeft: wp(2),
    color: Colors.primary,
    fontSize: RF(13),
    fontWeight: "600",
  },
});
