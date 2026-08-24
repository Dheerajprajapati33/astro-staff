import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, TextInput, View } from "react-native";

import Colors from "../../constants/Colors";
import { hp, RF, wp } from "../../utils/responsive";
import Shadows from "../../utils/shadows";

export default function SearchBar({ value, onChangeText }) {
  return (
    <View style={styles.row}>
      <View style={styles.searchBox}>
        <Ionicons name="search-outline" size={RF(20)} color={Colors.textGray} />

        <TextInput
          placeholder="Search astrologers, services..."
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          returnKeyType="search"
          clearButtonMode="while-editing"
        />
      </View>

      {/* <TouchableOpacity style={styles.filterBtn}>
        <Ionicons
          name="options-outline"
          size={RF(18)}
          color={Colors.primary}
        />
      </TouchableOpacity> */}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    paddingHorizontal: wp(5),
    marginTop: hp(2),
  },

  searchBox: {
    flex: 1,
    height: hp(6),
    backgroundColor: Colors.white,
    borderRadius: wp(3),
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: wp(3),
    ...Shadows.md,
  },

  input: {
    flex: 1,
    marginLeft: wp(2),
  },

  filterBtn: {
    marginLeft: wp(3),
    width: wp(14),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: wp(3),
    borderWidth: 1,
    borderColor: Colors.lightPeach,
  },
});
