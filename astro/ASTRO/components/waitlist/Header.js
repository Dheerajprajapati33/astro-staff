import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Typography from "../../constants/Typography";
import { hp, RF, wp } from "../../utils/responsive";

const ORANGE = "#ff6a00";

export default function Header({ onHelpPress }) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.header,
        {
          paddingTop: insets.top,
          height: hp(6.5) + insets.top,
        },
      ]}
    >
      <TouchableOpacity onPress={() => router.back()}>
        <Ionicons name="chevron-back" size={RF(24)} color={ORANGE} />
      </TouchableOpacity>

      <Text style={styles.headerTitle}>Waitlist</Text>

      <TouchableOpacity style={styles.helpButton} onPress={onHelpPress}>
        <Ionicons name="help-circle-outline" size={RF(22)} color={ORANGE} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#fff",
    paddingHorizontal: wp(4),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    color: "#1f2937",
    fontSize: RF(20),
    fontWeight: "900",
    fontFamily: Typography?.bold,
  },
  helpButton: {
    marginLeft: "auto",
  },
});