import React from "react";

import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import Colors from "../../constants/Colors";import { hp, wp, RF } from "../../utils/responsive";

export default function SearchBar() {
  return (
    <View style={styles.container}>

      <View style={styles.searchBox}>

        {/* Search Icon */}

        <Ionicons
          name="search"
          size={RF(20)}
          color="#999"
        />

        {/* Input */}

        <TextInput
          placeholder="Search astrologers, tarot, kundli..."
          placeholderTextColor="#999"
          style={styles.input}
          returnKeyType="search"
        />

        {/* Filter Button */}

        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.filterButton}
        >
          <Ionicons
            name="options-outline"
            size={RF(18)}
            color={Colors.primary}
          />
        </TouchableOpacity>

      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: hp(2),

    paddingHorizontal: wp(4),
  },

  searchBox: {
    height: hp(6.5),

    backgroundColor: Colors.white,

    borderRadius: wp(4),

    flexDirection: "row",

    alignItems: "center",

    paddingHorizontal: wp(4),

    borderWidth: 1,

    borderColor: "#ECECEC",

    shadowColor: "#000",

    shadowOpacity: 0.05,

    shadowRadius: 8,

    shadowOffset: {
      width: 0,
      height: 3,
    },

    elevation: 2,
  },

  input: {
    flex: 1,

    marginLeft: wp(3),

    color: Colors.darkBrown,

    fontSize: RF(14),

    fontWeight: "400",
  },

  filterButton: {
    width: wp(10),

    height: wp(10),

    borderRadius: wp(5),

    backgroundColor: "#FFF5ED",

    justifyContent: "center",

    alignItems: "center",
  },
});