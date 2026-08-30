import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";
import { useRef, useState } from "react";
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

import { useVerifyOtpMutation } from "../../redux/LoginApi";

const ORANGE = "#ff6a00";

const Otp = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  const inputRefs = useRef([]);

  // Login screen se phone receive hoga
  const { phone } = useLocalSearchParams();

  const [verifyOtp, { isLoading }] = useVerifyOtpMutation();

  const handleOtpChange = (value, index) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];

    newOtp[index] = value.slice(-1);

    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const otpValue = otp.join("");

    if (otpValue.length !== 6) {
      Alert.alert("Invalid OTP", "Please enter 6 digit OTP");

      return;
    }

    try {
      const response = await verifyOtp({
        phone: phone,

        otp: otpValue,
      }).unwrap();

      console.log("VERIFY OTP RESPONSE:", response);

      if (response?.success) {
        const data = response?.data;

        // clean user object
        const userData = {
          token: data?.token,

          ...data?.user,
        };

        console.log("SAVED USER:", userData);

        try {
          const saveData = JSON.stringify(userData);

          await AsyncStorage.setItem("userData", JSON.stringify(userData));

          console.log("STORAGE SAVED");

          setTimeout(() => {
            router.replace("/(home)");
          }, 300);
        } catch (error) {
          console.log("STORAGE ERROR", error);

          Alert.alert("Storage Error", error.message);
        }
      }
    } catch (error) {
      console.log("VERIFY ERROR:", error);

      Alert.alert(
        "Verification Failed",

        error?.data?.message || "Invalid OTP",
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
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={RF(22)} color={ORANGE} />
        </TouchableOpacity>

        <KeyboardAwareScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          extraScrollHeight={20}
        >
          <View style={styles.topSpace} />

          <Text style={styles.title}>Verify your phone number</Text>

          <Text style={styles.subtitle}>We have sent a 6-digit OTP to</Text>

          <View style={styles.phoneRow}>
            <Text style={styles.phone}>+91 {phone}</Text>

            <TouchableOpacity
              style={styles.editBtn}
              onPress={() => router.back()}
            >
              <Text style={styles.editText}>Edit</Text>

              <Ionicons name="pencil-outline" size={RF(12)} color={ORANGE} />
            </TouchableOpacity>
          </View>

          <View style={styles.otpRow}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => (inputRefs.current[index] = ref)}
                value={digit}
                onChangeText={(value) => handleOtpChange(value, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                keyboardType="number-pad"
                maxLength={1}
                style={styles.otpInput}
                textAlign="center"
                placeholder="-"
                placeholderTextColor="#f5a45c"
              />
            ))}
          </View>

          <View style={styles.resendRow}>
            <Text style={styles.didntText}>Didn't receive OTP?</Text>

            <TouchableOpacity>
              <Text style={styles.resendText}>Resend OTP</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            activeOpacity={0.85}
            style={[
              styles.verifyBtn,
              isLoading && {
                opacity: 0.6,
              },
            ]}
            disabled={isLoading}
            onPress={handleVerify}
          >
            <Text style={styles.verifyText}>
              {isLoading ? "Verifying..." : "Verify & Continue"}
            </Text>

            {!isLoading && (
              <Ionicons name="arrow-forward" size={RF(20)} color="#fff" />
            )}
          </TouchableOpacity>

          <View style={styles.secureRow}>
            <Ionicons name="lock-closed-outline" size={RF(16)} color={ORANGE} />

            <Text style={styles.secureText}>
              Your information is secure and{"\n"}
              encrypted
            </Text>
          </View>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default Otp;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: wp(100),
    height: hp(100),
  },
  container: {
    flex: 1,
  },
  backBtn: {
    position: "absolute",
    top: hp(4.8),
    left: wp(5),
    zIndex: 10,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: wp(11),
  },
  topSpace: {
    height: hp(31),
  },
  title: {
    textAlign: "center",
    fontSize: RF(17),
    color: "#222",
    fontWeight: "800",
    marginBottom: hp(0.8),
    fontFamily: Typography?.bold,
  },
  subtitle: {
    textAlign: "center",
    fontSize: RF(12),
    color: "#777",
    fontWeight: "700",
    fontFamily: Typography?.bold,
  },
  phoneRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: hp(0.8),
  },
  phone: {
    color: ORANGE,
    fontSize: RF(14),
    fontWeight: "800",
    fontFamily: Typography?.bold,
  },
  editBtn: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: wp(4),
  },
  editText: {
    color: ORANGE,
    fontSize: RF(10),
    fontWeight: "800",
    marginRight: wp(0.8),
    fontFamily: Typography?.bold,
  },
  otpRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: hp(2.4),
  },
  otpInput: {
    width: wp(10),
    height: hp(6.6),
    borderWidth: 1,
    borderColor: "#ffb066",
    borderRadius: wp(2),
    backgroundColor: "#fff",
    fontSize: RF(22),
    color: ORANGE,
    fontWeight: "800",
    fontFamily: Typography?.bold,
  },
  resendRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: hp(2.3),
  },
  didntText: {
    color: "#777",
    fontSize: RF(10),
    fontWeight: "700",
    fontFamily: Typography?.bold,
  },
  resendText: {
    color: ORANGE,
    fontSize: RF(10),
    fontWeight: "800",
    marginLeft: wp(4),
    fontFamily: Typography?.bold,
  },
  timerText: {
    color: "#777",
    fontSize: RF(10),
    marginLeft: wp(1),
    fontWeight: "700",
    fontFamily: Typography?.bold,
  },
  verifyBtn: {
    height: hp(6.3),
    borderRadius: wp(3),
    backgroundColor: ORANGE,
    marginTop: hp(2.5),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: wp(3),
  },
  verifyText: {
    color: "#fff",
    fontSize: RF(14),
    fontWeight: "800",
    fontFamily: Typography?.bold,
  },
  secureRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: hp(2.4),
  },
  secureText: {
    color: "#777",
    fontSize: RF(10),
    marginLeft: wp(2),
    lineHeight: hp(1.9),
    fontWeight: "700",
    fontFamily: Typography?.bold,
  },
});
