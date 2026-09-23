import { useState, useMemo } from "react";
import {
  ScrollView,
  Share,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Colors from "../../constants/Colors";
import { hp, RF, wp } from "../../utils/responsive";
import { RASHIS, getTodayUpayaForRashi } from "../../data/rashiUpayaData";

export default function AajKaMahaUpaya() {
  const router = useRouter();
  const [selectedRashiId, setSelectedRashiId] = useState("mesh");
  const [expandedUpayaId, setExpandedUpayaId] = useState(null);
  const [showAllList, setShowAllList] = useState(false);

  // Calculate today's remedy based on selected Rashi and current Date
  const todayData = useMemo(() => {
    return getTodayUpayaForRashi(selectedRashiId, new Date());
  }, [selectedRashiId]);

  const activeRashi = todayData.rashi;
  const todayUpaya = todayData.upaya;

  const todayDateFormatted = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const handleShare = async (upayaItem, rashiItem) => {
    try {
      const shareMessage = `✨ *Aaj Ka Maha Upaya (${rashiItem.name} / ${rashiItem.hindiName})* ✨\n\n🌟 *${upayaItem.title}*\n\n🎯 *Uddeshya:* ${upayaItem.target}\n⏰ *Shubh Samay:* ${upayaItem.bestTime}\n🧭 *Disha:* ${upayaItem.direction}\n🎨 *Lucky Color:* ${upayaItem.luckyColor}\n🔢 *Lucky Number:* ${upayaItem.luckyNumber}\n\n🪔 *Saral Vidhi:*\n${upayaItem.vidhi.map((v, i) => `${i + 1}. ${v}`).join("\n")}\n\n🕉️ *Mantra:* ${upayaItem.mantra}\n\n💫 *Positive Affirmation:* "${upayaItem.affirmation}"\n\n✨ *Laabh:* ${upayaItem.benefit}\n\n📱 *Vavi Astrology App se prapt*`;

      await Share.share({
        message: shareMessage,
      });
    } catch (error) {
      console.log("Share error:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF8F4" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.backBtn}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={RF(22)} color={Colors.darkBrown} />
        </TouchableOpacity>
        <View style={styles.headerTitleWrap}>
          <Text style={styles.headerTitle}>Aaj Ka Maha Upaya</Text>
          <Text style={styles.headerSubtitle}>
            दैनिक राशि महाउपाय • 100% Positive Remedies
          </Text>
        </View>
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.rightIcon}
          onPress={() => handleShare(todayUpaya, activeRashi)}
        >
          <Ionicons
            name="share-social-outline"
            size={RF(20)}
            color={Colors.primary}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Top Banner with Today's Date */}
        <LinearGradient
          colors={["#FF8A00", "#E65100"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.topBanner}
        >
          <View style={styles.bannerBadge}>
            <Ionicons name="sparkles" size={RF(12)} color={Colors.white} />
            <Text style={styles.bannerBadgeText}>
              Daily Auspicious Guidance
            </Text>
          </View>
          <Text style={styles.bannerDate}>{todayDateFormatted}</Text>
          <Text style={styles.bannerSubtitle}>
            Apni rashi select karein aur paayein aaj ka vishesh, sakaratmak aur
            kalyankari Vedic mahaupaay.
          </Text>
        </LinearGradient>

        {/* 12 Rashi Horizontal Selector */}
        <View style={styles.rashiSection}>
          <View style={styles.rashiSectionHeader}>
            <Text style={styles.sectionTitle}>
              Select Your Rashi (अपनी राशि चुनें)
            </Text>
            <Text style={styles.sectionSubBadge}>12 Rashis</Text>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.rashiScroll}
          >
            {RASHIS.map((rashi) => {
              const isSelected = selectedRashiId === rashi.id;
              return (
                <TouchableOpacity
                  key={rashi.id}
                  activeOpacity={0.85}
                  onPress={() => {
                    setSelectedRashiId(rashi.id);
                    setExpandedUpayaId(null);
                  }}
                  style={[
                    styles.rashiCard,
                    isSelected && styles.rashiCardActive,
                  ]}
                >
                  <LinearGradient
                    colors={
                      isSelected
                        ? ["#FF8A00", "#E65100"]
                        : ["#FFFFFF", "#FFF9F5"]
                    }
                    style={styles.rashiGradient}
                  >
                    <View
                      style={[
                        styles.rashiSymbolCircle,
                        isSelected && styles.rashiSymbolCircleActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.rashiSymbolText,
                          isSelected && styles.rashiSymbolTextActive,
                        ]}
                      >
                        {rashi.symbol}
                      </Text>
                    </View>
                    <Text
                      style={[
                        styles.rashiHindiName,
                        isSelected && styles.rashiHindiNameActive,
                      ]}
                    >
                      {rashi.hindiName}
                    </Text>
                    <Text
                      style={[
                        styles.rashiEngName,
                        isSelected && styles.rashiEngNameActive,
                      ]}
                    >
                      {rashi.name}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Selected Rashi Detail Strip */}
        <View style={styles.rashiInfoStrip}>
          <View style={styles.rashiBadgeRow}>
            <View style={styles.infoPill}>
              <Ionicons
                name="planet-outline"
                size={RF(13)}
                color={Colors.primary}
              />
              <Text style={styles.infoPillText}>
                Swami: {activeRashi.rulingPlanet}
              </Text>
            </View>
            <View style={styles.infoPill}>
              <Ionicons name="flame-outline" size={RF(13)} color="#E65100" />
              <Text style={styles.infoPillText}>
                Tatva: {activeRashi.element}
              </Text>
            </View>
          </View>
        </View>

        {/* Featured Card: Today's Maha Upaya for Selected Rashi */}
        <View style={styles.featuredCard}>
          {/* Card Tag & Deity */}
          <View style={styles.featuredHeader}>
            <View style={styles.featuredTag}>
              <Ionicons name="sunny" size={RF(12)} color={Colors.primary} />
              <Text style={styles.featuredTagText}>
                AAJ KA MAHAUPAY • DAY {todayData.index} OF 15
              </Text>
            </View>
            <View style={styles.deityTag}>
              <Ionicons name="sparkles" size={RF(11)} color="#D84315" />
              <Text style={styles.deityTagText}>{todayUpaya.deity}</Text>
            </View>
          </View>

          {/* Upaya Title & Target */}
          <Text style={styles.featuredTitle}>{todayUpaya.title}</Text>
          <View style={styles.targetBox}>
            <Text style={styles.targetLabel}>🎯 Uddeshya:</Text>
            <Text style={styles.targetText}>{todayUpaya.target}</Text>
          </View>

          {/* Timing, Direction, Color & Number Grid */}
          <View style={styles.gridContainer}>
            <View style={styles.gridBox}>
              <View style={styles.gridIconWrap}>
                <Ionicons
                  name="time-outline"
                  size={RF(15)}
                  color={Colors.primary}
                />
              </View>
              <Text style={styles.gridLabel}>Shubh Samay</Text>
              <Text style={styles.gridValue} numberOfLines={2}>
                {todayUpaya.bestTime}
              </Text>
            </View>

            <View style={styles.gridBox}>
              <View style={styles.gridIconWrap}>
                <Ionicons
                  name="compass-outline"
                  size={RF(15)}
                  color="#2E7D32"
                />
              </View>
              <Text style={styles.gridLabel}>Shubh Disha</Text>
              <Text style={styles.gridValue} numberOfLines={2}>
                {todayUpaya.direction}
              </Text>
            </View>
          </View>

          <View style={[styles.gridContainer, { marginTop: hp(1) }]}>
            <View style={styles.gridBox}>
              <View style={styles.gridIconWrap}>
                <Ionicons
                  name="color-palette-outline"
                  size={RF(15)}
                  color="#D81B60"
                />
              </View>
              <Text style={styles.gridLabel}>Lucky Color</Text>
              <Text style={styles.gridValue} numberOfLines={2}>
                {todayUpaya.luckyColor}
              </Text>
            </View>

            <View style={styles.gridBox}>
              <View style={styles.gridIconWrap}>
                <Ionicons name="keypad-outline" size={RF(15)} color="#7B1FA2" />
              </View>
              <Text style={styles.gridLabel}>Lucky Number</Text>
              <Text style={styles.gridValue} numberOfLines={1}>
                {todayUpaya.luckyNumber}
              </Text>
            </View>
          </View>

          {/* Positive Benefit Box */}
          <View style={styles.benefitBox}>
            <Ionicons name="ribbon-outline" size={RF(18)} color="#1565C0" />
            <View style={styles.benefitTextWrap}>
              <Text style={styles.benefitHeading}>
                Aaj Ka Shubh Prabhav (Benefit):
              </Text>
              <Text style={styles.benefitText}>{todayUpaya.benefit}</Text>
            </View>
          </View>

          {/* Required Items (Samagri) */}
          {todayUpaya.items && todayUpaya.items.length > 0 && (
            <View style={styles.itemsWrap}>
              <Text style={styles.sectionHeading}>
                Saral Samagri (सरल सामग्री):
              </Text>
              <View style={styles.itemPills}>
                {todayUpaya.items.map((item, idx) => (
                  <View key={idx} style={styles.itemPill}>
                    <Text style={styles.itemPillText}>✓ {item}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Step-by-Step Vidhi */}
          <View style={styles.vidhiWrap}>
            <Text style={styles.sectionHeading}>Saral Vidhi (विधि):</Text>
            {todayUpaya.vidhi.map((step, idx) => (
              <View key={idx} style={styles.stepRow}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>{idx + 1}</Text>
                </View>
                <Text style={styles.stepText}>{step}</Text>
              </View>
            ))}
          </View>

          {/* Sacred Mantra Box */}
          {todayUpaya.mantra && (
            <View style={styles.mantraBox}>
              <View style={styles.mantraHeader}>
                <Ionicons
                  name="volume-high-outline"
                  size={RF(16)}
                  color={Colors.primary}
                />
                <Text style={styles.mantraTitle}>Pavitra Chanting Mantra</Text>
              </View>
              <Text style={styles.mantraText}>{todayUpaya.mantra}</Text>
            </View>
          )}

          {/* Positive Affirmation Box */}
          {todayUpaya.affirmation && (
            <View style={styles.affirmationBox}>
              <Ionicons name="sparkles" size={RF(15)} color="#D84315" />
              <View style={{ flex: 1 }}>
                <Text style={styles.affirmationTitle}>
                  Aaj Ka Sakaratmak Sankalp:
                </Text>
                <Text style={styles.affirmationText}>
                  "{todayUpaya.affirmation}"
                </Text>
              </View>
            </View>
          )}

          {/* Do's & Don'ts */}
          <View style={styles.guidelinesRow}>
            <View style={styles.dosBox}>
              <Text style={styles.dosTitle}>✓ Do's:</Text>
              <Text style={styles.guidelineText}>{todayUpaya.dos}</Text>
            </View>
            <View style={styles.dontsBox}>
              <Text style={styles.dontsTitle}>✕ Don'ts:</Text>
              <Text style={styles.guidelineText}>{todayUpaya.donts}</Text>
            </View>
          </View>

          {/* Share Button for Today's Remedy */}
          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.shareUpayaBtn}
            onPress={() => handleShare(todayUpaya, activeRashi)}
          >
            <LinearGradient
              colors={["#FF8A00", "#E65100"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.shareGradient}
            >
              <Ionicons
                name="logo-whatsapp"
                size={RF(18)}
                color={Colors.white}
              />
              <Text style={styles.shareUpayaText}>
                Share Today's Upaya with Family & Friends
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Toggle to View All 15 Remedies of Selected Rashi */}
        <View style={styles.allRemediesSection}>
          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.allRemediesHeaderBtn}
            onPress={() => setShowAllList(!showAllList)}
          >
            <View style={styles.allRemediesHeaderLeft}>
              <Ionicons
                name="list-circle-outline"
                size={RF(22)}
                color={Colors.primary}
              />
              <View>
                <Text style={styles.allRemediesTitle}>
                  Explore All 15 Remedies for {activeRashi.name}
                </Text>
                <Text style={styles.allRemediesSub}>
                  {activeRashi.hindiName} राशि के सभी 15 सकारात्मक उपाय देखें
                </Text>
              </View>
            </View>
            <Ionicons
              name={showAllList ? "chevron-up" : "chevron-down"}
              size={RF(20)}
              color={Colors.darkBrown}
            />
          </TouchableOpacity>

          {/* Collapsible List of all 15 Upayas */}
          {showAllList && (
            <View style={styles.upayasAccordionList}>
              {activeRashi.upayas.map((item, index) => {
                const isExpanded = expandedUpayaId === item.id;
                const isCurrentToday = item.id === todayUpaya.id;
                return (
                  <View
                    key={item.id}
                    style={[
                      styles.upayaCard,
                      isCurrentToday && styles.upayaCardTodayHighlight,
                    ]}
                  >
                    <TouchableOpacity
                      activeOpacity={0.85}
                      onPress={() =>
                        setExpandedUpayaId(isExpanded ? null : item.id)
                      }
                      style={styles.upayaCardHeader}
                    >
                      <View style={styles.upayaNumberCircle}>
                        <Text style={styles.upayaNumberText}>{index + 1}</Text>
                      </View>
                      <View style={styles.upayaHeaderInfo}>
                        <View style={styles.cardBadgeRow}>
                          <View style={styles.catBadge}>
                            <Text style={styles.catBadgeText}>
                              {item.category}
                            </Text>
                          </View>
                          {isCurrentToday && (
                            <View style={styles.todayPill}>
                              <Text style={styles.todayPillText}>TODAY</Text>
                            </View>
                          )}
                        </View>
                        <Text style={styles.upayaCardTitle}>{item.title}</Text>
                        <Text style={styles.upayaCardTarget} numberOfLines={1}>
                          🎯 {item.target}
                        </Text>
                      </View>
                      <Ionicons
                        name={isExpanded ? "chevron-up" : "chevron-down"}
                        size={RF(18)}
                        color={Colors.darkBrown}
                      />
                    </TouchableOpacity>

                    {isExpanded && (
                      <View style={styles.expandedBody}>
                        <View style={styles.divider} />
                        <View style={styles.expandedMetaRow}>
                          <Text style={styles.subTitleText}>
                            ⏰ Best Time:{" "}
                            <Text style={styles.subTitleVal}>
                              {item.bestTime}
                            </Text>
                          </Text>
                          <Text style={styles.subTitleText}>
                            🧭 Disha:{" "}
                            <Text style={styles.subTitleVal}>
                              {item.direction}
                            </Text>
                          </Text>
                        </View>

                        <Text
                          style={[styles.subTitleText, { marginTop: hp(0.8) }]}
                        >
                          🪔 Key Vidhi:
                        </Text>
                        {item.vidhi.map((v, i) => (
                          <Text key={i} style={styles.bulletStep}>
                            • {v}
                          </Text>
                        ))}

                        {item.mantra && (
                          <View style={styles.smallMantraBox}>
                            <Text style={styles.smallMantraText}>
                              {item.mantra}
                            </Text>
                          </View>
                        )}

                        <View style={styles.smallBenefitBox}>
                          <Text style={styles.smallBenefitText}>
                            ✨ {item.benefit}
                          </Text>
                        </View>

                        <TouchableOpacity
                          activeOpacity={0.8}
                          style={styles.miniShareBtn}
                          onPress={() => handleShare(item, activeRashi)}
                        >
                          <Ionicons
                            name="share-social-outline"
                            size={RF(14)}
                            color={Colors.primary}
                          />
                          <Text style={styles.miniShareText}>Share Remedy</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                );
              })}
            </View>
          )}
        </View>

        {/* Astrologer Consultation CTA */}
        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.ctaCard}
          onPress={() => router.push("/(tabs)/consult")}
        >
          <LinearGradient
            colors={["#3A2317", "#5D3A29"]}
            style={styles.ctaGradient}
          >
            <View style={styles.ctaTextWrap}>
              <Text style={styles.ctaTitle}>
                Need Customized Kundli Remedies?
              </Text>
              <Text style={styles.ctaSubtitle}>
                Get personalized gemstone, mantra & puja guidance from verified
                Vedic Astrologers
              </Text>
            </View>
            <View style={styles.ctaButton}>
              <Text style={styles.ctaButtonText}>Talk Now</Text>
              <Ionicons
                name="call-outline"
                size={RF(14)}
                color={Colors.white}
              />
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF8F4",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: wp(4),
    paddingVertical: hp(1.5),
    backgroundColor: "#FFF8F4",
    borderBottomWidth: 1,
    borderBottomColor: "#F5E9E0",
  },
  backBtn: {
    padding: wp(2),
    borderRadius: wp(2),
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: "#F0E4DC",
  },
  headerTitleWrap: {
    flex: 1,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: RF(17),
    fontWeight: "800",
    color: Colors.darkBrown,
  },
  headerSubtitle: {
    fontSize: RF(10.5),
    color: Colors.textGray,
    marginTop: 2,
  },
  rightIcon: {
    padding: wp(2),
    borderRadius: wp(2),
    backgroundColor: "#FFF0E2",
  },
  scrollContent: {
    paddingBottom: hp(4),
  },
  topBanner: {
    marginHorizontal: wp(4),
    marginTop: hp(1.8),
    borderRadius: wp(4),
    padding: wp(4.5),
    shadowColor: Colors.primary,
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  bannerBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    paddingHorizontal: wp(2.5),
    paddingVertical: hp(0.4),
    borderRadius: wp(2),
    gap: wp(1),
  },
  bannerBadgeText: {
    fontSize: RF(10),
    color: Colors.white,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  bannerDate: {
    fontSize: RF(17),
    fontWeight: "800",
    color: Colors.white,
    marginTop: hp(1),
  },
  bannerSubtitle: {
    fontSize: RF(11.5),
    color: "#FFF2E5",
    marginTop: hp(0.5),
    lineHeight: RF(16),
  },
  rashiSection: {
    marginTop: hp(2.2),
  },
  rashiSectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: wp(4),
    marginBottom: hp(1),
  },
  sectionTitle: {
    fontSize: RF(14),
    fontWeight: "800",
    color: Colors.darkBrown,
  },
  sectionSubBadge: {
    fontSize: RF(10.5),
    fontWeight: "700",
    color: Colors.primary,
    backgroundColor: "#FFF0E2",
    paddingHorizontal: wp(2),
    paddingVertical: hp(0.2),
    borderRadius: wp(1),
  },
  rashiScroll: {
    paddingHorizontal: wp(4),
    gap: wp(2.5),
    paddingVertical: hp(0.5),
  },
  rashiCard: {
    width: wp(22),
    borderRadius: wp(3.5),
    borderWidth: 1.5,
    borderColor: "#EFE2D8",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  rashiCardActive: {
    borderColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  rashiGradient: {
    alignItems: "center",
    paddingVertical: hp(1.4),
    paddingHorizontal: wp(1),
  },
  rashiSymbolCircle: {
    width: wp(9.5),
    height: wp(9.5),
    borderRadius: wp(4.75),
    backgroundColor: "#FFF0E2",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: hp(0.6),
  },
  rashiSymbolCircleActive: {
    backgroundColor: "rgba(255, 255, 255, 0.25)",
  },
  rashiSymbolText: {
    fontSize: RF(18),
    color: Colors.primary,
  },
  rashiSymbolTextActive: {
    color: Colors.white,
  },
  rashiHindiName: {
    fontSize: RF(13),
    fontWeight: "800",
    color: Colors.darkBrown,
  },
  rashiHindiNameActive: {
    color: Colors.white,
  },
  rashiEngName: {
    fontSize: RF(10.5),
    fontWeight: "600",
    color: Colors.textGray,
    marginTop: 1,
  },
  rashiEngNameActive: {
    color: "#FFF2E5",
  },
  rashiInfoStrip: {
    paddingHorizontal: wp(4),
    marginTop: hp(1.2),
  },
  rashiBadgeRow: {
    flexDirection: "row",
    gap: wp(2),
  },
  infoPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF2E5",
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.5),
    borderRadius: wp(2),
    gap: wp(1.2),
  },
  infoPillText: {
    fontSize: RF(11),
    fontWeight: "700",
    color: Colors.darkBrown,
  },
  featuredCard: {
    backgroundColor: Colors.white,
    marginHorizontal: wp(4),
    marginTop: hp(1.8),
    borderRadius: wp(4),
    padding: wp(4.5),
    borderWidth: 1,
    borderColor: "#F0E4DC",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  featuredHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: hp(1.2),
  },
  featuredTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF2E5",
    paddingHorizontal: wp(2.5),
    paddingVertical: hp(0.4),
    borderRadius: wp(1.5),
    gap: wp(1),
  },
  featuredTagText: {
    fontSize: RF(10),
    fontWeight: "800",
    color: Colors.primary,
  },
  deityTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FBE9E7",
    paddingHorizontal: wp(2.5),
    paddingVertical: hp(0.4),
    borderRadius: wp(1.5),
    gap: wp(1),
  },
  deityTagText: {
    fontSize: RF(10.5),
    fontWeight: "700",
    color: "#D84315",
  },
  featuredTitle: {
    fontSize: RF(17),
    fontWeight: "800",
    color: Colors.darkBrown,
    lineHeight: RF(23),
  },
  targetBox: {
    marginTop: hp(0.8),
    backgroundColor: "#F1F8E9",
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.7),
    borderRadius: wp(2),
  },
  targetLabel: {
    fontSize: RF(11),
    fontWeight: "800",
    color: "#2E7D32",
  },
  targetText: {
    fontSize: RF(12),
    color: "#33691E",
    fontWeight: "600",
    marginTop: 2,
    lineHeight: RF(16),
  },
  gridContainer: {
    flexDirection: "row",
    gap: wp(2.5),
    marginTop: hp(1.5),
  },
  gridBox: {
    flex: 1,
    backgroundColor: "#FFF8F2",
    borderRadius: wp(2.5),
    padding: wp(2.8),
    borderWidth: 1,
    borderColor: "#F5E6DA",
  },
  gridIconWrap: {
    marginBottom: hp(0.3),
  },
  gridLabel: {
    fontSize: RF(10),
    color: Colors.textGray,
    fontWeight: "600",
  },
  gridValue: {
    fontSize: RF(11.5),
    fontWeight: "700",
    color: Colors.darkBrown,
    marginTop: 2,
  },
  benefitBox: {
    flexDirection: "row",
    backgroundColor: "#E3F2FD",
    borderRadius: wp(3),
    padding: wp(3.2),
    marginTop: hp(1.6),
    alignItems: "flex-start",
    gap: wp(2.5),
  },
  benefitTextWrap: {
    flex: 1,
  },
  benefitHeading: {
    fontSize: RF(11),
    fontWeight: "800",
    color: "#1565C0",
  },
  benefitText: {
    fontSize: RF(11.8),
    color: "#0D47A1",
    fontWeight: "600",
    marginTop: 2,
    lineHeight: RF(16),
  },
  itemsWrap: {
    marginTop: hp(1.8),
  },
  sectionHeading: {
    fontSize: RF(12.5),
    fontWeight: "800",
    color: Colors.darkBrown,
    marginBottom: hp(0.6),
  },
  itemPills: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: wp(1.5),
  },
  itemPill: {
    backgroundColor: "#F5F5F5",
    paddingHorizontal: wp(2.5),
    paddingVertical: hp(0.4),
    borderRadius: wp(1.5),
    borderWidth: 1,
    borderColor: "#E8E8E8",
  },
  itemPillText: {
    fontSize: RF(11),
    color: "#444",
    fontWeight: "600",
  },
  vidhiWrap: {
    marginTop: hp(1.8),
  },
  stepRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: hp(0.9),
    gap: wp(2),
  },
  stepNumber: {
    width: wp(5.5),
    height: wp(5.5),
    borderRadius: wp(2.75),
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 2,
  },
  stepNumberText: {
    fontSize: RF(10.5),
    fontWeight: "800",
    color: Colors.white,
  },
  stepText: {
    flex: 1,
    fontSize: RF(12),
    color: "#444",
    lineHeight: RF(17),
  },
  mantraBox: {
    backgroundColor: "#FFF3E0",
    borderRadius: wp(3),
    padding: wp(3.5),
    marginTop: hp(1.8),
    borderWidth: 1,
    borderColor: "#FFE0B2",
  },
  mantraHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(1.5),
    marginBottom: hp(0.5),
  },
  mantraTitle: {
    fontSize: RF(11.5),
    fontWeight: "800",
    color: Colors.primary,
  },
  mantraText: {
    fontSize: RF(13.5),
    fontWeight: "800",
    color: "#5D4037",
    lineHeight: RF(21),
    textAlign: "center",
  },
  affirmationBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FBE9E7",
    padding: wp(3),
    borderRadius: wp(2.5),
    marginTop: hp(1.5),
    gap: wp(2),
  },
  affirmationTitle: {
    fontSize: RF(10.5),
    fontWeight: "800",
    color: "#D84315",
  },
  affirmationText: {
    fontSize: RF(11.5),
    fontStyle: "italic",
    fontWeight: "700",
    color: "#BF360C",
    marginTop: 2,
  },
  guidelinesRow: {
    flexDirection: "row",
    marginTop: hp(1.6),
    gap: wp(2.5),
  },
  dosBox: {
    flex: 1,
    backgroundColor: "#E8F5E9",
    borderRadius: wp(2),
    padding: wp(2.5),
  },
  dosTitle: {
    fontSize: RF(11),
    fontWeight: "800",
    color: "#2E7D32",
    marginBottom: 2,
  },
  dontsBox: {
    flex: 1,
    backgroundColor: "#FFEBEE",
    borderRadius: wp(2),
    padding: wp(2.5),
  },
  dontsTitle: {
    fontSize: RF(11),
    fontWeight: "800",
    color: "#C62828",
    marginBottom: 2,
  },
  guidelineText: {
    fontSize: RF(10.5),
    color: "#555",
    lineHeight: RF(14),
  },
  shareUpayaBtn: {
    marginTop: hp(2.2),
    borderRadius: wp(3),
    overflow: "hidden",
  },
  shareGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: hp(1.3),
    gap: wp(2),
  },
  shareUpayaText: {
    fontSize: RF(12.5),
    fontWeight: "700",
    color: Colors.white,
  },
  allRemediesSection: {
    marginHorizontal: wp(4),
    marginTop: hp(2.5),
  },
  allRemediesHeaderBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.white,
    padding: wp(4),
    borderRadius: wp(3.5),
    borderWidth: 1,
    borderColor: "#F0E4DC",
  },
  allRemediesHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(2.5),
    flex: 1,
  },
  allRemediesTitle: {
    fontSize: RF(13),
    fontWeight: "800",
    color: Colors.darkBrown,
  },
  allRemediesSub: {
    fontSize: RF(10.5),
    color: Colors.textGray,
    marginTop: 2,
  },
  upayasAccordionList: {
    marginTop: hp(1.5),
  },
  upayaCard: {
    backgroundColor: Colors.white,
    borderRadius: wp(3),
    marginBottom: hp(1.2),
    padding: wp(3.5),
    borderWidth: 1,
    borderColor: "#F0E4DC",
  },
  upayaCardTodayHighlight: {
    borderColor: Colors.primary,
    backgroundColor: "#FFFCF9",
  },
  upayaCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  upayaNumberCircle: {
    width: wp(8),
    height: wp(8),
    borderRadius: wp(4),
    backgroundColor: "#FFF0E2",
    justifyContent: "center",
    alignItems: "center",
    marginRight: wp(3),
  },
  upayaNumberText: {
    fontSize: RF(12),
    fontWeight: "800",
    color: Colors.primary,
  },
  upayaHeaderInfo: {
    flex: 1,
  },
  cardBadgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(1.5),
    marginBottom: 2,
  },
  catBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#F0F0F0",
    paddingHorizontal: wp(2),
    paddingVertical: hp(0.2),
    borderRadius: wp(1),
  },
  catBadgeText: {
    fontSize: RF(9.5),
    fontWeight: "700",
    color: Colors.textGray,
  },
  todayPill: {
    backgroundColor: "#FF8A00",
    paddingHorizontal: wp(1.8),
    paddingVertical: hp(0.2),
    borderRadius: wp(1),
  },
  todayPillText: {
    fontSize: RF(9),
    fontWeight: "800",
    color: Colors.white,
  },
  upayaCardTitle: {
    fontSize: RF(13),
    fontWeight: "700",
    color: Colors.darkBrown,
  },
  upayaCardTarget: {
    fontSize: RF(11),
    color: "#666",
    marginTop: 2,
  },
  expandedBody: {
    marginTop: hp(1),
  },
  divider: {
    height: 1,
    backgroundColor: "#F2E8E0",
    marginBottom: hp(1),
  },
  expandedMetaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: hp(0.5),
  },
  subTitleText: {
    fontSize: RF(11.5),
    fontWeight: "700",
    color: Colors.darkBrown,
    marginTop: 2,
  },
  subTitleVal: {
    fontWeight: "500",
    color: "#555",
  },
  bulletStep: {
    fontSize: RF(11.5),
    color: "#555",
    marginLeft: wp(2),
    marginTop: 2,
    lineHeight: RF(16),
  },
  smallMantraBox: {
    backgroundColor: "#FFF8E7",
    padding: wp(2.5),
    borderRadius: wp(2),
    marginTop: hp(1),
  },
  smallMantraText: {
    fontSize: RF(11.5),
    fontWeight: "700",
    color: "#795548",
    textAlign: "center",
  },
  smallBenefitBox: {
    backgroundColor: "#E8F5E9",
    padding: wp(2),
    borderRadius: wp(2),
    marginTop: hp(0.8),
  },
  smallBenefitText: {
    fontSize: RF(11),
    color: "#2E7D32",
    fontWeight: "600",
  },
  miniShareBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: hp(1),
    paddingVertical: hp(0.6),
    gap: wp(1.5),
  },
  miniShareText: {
    fontSize: RF(11.5),
    fontWeight: "700",
    color: Colors.primary,
  },
  ctaCard: {
    marginHorizontal: wp(4),
    marginTop: hp(2.5),
    borderRadius: wp(4),
    overflow: "hidden",
  },
  ctaGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: wp(4),
  },
  ctaTextWrap: {
    flex: 1,
    paddingRight: wp(2),
  },
  ctaTitle: {
    fontSize: RF(14),
    fontWeight: "800",
    color: Colors.white,
  },
  ctaSubtitle: {
    fontSize: RF(11),
    color: "#E2D0C6",
    marginTop: 2,
    lineHeight: RF(15),
  },
  ctaButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.primary,
    paddingVertical: hp(1),
    paddingHorizontal: wp(3.5),
    borderRadius: wp(3),
    gap: wp(1),
  },
  ctaButtonText: {
    fontSize: RF(12),
    fontWeight: "800",
    color: Colors.white,
  },
});
