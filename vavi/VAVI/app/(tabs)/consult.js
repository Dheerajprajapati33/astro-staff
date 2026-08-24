import { ScrollView, StyleSheet } from "react-native";

import Colors from "../../constants/Colors";

import { SafeAreaView } from "react-native-safe-area-context";
import AstroServiceGrid from "../../components/consult/AstroServiceGrid";
import BottomActionBar from "../../components/consult/BottomActionBar";
import HeroBanner from "../../components/consult/HeroBanner";
import SectionHeader from "../../components/consult/SectionHeader";
import TopAstrologerCard from "../../components/consult/TopAstrologerCard";
import TrendingGrid from "../../components/consult/TrendingGrid";
import Header from "../../components/home/Header";
import LiveAstrologersSection from "../../components/consult/LiveAstrologersSection";
import { hp } from "../../utils/responsive";

export default function Consult() {
  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Header */}

        <Header />

        {/* Search */}

        {/* <SearchBar /> */}

        {/* Banner */}

        <HeroBanner />

        {/* Live Streaming Astrologers */}
        <LiveAstrologersSection />

        {/* Astrology Services */}

        <SectionHeader title="Astrology Services" onPress={() => {}} />

        <AstroServiceGrid />

        {/* Trending */}

        <SectionHeader title="Trending Consultations" onPress={() => {}} />

        <TrendingGrid />

        {/* Top Astrologers */}

        <SectionHeader title="Top Astrologers" onPress={() => {}} />

        <TopAstrologerCard />
      </ScrollView>

      {/* Bottom Action */}

      <BottomActionBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: Colors.background || "#FFF8F4",
  },

  content: {
    paddingBottom: hp(10),
  },
});
