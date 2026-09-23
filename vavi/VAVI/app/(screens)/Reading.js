import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  drawRandomTarotCards,
  findTarotCardByName,
} from "../../data/tarotDeck";
import { useDrawTarotCardsMutation } from "../../redux/TarotApi";
import { hp, RF, wp } from "../../utils/responsive";

const ORANGE = "#ff7a00";
const DARK_ORANGE = "#e66000";
const LIGHT_BG = "#fffdf7";
const CARD_BG = "#ffffff";
const BORDER_COLOR = "#f6e2cc";
const BADGE_BG = "#fff0dc";

const getImageSource = (img) => {
  if (!img) return require("../../assets/images/Tarot_Fool.jpg");
  if (typeof img === "string") return { uri: img };
  return img;
};

export default function Reading() {
  const { name, selectedCards } = useLocalSearchParams();

  const [drawTarotCards, { isLoading: isApiLoading }] =
    useDrawTarotCardsMutation();

  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCardDetail, setSelectedCardDetail] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    getTarot();
  }, []);

  const getTarot = async () => {
    setLoading(true);
    try {
      if (name) {
        const response = await drawTarotCards({ name }).unwrap();
        if (response?.success && response?.data?.cards?.length > 0) {
          // Normalize response & match with local assets
          const formatted = response.data.cards.map((c) => {
            // Respect API if explicitly specified, otherwise natural 50/50 tarot probability
            const hasExplicitReverse =
              c.orientation?.toLowerCase() === "reversed" ||
              c.orientation?.toLowerCase() === "reverse";
            const isReversed =
              hasExplicitReverse ||
              (c.orientation?.toLowerCase() === "upright"
                ? Math.random() > 0.5
                : Math.random() > 0.5);

            const localCard = findTarotCardByName(c.name);
            const orientationKey = isReversed ? "reversed" : "upright";
            const localData = localCard ? localCard[orientationKey] : null;

            return {
              id: c.id || c.name,
              name: localCard?.name || c.name,
              image:
                localCard?.image ||
                c.image ||
                require("../../assets/images/Tarot_Fool.jpg"),
              orientation: isReversed ? "reverse" : "upright",
              isReversed: isReversed,
              meaning: localData?.meaning || c.meaning || c.description,
              description: localData?.description || c.description || c.meaning,
              keywords: localData?.keywords || c.keywords || [],
            };
          });
          setCards(formatted);
          setLoading(false);
          return;
        }
      }
    } catch (error) {
      console.log(
        "Tarot API error, falling back to comprehensive deck:",
        error,
      );
    }

    // Local shuffle & random draw
    const randomDraw = drawRandomTarotCards(3);
    setCards(randomDraw);
    setLoading(false);
  };

  const openCardDetail = (card) => {
    setSelectedCardDetail(card);
    setModalVisible(true);
  };

  const handleAskAstrologer = () => {
    router.push({
      pathname: "/(tabs)",
      params: { category: "Tarot" },
    });
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="arrow-back" size={RF(22)} color={ORANGE} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Tarot Reading</Text>

        <Text style={styles.sparkle}>✦</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {/* Divider with Sun */}
        <View style={styles.dividerBox}>
          <View style={styles.line} />
          <Text style={styles.sun}>☼</Text>
          <View style={styles.line} />
        </View>

        <Text style={styles.subtitle}>
          Here are your cards & their messages
        </Text>

        {loading ? (
          <View style={styles.loaderBox}>
            <ActivityIndicator size="large" color={ORANGE} />
            <Text style={styles.loaderText}>Shuffling the deck...</Text>
          </View>
        ) : (
          cards.map((item, index) => {
            const isReversed =
              item.orientation === "reverse" || item.isReversed;
            return (
              <View key={item.id || index} style={styles.cardBox}>
                {/* Tarot Card Image (Inverted if Reversed) */}
                <View style={styles.imageWrapper}>
                  <Image
                    source={getImageSource(item.image)}
                    style={[
                      styles.cardImage,
                      isReversed && styles.reversedImage,
                    ]}
                  />
                </View>

                {/* Card Information */}
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle} numberOfLines={1}>
                    {item.name}
                  </Text>

                  {/* Orientation Badge */}
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>
                      {item.orientation || (isReversed ? "reverse" : "upright")}
                    </Text>
                  </View>

                  {/* Meaning Preview */}
                  <Text style={styles.desc} numberOfLines={3}>
                    {item.meaning}
                  </Text>

                  <TouchableOpacity
                    onPress={() => openCardDetail(item)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.readMore}>Read More →</Text>
                  </TouchableOpacity>
                </View>

                {/* Decorative Side Sparkles */}
                <Text style={styles.sideSparkle}>
                  ✦{"\n"}✦{"\n"}✦
                </Text>
              </View>
            );
          })
        )}

        {/* Action Buttons (Balaji Astro Style) */}
        {!loading && (
          <View style={styles.buttonContainer}>
            {/* Draw Again - Solid Orange */}
            <TouchableOpacity
              style={styles.drawAgainButton}
              activeOpacity={0.85}
              onPress={getTarot}
              onPress={() => router.back()}
            >
              <Text style={styles.drawAgainText}>Draw Again</Text>
            </TouchableOpacity>

            {/* Ask an Astrologer - Outlined Orange */}
            <TouchableOpacity
              style={styles.askAstrologerButton}
              activeOpacity={0.85}
              onPress={handleAskAstrologer}
            >
              <Text style={styles.askAstrologerText}>Ask an Astrologer</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Read More Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {selectedCardDetail && (
              <>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>
                    {selectedCardDetail.name}
                  </Text>
                  <TouchableOpacity
                    onPress={() => setModalVisible(false)}
                    style={styles.closeBtn}
                  >
                    <Ionicons name="close" size={RF(20)} color="#555" />
                  </TouchableOpacity>
                </View>

                <ScrollView
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.modalScroll}
                >
                  <View style={styles.modalImageWrapper}>
                    <Image
                      source={getImageSource(selectedCardDetail.image)}
                      style={[
                        styles.modalImage,
                        (selectedCardDetail.orientation === "reverse" ||
                          selectedCardDetail.isReversed) &&
                          styles.reversedImage,
                      ]}
                    />
                    <View style={styles.modalBadge}>
                      <Text style={styles.modalBadgeText}>
                        {selectedCardDetail.orientation?.toUpperCase()}
                      </Text>
                    </View>
                  </View>

                  {selectedCardDetail.keywords?.length > 0 && (
                    <View style={styles.keywordsContainer}>
                      {selectedCardDetail.keywords.map((kw, i) => (
                        <View key={i} style={styles.keywordChip}>
                          <Text style={styles.keywordText}>{kw}</Text>
                        </View>
                      ))}
                    </View>
                  )}

                  <Text style={styles.sectionHeader}>Interpretation</Text>
                  <Text style={styles.modalDesc}>
                    {selectedCardDetail.description ||
                      selectedCardDetail.meaning}
                  </Text>
                </ScrollView>

                <TouchableOpacity
                  style={styles.modalDoneBtn}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.modalDoneText}>Got it</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: LIGHT_BG,
  },
  header: {
    height: hp(6),
    paddingHorizontal: wp(4),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    fontSize: RF(24),
    fontWeight: "700",
    color: ORANGE,
  },
  sparkle: {
    fontSize: RF(20),
    color: ORANGE,
  },
  scroll: {
    paddingHorizontal: wp(4),
    paddingBottom: hp(4),
  },
  dividerBox: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: hp(0.2),
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
    fontSize: RF(12.5),
    color: "#333",
    marginTop: hp(0.8),
    marginBottom: hp(2),
    fontWeight: "500",
  },
  loaderBox: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: hp(8),
  },
  loaderText: {
    marginTop: hp(2),
    fontSize: RF(13),
    color: ORANGE,
    fontWeight: "600",
  },
  cardBox: {
    flexDirection: "row",
    backgroundColor: CARD_BG,
    borderRadius: wp(4),
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    padding: wp(3.5),
    marginBottom: hp(1.8),
    shadowColor: "#e09040",
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    position: "relative",
  },
  imageWrapper: {
    width: wp(23),
    height: hp(16.5),
    borderRadius: wp(2),
    overflow: "hidden",
    backgroundColor: "#f9f3ea",
    borderWidth: 1,
    borderColor: "#eedcc9",
  },
  cardImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  reversedImage: {
    transform: [{ rotate: "180deg" }],
  },
  cardContent: {
    flex: 1,
    marginLeft: wp(3.5),
    paddingRight: wp(4),
    justifyContent: "center",
  },
  cardTitle: {
    fontSize: RF(17),
    color: ORANGE,
    fontWeight: "700",
  },
  badge: {
    alignSelf: "flex-start",
    backgroundColor: BADGE_BG,
    borderRadius: wp(5),
    paddingHorizontal: wp(2.8),
    paddingVertical: hp(0.35),
    marginTop: hp(0.5),
    marginBottom: hp(0.8),
  },
  badgeText: {
    fontSize: RF(10),
    color: "#d66a00",
    fontWeight: "600",
    textTransform: "lowercase",
  },
  desc: {
    fontSize: RF(11),
    color: "#444",
    lineHeight: hp(2.1),
    fontWeight: "400",
  },
  readMore: {
    fontSize: RF(11),
    color: ORANGE,
    marginTop: hp(1),
    fontWeight: "600",
  },
  sideSparkle: {
    position: "absolute",
    right: wp(3),
    top: hp(2),
    color: ORANGE,
    fontSize: RF(10),
    lineHeight: hp(1.8),
    opacity: 0.8,
  },
  buttonContainer: {
    marginTop: hp(1.5),
    gap: hp(1.2),
  },
  drawAgainButton: {
    height: hp(5.4),
    borderRadius: wp(8),
    backgroundColor: ORANGE,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: ORANGE,
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  drawAgainText: {
    color: "#ffffff",
    fontSize: RF(14),
    fontWeight: "700",
  },
  askAstrologerButton: {
    height: hp(5.4),
    borderRadius: wp(8),
    borderWidth: 1.5,
    borderColor: ORANGE,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
  },
  askAstrologerText: {
    color: ORANGE,
    fontSize: RF(14),
    fontWeight: "700",
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: wp(4),
  },
  modalContainer: {
    width: "100%",
    maxHeight: hp(80),
    backgroundColor: "#ffffff",
    borderRadius: wp(5),
    padding: wp(5),
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: hp(1.5),
  },
  modalTitle: {
    fontSize: RF(19),
    fontWeight: "700",
    color: ORANGE,
    flex: 1,
  },
  closeBtn: {
    padding: wp(1),
  },
  modalScroll: {
    alignItems: "center",
    paddingBottom: hp(2),
  },
  modalImageWrapper: {
    alignItems: "center",
    marginBottom: hp(1.5),
  },
  modalImage: {
    width: wp(34),
    height: hp(24),
    borderRadius: wp(3),
    resizeMode: "cover",
  },
  modalBadge: {
    backgroundColor: BADGE_BG,
    borderRadius: wp(4),
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.4),
    marginTop: hp(1),
  },
  modalBadgeText: {
    fontSize: RF(11),
    color: ORANGE,
    fontWeight: "700",
  },
  keywordsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: wp(1.5),
    marginBottom: hp(1.5),
  },
  keywordChip: {
    backgroundColor: "#fdf2e4",
    paddingHorizontal: wp(2.5),
    paddingVertical: hp(0.4),
    borderRadius: wp(3),
  },
  keywordText: {
    fontSize: RF(10),
    color: "#b05000",
    fontWeight: "600",
  },
  sectionHeader: {
    fontSize: RF(14),
    fontWeight: "700",
    color: "#222",
    alignSelf: "flex-start",
    marginTop: hp(1),
    marginBottom: hp(0.5),
  },
  modalDesc: {
    fontSize: RF(12),
    color: "#444",
    lineHeight: hp(2.3),
    textAlign: "left",
    alignSelf: "stretch",
  },
  modalDoneBtn: {
    marginTop: hp(1),
    backgroundColor: ORANGE,
    borderRadius: wp(6),
    height: hp(4.8),
    alignItems: "center",
    justifyContent: "center",
  },
  modalDoneText: {
    color: "#fff",
    fontSize: RF(13),
    fontWeight: "700",
  },
});
