import { Ionicons } from "@expo/vector-icons";

import { useState } from "react";

import { router, useLocalSearchParams } from "expo-router";

import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";import { hp, RF, wp } from "../../utils/responsive";

const cardBack = require("../../assets/images/tarot-card.png");

const PickCard = () => {
  const { name } = useLocalSearchParams();

  const [selectedCards, setSelectedCards] = useState([]);

  const toggleCard = (index) => {
    if (selectedCards.includes(index)) {
      setSelectedCards(selectedCards.filter((item) => item !== index));

      return;
    }

    if (selectedCards.length < 3) {
      setSelectedCards([...selectedCards, index]);
    }
  };

  const continueReading = () => {
    if (selectedCards.length !== 3) {
      Alert.alert(
        "Select Cards",

        "Please select 3 cards to continue",
      );

      return;
    }

    router.push({
      pathname: "/Reading",

      params: {
        name: name,

        selectedCards: JSON.stringify(selectedCards),
      },
    });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={RF(22)} color="#ff5a00" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Tarot Reading</Text>

        <Text style={styles.sparkle}>✦</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        <View style={styles.hero}>
          <Text style={styles.leaf}>❧</Text>

          <Text style={styles.mainTitle}>
            Now, pick the{" "}
            <Text style={styles.orange}>cards{"\n"}that call to you...</Text>
          </Text>

          <Text style={styles.subTitle}>
            Select up to 3 cards •{" "}
            <Text style={styles.green}>{selectedCards.length}/3 selected</Text>
          </Text>
        </View>

        <View style={styles.cardsGrid}>
          {Array.from({
            length: 9,
          }).map((_, index) => {
            const selected = selectedCards.includes(index);

            return (
              <TouchableOpacity
                key={index}
                activeOpacity={0.85}
                onPress={() => toggleCard(index)}
                style={[styles.cardOuter, selected && styles.selectedCardOuter]}
              >
                <Image source={cardBack} style={styles.cardImage} />
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity style={styles.button} onPress={continueReading}>
          <Text style={styles.buttonIcon}>☯</Text>

          <Text style={styles.buttonText}>Reveal Your Reading</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PickCard;

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
    fontSize: RF(18),
    fontWeight: "700",
    color: "#ff5a00",
  },
  sparkle: {
    fontSize: RF(22),
    color: "#2f8d34",
  },
  scroll: {
    paddingHorizontal: wp(5),
    paddingBottom: hp(3),
  },
  hero: {
    alignItems: "center",
    marginTop: hp(1),
    marginBottom: hp(1.5),
  },
  leaf: {
    position: "absolute",
    left: wp(0),
    top: hp(1),
    fontSize: RF(38),
    color: "#6fa35e",
    transform: [{ rotate: "-25deg" }],
  },
  mainTitle: {
    fontSize: RF(22),
    lineHeight: hp(3.5),
    color: "#252525",
    textAlign: "center",
    fontWeight: "700",
  },
  orange: {
    color: "#ff5a00",
  },
  subTitle: {
    fontSize: RF(10),
    color: "#999",
    marginTop: hp(0.6),
    fontWeight: "500",
  },
  green: {
    color: "#2f8d34",
  },
  cardsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: wp(2),
    marginTop: hp(1),
  },
  cardOuter: {
    width: wp(25),
    height: hp(18),
    borderRadius: wp(2),
    marginBottom: hp(2),
    backgroundColor: "#fff",
    padding: wp(0.7),
    borderWidth: 1,
    borderColor: "#ffb15f",
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  selectedCardOuter: {
    borderWidth: 2,
    borderColor: "#2f8d34",
    transform: [{ translateY: -hp(0.6) }],
  },
  cardImage: {
    width: "100%",
    height: "100%",
    borderRadius: wp(1.5),
    resizeMode: "cover",
  },
  button: {
    height: hp(6),
    backgroundColor: "#ff5a00",
    borderRadius: wp(8),
    marginHorizontal: wp(2),
    marginTop: hp(0.5),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#ff5a00",
    shadowOpacity: 0.35,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 6,
  },
  buttonIcon: {
    color: "#fff",
    fontSize: RF(22),
    marginRight: wp(2),
  },
  buttonText: {
    color: "#fff",
    fontSize: RF(13),
    fontWeight: "700",
  },
});
