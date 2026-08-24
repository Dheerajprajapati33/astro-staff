import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import Colors from "../../constants/Colors";import { hp, wp, RF } from "../../utils/responsive";

export default function TransactionHeader() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Recent Transactions
      </Text>

      <TouchableOpacity style={styles.filter}>
        <Ionicons
          name="options-outline"
          size={RF(18)}
          color={Colors.primary}
        />

        <Text style={styles.filterText}>
          Filter
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: hp(2),
    marginBottom: hp(1),

    paddingHorizontal: wp(4),

    flexDirection: "row",

    justifyContent: "space-between",

    alignItems: "center",
  },

  title: {
    fontSize: RF(17),
    color: Colors.darkBrown,
    fontWeight: "600",
  },

  filter: {
    flexDirection: "row",
    alignItems: "center",

    backgroundColor: "#FFF4ED",

    paddingHorizontal: wp(3),
    paddingVertical: hp(0.7),

    borderRadius: wp(5),
  },

  filterText: {
    marginLeft: wp(1),

    color: Colors.primary,

    fontSize: RF(12),

    fontWeight: "500",
  },
});