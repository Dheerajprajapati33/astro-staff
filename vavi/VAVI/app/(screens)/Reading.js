import { Ionicons } from "@expo/vector-icons";

import { router, useLocalSearchParams } from "expo-router";

import { useEffect, useState } from "react";

import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";import { hp, RF, wp } from "../../utils/responsive";

import { useDrawTarotCardsMutation } from "../../redux/TarotApi";

const ORANGE = "#ff6a00";

const GREEN = "#6ba53a";

export default function Reading() {
  const { name } = useLocalSearchParams();

  const [
    drawTarotCards,

    {
      data,

      isLoading,
    },
  ] = useDrawTarotCardsMutation();

  const [cards, setCards] = useState([]);

  useEffect(() => {
    if (name) {
      getTarot();
    }
  }, []);

  const getTarot = async () => {
    try {
      const response = await drawTarotCards({
        name: name,
      }).unwrap();

      console.log("Tarot Response", response);

      if (response?.success) {
        setCards(response.data.cards);
      }
    } catch (error) {
      console.log("Tarot Error", error);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={RF(22)} color={ORANGE} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Tarot Reading</Text>

        <Text style={styles.sparkle}>✦</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        <View style={styles.dividerBox}>
          <View style={styles.line} />

          <Text style={styles.sun}>☼</Text>

          <View style={styles.line} />
        </View>

        <Text style={styles.subtitle}>
          Here are your cards & their messages
        </Text>

        {isLoading ? (
          <ActivityIndicator size="large" color={ORANGE} />
        ) : (
          cards.map((item, index) => (
            <View key={index} style={styles.cardBox}>
              <Image
                source={{
                  uri: item.image,
                }}
                style={styles.cardImage}
              />

              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{item.name}</Text>

                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{item.orientation}</Text>
                </View>

                <Text style={styles.desc}>{item.meaning}</Text>

                <TouchableOpacity>
                  <Text style={styles.readMore}>Read More →</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.sideSparkle}>
                ✦{"\n"}✦{"\n"}✦
              </Text>
            </View>
          ))
        )}

        <TouchableOpacity style={styles.greenButton} onPress={getTarot}>
          <Text style={styles.btnIcon}>♧</Text>

          <Text style={styles.greenButtonText}>Draw Again</Text>
        </TouchableOpacity>

        {/* <TouchableOpacity style={styles.outlineButton}>
          <Text style={styles.outlineIcon}>♙</Text>

          <Text style={styles.outlineText}>Ask an Astrologer</Text>
        </TouchableOpacity> */}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#fffdf8",
  },
  header: {
    height: hp(6),
    paddingHorizontal: wp(4),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    fontSize: RF(27),
    fontWeight: "700",
    color: ORANGE,
    fontWeight: "700",
  },
  sparkle: {
    fontSize: RF(22),
    color: ORANGE,
  },
  scroll: {
    paddingHorizontal: wp(5),
    paddingBottom: hp(3),
  },
  dividerBox: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: hp(0.3),
    marginHorizontal: wp(4),
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#f4b46d",
  },
  sun: {
    color: ORANGE,
    fontSize: RF(18),
    marginHorizontal: wp(2),
  },
  subtitle: {
    textAlign: "center",
    fontSize: RF(12),
    color: "#222",
    marginTop: hp(0.7),
    marginBottom: hp(1.8),
    fontWeight: "500",
  },
  cardBox: {
    flexDirection: "row",
    backgroundColor: "#fffdf9",
    borderRadius: wp(4),
    borderWidth: 1,
    borderColor: "#f6d8b7",
    padding: wp(3),
    marginBottom: hp(1.7),
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
    position: "relative",
  },
  cardImage: {
    width: wp(26),
    height: hp(20),
    borderRadius: wp(2),
    resizeMode: "cover",
  },
  cardContent: {
    flex: 1,
    marginLeft: wp(4),
    paddingRight: wp(3),
  },
  cardTitle: {
    fontSize: RF(18),
    color: ORANGE,
    fontWeight: "700",
    marginTop: hp(0.3),
    fontWeight: "700",
  },
  badge: {
    alignSelf: "flex-start",
    backgroundColor: "#fff0d8",
    borderRadius: wp(5),
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.45),
    marginTop: hp(0.8),
    marginBottom: hp(1),
  },
  badgeText: {
    fontSize: RF(9),
    color: ORANGE,
    fontWeight: "700",
    fontWeight: "700",
  },
  desc: {
    fontSize: RF(10.5),
    color: "#222",
    lineHeight: hp(2),
    fontWeight: "400",
  },
  readMore: {
    fontSize: RF(10.5),
    color: ORANGE,
    marginTop: hp(1.2),
    fontWeight: "500",
  },
  sideSparkle: {
    position: "absolute",
    right: wp(3),
    top: hp(2),
    color: ORANGE,
    fontSize: RF(11),
    lineHeight: hp(2),
  },
  greenButton: {
    height: hp(5),
    borderRadius: wp(8),
    backgroundColor: GREEN,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: wp(3),
    shadowColor: GREEN,
    shadowOpacity: 0.35,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
  },
  btnIcon: {
    color: "#fff",
    fontSize: RF(19),
    marginRight: wp(3),
  },
  greenButtonText: {
    color: "#fff",
    fontSize: RF(13),
    fontWeight: "700",
    fontWeight: "700",
  },
  outlineButton: {
    height: hp(5),
    borderRadius: wp(8),
    borderWidth: 1,
    borderColor: GREEN,
    backgroundColor: "#fbfff7",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: wp(3),
    marginTop: hp(1),
  },
  outlineIcon: {
    color: GREEN,
    fontSize: RF(18),
    marginRight: wp(3),
  },
  outlineText: {
    color: GREEN,
    fontSize: RF(13),
    fontWeight: "700",
    fontWeight: "700",
  },
});
