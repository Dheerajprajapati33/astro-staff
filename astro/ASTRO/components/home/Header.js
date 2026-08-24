import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

import Typography from "../../constants/Typography";
import { hp, RF, wp } from "../../utils/responsive";

const Header = () => {
   console.log("HEADER RENDER");
  return (
    <View style={styles.header}>
      <View>
        <View style={styles.nameRow}>
          <Text style={styles.name}>Astro.Vavi</Text>
          <Ionicons name="checkmark-circle" size={RF(14)} color="#22c55e" />
        </View>
        <Text style={styles.role}>Astrologer</Text>
      </View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  header: {
    marginTop: hp(1),
    marginBottom: hp(2),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(1),
  },
  name: {
    fontSize: RF(22),
    color: "#222",
    fontWeight: "900",
    fontFamily: Typography?.bold,
  },
  role: {
    fontSize: RF(11),
    color: "#777",
    marginTop: hp(0.2),
    fontFamily: Typography?.regular,
  },
});
