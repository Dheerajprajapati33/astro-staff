import {
  FlatList,
  Image,
 
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../components/home/Header";

import Colors from "../../constants/Colors";
import ServicesData from "../../constants/Services";import { hp, RF, wp } from "../../utils/responsive";

export default function Services() {
  const renderItem = ({ item }) => (
    <TouchableOpacity
      activeOpacity={0.85}
      style={styles.card}
      onPress={() =>
        router.push({
          pathname: "/ServiceDetail",
          params: {
            id: item.id,
          },
        })
      }
    >
      {/* Top Decorative Stars */}

      <View style={styles.starRow}>
        <Text style={styles.star}>✦</Text>
        <Text style={styles.star}>✦</Text>
      </View>

      {/* Service Image */}

      <Image source={item.icon} style={styles.icon} resizeMode="contain" />

      {/* Title */}

      <Text style={styles.title}>{item.title}</Text>

      {/* Description */}

      <Text style={styles.description}>{item.description}</Text>

      {/* Explore Button */}

      <TouchableOpacity activeOpacity={0.8} style={styles.button}>
        <Text style={styles.buttonText}>Explore</Text>

        <Ionicons name="arrow-forward" size={RF(15)} color="#2E7D32" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header />

      {/* Heading */}

      <View style={styles.headingContainer}>
        <View style={styles.orangeLine} />

        <View>
          <Text style={styles.heading}>Our Services</Text>

          <Text style={styles.subHeading}>
            Explore our wide range of astrology services
          </Text>
        </View>
      </View>

      <FlatList
        data={ServicesData}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        columnWrapperStyle={styles.row}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF8F4",
  },

  headingContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: hp(2),
    marginHorizontal: wp(5),
    marginBottom: hp(2),
  },

  orangeLine: {
    width: wp(1),
    height: hp(3),
    borderRadius: 20,
    backgroundColor: Colors.primary,
    marginRight: wp(3),
    marginTop: hp(0.4),
  },

  heading: {
    fontSize: RF(20),
    color: Colors.primary,
    fontWeight: "700",
  },

  subHeading: {
    marginTop: hp(0.4),
    color: "#2E7D32",
    fontSize: RF(12),
    fontWeight: "400",
  },

  listContainer: {
    paddingHorizontal: wp(4),
    paddingBottom: hp(4),
  },

  row: {
    justifyContent: "space-between",
    marginBottom: hp(2),
  },
  card: {
    width: "48%",
    backgroundColor: Colors.white,
    borderRadius: wp(5),
    paddingVertical: hp(2),
    paddingHorizontal: wp(3),
    alignItems: "center",

    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 3,
    },

    elevation: 4,
  },

  starRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: hp(1),
  },

  star: {
    color: "#FDBA12",
    fontSize: RF(10),
  },

  icon: {
    width: wp(18),
    height: wp(18),
    marginBottom: hp(1.5),
  },

  title: {
    fontSize: RF(17),
    color: Colors.darkBrown,
    fontWeight: "600",
    textAlign: "center",
  },

  description: {
    marginTop: hp(0.8),
    fontSize: RF(11),
    color: Colors.textGray,
    fontWeight: "400",
    textAlign: "center",
    lineHeight: RF(17),
    minHeight: hp(5.5),
    paddingHorizontal: wp(1),
  },

  button: {
    marginTop: hp(2),
    width: "100%",
    height: hp(4.8),

    borderWidth: 1.5,
    borderColor: "#2E7D32",

    borderRadius: wp(3),

    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",

    backgroundColor: "#F8FFF8",
  },

  buttonText: {
    color: "#2E7D32",
    fontSize: RF(13),
    fontWeight: "600",
    marginRight: wp(1.5),
  },
  // Optional premium effect (future use)
  cardPressed: {
    transform: [{ scale: 0.98 }],
  },

  badge: {
    position: "absolute",
    top: hp(1),
    right: wp(2),
    backgroundColor: "#FFF3D6",
    paddingHorizontal: wp(2),
    paddingVertical: hp(0.3),
    borderRadius: wp(3),
  },

  badgeText: {
    color: "#F59E0B",
    fontSize: RF(9),
    fontWeight: "500",
  },

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: hp(8),
  },

  emptyText: {
    fontSize: RF(15),
    color: Colors.textGray,
    fontWeight: "500",
  },

  footerSpacing: {
    height: hp(3),
  },
});
