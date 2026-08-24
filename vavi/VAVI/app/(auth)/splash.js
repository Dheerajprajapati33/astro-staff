import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect } from "react";
import { ImageBackground, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Colors from "../../constants/Colors";
import { hp, RF, wp } from "../../utils/responsive";

export default function Splash() {
  useEffect(() => {
    let timer;

    const checkLoginStatus = async () => {
      try {
        const savedUserData = await AsyncStorage.getItem("userData");

        let isLoggedIn = false;

        if (savedUserData) {
          const parsedUserData = JSON.parse(savedUserData);

          console.log("Saved User Data:", parsedUserData);

          if (parsedUserData?.token && parsedUserData?.user) {
            isLoggedIn = true;
          }
        }

        timer = setTimeout(() => {
          if (isLoggedIn) {
            router.replace("/(tabs)/consult");
          } else {
            router.replace("/(auth)/login");
          }
        }, 3000);
      } catch (error) {
        console.log("Login Status Check Error:", error);

        timer = setTimeout(() => {
          router.replace("/(auth)/login");
        }, 3000);
      }
    };

    checkLoginStatus();

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, []);

  return (
    <ImageBackground
      source={require("../../assets/images/splash.png")}
      resizeMode="cover"
      style={styles.background}
    >
      <SafeAreaView style={styles.container}>
        <Text style={styles.bottomText}>Preparing your future...</Text>
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
    fontSize: RF(48),
    color: Colors.primary,
    fontWeight: "600",
  },

  tagline: {
    fontSize: RF(16),
    color: Colors.brandGreen,
    marginTop: hp(1),
    fontWeight: "400",
  },

  bottomText: {
    textAlign: "center",
    marginBottom: hp(4),
    color: Colors.textGray,
    fontSize: RF(14),
    fontWeight: "400",
  },
});


