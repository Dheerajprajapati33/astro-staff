import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { router } from "expo-router";

import Colors from "../../constants/Colors";
import TrendingConsultations from "../../constants/TrendingConsultations";
import { hp, RF, wp } from "../../utils/responsive";

export default function TrendingGrid() {
  const handleCategoryPress = (item) => {
    router.push({
      pathname: "/(tabs)",
      params: { category: item.title },
    });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      activeOpacity={0.85}
      style={styles.card}
      onPress={() => handleCategoryPress(item)}
    >
      {/* Icon */}

      <View style={styles.iconContainer}>
        <Ionicons name={item.icon} size={RF(28)} color={Colors.primary} />
      </View>

      {/* Title */}

      <Text style={styles.title}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <FlatList
      horizontal
      data={TrendingConsultations}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderItem}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.listContainer}
    />
  );
}

const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: wp(4),
    marginBottom: 10,
    paddingRight: wp(2),
  },

  card: {
    width: wp(32),

    backgroundColor: Colors.white,

    borderRadius: wp(4),

    paddingVertical: hp(2),

    paddingHorizontal: wp(3),

    alignItems: "center",

    marginRight: wp(3),

    borderWidth: 1,

    borderColor: "#F2E6DD",

    shadowColor: "#000",

    shadowOpacity: 0.05,

    shadowRadius: 6,

    shadowOffset: {
      width: 0,
      height: 2,
    },

    elevation: 2,
  },

  iconContainer: {
    width: wp(15),

    height: wp(15),

    borderRadius: wp(7.5),

    backgroundColor: "#FFF4EA",

    justifyContent: "center",

    alignItems: "center",

    marginBottom: hp(1.2),
  },

  title: {
    color: Colors.darkBrown,

    fontSize: RF(16),

    textAlign: "center",

    fontWeight: "800",
  },
});
