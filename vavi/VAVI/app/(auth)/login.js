import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ImageBackground,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Colors from "../../constants/Colors";
import { useLoginMutation } from "../../redux/authApi";
import { hp, RF, wp } from "../../utils/responsive";

export default function Login() {
  const [phone, setPhone] = useState("");

  const [login, { isLoading }] = useLoginMutation();

  const handlePhoneChange = (value) => {
    // Sirf numbers allow honge
    const numericValue = value.replace(/[^0-9]/g, "");

    setPhone(numericValue);
  };

  const handleLogin = async () => {
    Keyboard.dismiss();

    const cleanPhone = phone.trim();

    if (!cleanPhone) {
      Alert.alert("Phone Number Required", "Please enter your phone number.");
      return;
    }

    if (cleanPhone.length !== 10) {
      Alert.alert(
        "Invalid Phone Number",
        "Please enter a valid 10 digit phone number.",
      );
      return;
    }

    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      Alert.alert(
        "Invalid Phone Number",
        "Please enter a valid Indian mobile number.",
      );
      return;
    }

    try {
      const response = await login({
        phone: cleanPhone,

        // Default role user
        role: "user",
      }).unwrap();

      console.log("Login API Response:", response);

      if (response?.success) {
        router.push({
          pathname: "/(auth)/otp",
          params: {
            phone: cleanPhone,
            role: "user",
          },
        });
      } else {
        Alert.alert(
          "Login Failed",
          response?.message || "Unable to send OTP. Please try again.",
        );
      }
    } catch (error) {
      console.log("Login API Error:", error);

      const errorMessage =
        error?.data?.message ||
        error?.data?.error ||
        error?.error ||
        "Something went wrong. Please try again.";

      Alert.alert("Login Failed", errorMessage);
    }
  };

  const handleGoogleLogin = () => {
    Alert.alert("Coming Soon", "Google login will be available soon.");
  };

  const handleFacebookLogin = () => {
    Alert.alert("Coming Soon", "Facebook login will be available soon.");
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ImageBackground
        source={require("../../assets/images/wel.png")}
        resizeMode="cover"
        style={styles.background}
      >
        <SafeAreaView style={styles.container}>
          <View style={styles.content}>
            <Text style={styles.title}>Welcome!</Text>

            <Text style={styles.subTitle}>Login or Sign up to continue</Text>

            {/* Phone Number Input */}
            <View style={styles.inputContainer}>
              <View style={styles.countryCodeContainer}>
                <Text style={styles.countryCode}>+91</Text>
              </View>

              <View style={styles.inputDivider} />

              <TextInput
                value={phone}
                onChangeText={handlePhoneChange}
                placeholder="Enter phone number"
                placeholderTextColor={Colors.textGray}
                keyboardType="number-pad"
                maxLength={10}
                returnKeyType="done"
                onSubmitEditing={handleLogin}
                editable={!isLoading}
                style={styles.phoneInput}
              />

              {phone.length > 0 && !isLoading && (
                <TouchableOpacity
                  onPress={() => setPhone("")}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name="close-circle"
                    size={RF(20)}
                    color={Colors.textGray}
                  />
                </TouchableOpacity>
              )}
            </View>

            {/* Login Button */}
            <TouchableOpacity
              style={[styles.phoneButton, isLoading && styles.disabledButton]}
              onPress={handleLogin}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              <Ionicons
                name="phone-portrait-outline"
                size={RF(24)}
                color={Colors.white}
              />

              <Text style={styles.phoneText}>
                {isLoading ? "Sending OTP..." : "Continue with Phone"}
              </Text>

              {isLoading ? (
                <ActivityIndicator size="small" color={Colors.white} />
              ) : (
                <Ionicons
                  name="chevron-forward"
                  size={RF(22)}
                  color={Colors.white}
                />
              )}
            </TouchableOpacity>

          </View>
        </SafeAreaView>
      </ImageBackground>
    </TouchableWithoutFeedback>
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

  content: {
    marginTop: hp(35),
    paddingHorizontal: wp(8),
  },

  title: {
    textAlign: "center",
    fontSize: RF(30),
    color: Colors.darkBrown,
    fontWeight: "600",
  },

  subTitle: {
    textAlign: "center",
    fontSize: RF(14),
    color: Colors.textGray,
    marginTop: hp(0.8),
    marginBottom: hp(3),
    fontWeight: "400",
  },

  inputContainer: {
    height: hp(7),
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.lightPeach,
    borderRadius: wp(3),
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: wp(4),
  },

  countryCodeContainer: {
    justifyContent: "center",
    alignItems: "center",
  },

  countryCode: {
    fontSize: RF(16),
    color: Colors.darkBrown,
    fontWeight: "600",
  },

  inputDivider: {
    width: 1,
    height: hp(3),
    backgroundColor: Colors.lightPeach,
    marginHorizontal: wp(3),
  },

  phoneInput: {
    flex: 1,
    fontSize: RF(16),
    color: Colors.darkBrown,
    fontWeight: "400",
    paddingVertical: 0,
  },

  phoneButton: {
    height: hp(7),
    backgroundColor: Colors.primary,
    borderRadius: wp(3),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: wp(5),
    marginTop: hp(2),
  },

  disabledButton: {
    opacity: 0.7,
  },

  phoneText: {
    flex: 1,
    marginLeft: wp(4),
    fontSize: RF(16),
    color: Colors.white,
    fontWeight: "600",
  },

  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: hp(2.5),
  },

  line: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.lightPeach,
  },

  orText: {
    marginHorizontal: wp(3),
    color: Colors.primary,
    fontSize: RF(13),
    fontWeight: "600",
  },

  socialButton: {
    height: hp(7),
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.lightPeach,
    borderRadius: wp(3),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: wp(5),
    marginBottom: hp(2),
  },

  socialText: {
    flex: 1,
    marginLeft: wp(4),
    fontSize: RF(16),
    color: Colors.darkBrown,
    fontWeight: "600",
  },
});
