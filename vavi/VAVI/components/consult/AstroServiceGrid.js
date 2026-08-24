import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import AstroServices from "../../constants/AstroServices";
import Colors from "../../constants/Colors";
import { hp, RF, wp } from "../../utils/responsive";

const routeMap = {
  1: "/kundli",
  2: "/index",
  3: "/Tarotreading",
  4: "/love",
  5: "/DiscoverNumbar",
  6: "/Palm",
  7: "/Kundlimatching",
  8: "/Panchang",
};

export default function AstroServiceGrid() {
  const handleRoute = (item) => {
    const path = routeMap[item.id];

    if (path) {
      router.push(path);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      activeOpacity={0.85}
      style={styles.card}
      onPress={() => handleRoute(item)}
    >
      <View style={styles.iconCircle}>
        <Ionicons name={item.icon} size={RF(28)} color={Colors.primary} />
      </View>

      <Text numberOfLines={2} style={styles.title}>
        {item.title}
      </Text>

      <Text numberOfLines={2} style={styles.subtitle}>
        {item.subtitle}
      </Text>
    </TouchableOpacity>
  );

  return (
    <FlatList
      horizontal
      data={AstroServices}
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
    borderWidth: 1,
    borderColor: "#F2E6DD",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: hp(2),
    paddingHorizontal: wp(3),
    marginRight: wp(3),
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  iconCircle: {
    width: wp(14),
    height: wp(14),
    borderRadius: wp(7),
    backgroundColor: "#FFF4EA",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: hp(1.2),
  },
  title: {
    color: Colors.darkBrown,
    fontSize: RF(16),
    fontWeight: "800",
    textAlign: "center",
    lineHeight: RF(17),
    //paddingHorizontal: wp(0.5),
  },
  subtitle: {
    color: "#777777",
    fontSize: RF(13),
    fontWeight: "500",
    textAlign: "center",
    lineHeight: RF(14),
    marginTop: hp(0.4),
    paddingHorizontal: wp(0.8),
    minHeight: hp(0.2),
  },
});
