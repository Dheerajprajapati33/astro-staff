import React from "react";
import { RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

import Colors from "../../constants/Colors";
import { hp, RF, wp } from "../../utils/responsive";
import Header from "../../components/home/Header";
import HeroBanner from "../../components/consult/HeroBanner";
import AstroServiceGrid from "../../components/consult/AstroServiceGrid";
import TrendingGrid from "../../components/consult/TrendingGrid";
import SectionHeader from "../../components/consult/SectionHeader";
import TopAstrologerCard from "../../components/consult/TopAstrologerCard";
import BottomActionBar from "../../components/consult/BottomActionBar";
import { useGetAstrologersQuery } from "../../redux/AstroApi";

export default function Consult() {
  const { data, isLoading, isFetching, refetch } = useGetAstrologersQuery({
    page: 1,
    limit: 20,
    role: "astrologer",
  });

  const astrologers = data?.data?.users || [];

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={isFetching && !isLoading}
            onRefresh={refetch}
            colors={[Colors.primary]}
          />
        }
      >
        {/* Header */}
        <Header />

        {/* Hero Banner */}
        <HeroBanner />

        {/* Astrology Services */}
        <SectionHeader title="Astrology Services" onPress={() => {}} />
        <AstroServiceGrid />

        {/* Trending Consultations */}
        <SectionHeader title="Trending Consultations" onPress={() => {}} />
        <TrendingGrid />

        {/* Available Astrologers (Horizontal Sliding List) */}
        <SectionHeader
          title="Available Astrologers"
          onPress={() => router.push("/(tabs)")}
        />
        <TopAstrologerCard data={astrologers} />
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
    paddingBottom: hp(12),
  },
});
