import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import Colors from "../../constants/Colors";
import { hp, RF, wp } from "../../utils/responsive";

export default function SectionHeader({ title, onPress }) {
  return (
    <View style={styles.container}>
      {/* Left Title */}

      <View style={styles.leftContainer}>
        <View style={styles.indicator} />

        <Text style={styles.title}>{title}</Text>
      </View>

      {/* Right Button */}

      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onPress}
        style={styles.button}
      >
        {/* <Text style={styles.buttonText}>
          See All
        </Text> */}

        {/* <Ionicons name="chevron-forward" size={RF(16)} color={Colors.primary} /> */}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: hp(2.5),

    marginBottom: hp(1.5),

    paddingHorizontal: wp(4),

    flexDirection: "row",

    justifyContent: "space-between",

    alignItems: "center",
  },

  leftContainer: {
    flexDirection: "row",

    alignItems: "center",
  },

  indicator: {
    width: wp(1.2),

    height: hp(2.2),

    borderRadius: wp(2),

    backgroundColor: Colors.primary,

    marginRight: wp(2.5),
  },

  title: {
    color: Colors.darkBrown,

    fontSize: RF(18),

    fontWeight: "900",
  },

  button: {
    flexDirection: "row",

    alignItems: "center",
  },

  buttonText: {
    color: Colors.primary,

    fontSize: RF(13),

    fontWeight: "500",
  },
});
