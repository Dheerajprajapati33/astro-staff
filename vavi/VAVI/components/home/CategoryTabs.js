import { ScrollView, StyleSheet, Text, TouchableOpacity } from "react-native";

import Colors from "../../constants/Colors";
import { hp, RF, wp } from "../../utils/responsive";
import Shadows from "../../utils/shadows";

const categories = [
  "All",
  "Love & Relationship",
  "Career",
  "Business",
  "Health",
];

export default function CategoryTabs({ selected = "All", onSelect }) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {categories.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={[styles.tab, selected === item && styles.activeTab]}
          onPress={() => onSelect?.(item)}
        >
          <Text style={[styles.text, selected === item && styles.activeText]}>
            {item}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: wp(4),
    paddingVertical: hp(1),
    marginTop: hp(1),
  },

  tab: {
    paddingHorizontal: wp(4),
    height: hp(4.5),
    borderRadius: wp(6),
    backgroundColor: Colors.white,
    marginRight: wp(2),
    justifyContent: "center",
    ...Shadows.sm,
  },

  activeTab: {
    backgroundColor: Colors.primary,
    ...Shadows.primary,
  },

  text: {
    fontSize: RF(18),
    fontWeight: "900",
  },

  activeText: {
    color: Colors.white,
  },
});
