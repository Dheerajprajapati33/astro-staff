import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

import Colors from "../../constants/Colors";
import { hp, wp, RF } from "../../utils/responsive";
import Shadows from "../../utils/shadows";

export default function OfferBanner() {
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.title}>
          First Consultation Offer!
        </Text>

        <Text style={styles.subtitle}>
          Get 10% OFF on your first session
        </Text>
      </View>

      <TouchableOpacity style={styles.btn}>
        <Text style={styles.btnText}>
          Claim Offer
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: wp(4),
    backgroundColor: Colors.white,
    borderRadius: wp(4),
    padding: wp(4),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    ...Shadows.md,
  },

  title: {
    fontWeight: "600",
    fontSize: RF(15),
  },

  subtitle: {
    marginTop: hp(0.5),
    color: Colors.textGray,
  },

  btn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: wp(5),
    paddingVertical: hp(1.2),
    borderRadius: wp(6),
    ...Shadows.primary,
  },

  btnText: {
    color: Colors.white,
    fontWeight: "600",
  },
});
