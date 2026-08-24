import { Image, ScrollView, StyleSheet, Text, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import Colors from "../../constants/Colors";import { hp, RF, wp } from "../../utils/responsive";

export default function PalmDetail() {
  const {
    palmImage,

    lifeLine,

    heartLine,

    headLine,

    fateLine,
  } = useLocalSearchParams();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Header */}

        <View style={styles.header}>
          <Text style={styles.title}>Palm Reading Result</Text>

          <Ionicons name="sparkles" size={RF(22)} color={Colors.primary} />
        </View>

        {/* Palm Image */}

        {palmImage && (
          <View style={styles.imageBox}>
            <Image
              source={{
                uri: palmImage,
              }}
              style={styles.image}
              resizeMode="cover"
            />
          </View>
        )}

        {/* Result Cards */}

        <ResultCard
          icon="heart-outline"
          title="Heart Line"
          value={heartLine || "No result available"}
        />

        <ResultCard
          icon="bulb-outline"
          title="Head Line"
          value={headLine || "No result available"}
        />

        <ResultCard
          icon="fitness-outline"
          title="Life Line"
          value={lifeLine || "No result available"}
        />

        <ResultCard
          icon="star-outline"
          title="Fate Line"
          value={fateLine || "No result available"}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

function ResultCard({ icon, title, value }) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Ionicons name={icon} size={RF(22)} color={Colors.primary} />

        <Text style={styles.cardTitle}>{title}</Text>
      </View>

      <Text style={styles.description}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: "#FFF8F4",
  },

  content: {
    paddingBottom: hp(3),

    paddingHorizontal: wp(4),
  },

  header: {
    height: hp(7),

    flexDirection: "row",

    alignItems: "center",

    justifyContent: "center",

    gap: wp(2),
  },

  title: {
    fontSize: RF(21),

    color: Colors.darkBrown,

    fontWeight: "600",
  },

  imageBox: {
    height: hp(35),

    width: "100%",

    borderRadius: wp(5),

    overflow: "hidden",

    backgroundColor: "#fff",

    marginTop: hp(1),

    elevation: 3,
  },

  image: {
    width: "100%",

    height: "100%",
  },

  card: {
    backgroundColor: "#fff",

    marginTop: hp(2),

    borderRadius: wp(4),

    padding: wp(4),

    elevation: 2,

    shadowColor: "#000",

    shadowOpacity: 0.08,

    shadowRadius: 5,

    shadowOffset: {
      width: 0,
      height: 2,
    },
  },

  cardHeader: {
    flexDirection: "row",

    alignItems: "center",

    marginBottom: hp(1),
  },

  cardTitle: {
    marginLeft: wp(2),

    fontSize: RF(16),

    color: Colors.darkBrown,

    fontWeight: "600",
  },

  description: {
    fontSize: RF(13),

    lineHeight: RF(21),

    color: "#666",

    fontWeight: "400",
  },
});
