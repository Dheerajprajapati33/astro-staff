import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect } from "react";
import { ImageBackground, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "../../constants/Colors";
import Typography from "../../constants/Typography";

import { hp, RF, wp } from "../../utils/responsive";

export default function Splash() {
  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const user = await AsyncStorage.getItem("userData");

      setTimeout(() => {
        // First time user
        if (!user) {
          router.replace("/(auth)/login");

          return;
        }

        const userData = JSON.parse(user);

        console.log("SPLASH USER:", userData);

        // User exists direct tabs
        router.replace("/(home)");
      }, 3000);
    } catch (error) {
      console.log("SPLASH ERROR:", error);

      router.replace("/(auth)/login");
    }
  };

  return (
    <ImageBackground
      source={require("../../assets/images/splash.png")}
      resizeMode="cover"
      style={{
        flex: 1,
      }}
    >
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: "flex-end",
          alignItems: "center",
          paddingBottom: hp(5),
        }}
      >
        <Text
          style={{
            color: "#fff",

            fontSize: 27.5,

            fontWeight: "800",

            fontFamily: Typography?.bold,
          }}
        >
        </Text>
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
    justifyContent: "flex-end",
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  logoText: {
    fontSize: RF(30),
    color: Colors.primary,
    fontWeight: "800",
    fontFamily: Typography.bold,
  },

  tagline: {
    fontSize: RF(14),
    color: Colors.brandGreen,
    marginTop: hp(1),
    fontWeight: "700",
    fontFamily: Typography.bold,
  },

  bottomText: {
    textAlign: "center",
    marginBottom: hp(4),
    color: Colors.textGray,
    fontSize: RF(12.5),
    fontWeight: "700",
    fontFamily: Typography.bold,
  },
});
