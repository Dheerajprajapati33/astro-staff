import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";

import Colors from "../../constants/Colors";
import { hp, RF, wp } from "../../utils/responsive";

export default function Header() {
  return (
    <View style={styles.container}>
      {/* Menu */}
      {/* <TouchableOpacity>
        <Ionicons name="menu-outline" size={RF(26)} color={Colors.darkBrown} />
      </TouchableOpacity> */}
      <TouchableOpacity onPress={() => router.push("/Wallet")}>
        <Ionicons
          name="wallet-outline"
          size={RF(23)}
          color={Colors.darkBrown}
        />
      </TouchableOpacity>

      {/* Logo */}
      <View style={styles.logoContainer} pointerEvents="none">
        <Image
          source={require("../../assets/images/icon.png")}
          style={styles.logoMark}
          resizeMode="contain"
        />
      </View>

      {/* Right Icons */}
      <View style={styles.rightIcons}>
        {/* Wallet */}
        {/* <TouchableOpacity
          style={styles.iconButton}
          onPress={() => router.push("/Wallet")}
        >
          <Ionicons
            name="wallet-outline"
            size={RF(23)}
            color={Colors.darkBrown}
          />
        </TouchableOpacity> */}

        {/* Notification */}
        <TouchableOpacity
          onPress={() => router.push("/Notification")} //
        >
          <Ionicons
            name="notifications-outline"
            size={RF(24)}
            color={Colors.darkBrown}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: hp(2),
    paddingHorizontal: wp(5),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  logoContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
  },

  logoMark: {
    width: RF(48),
    height: RF(48),
    borderRadius: 10,
  },

  rightIcons: {
    flexDirection: "row",
    alignItems: "center",
  },

  iconButton: {
    marginRight: wp(4),
  },
});
