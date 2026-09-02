import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";
import ACTab from "../../components/kundli/ACTab";
import BasicTab from "../../components/kundli/BasicTab";
import ChartsTab from "../../components/kundli/ChartsTab";
import DashaTab from "../../components/kundli/DashaTab";
import KPTab from "../../components/kundli/KPTab";
import ReportTab from "../../components/kundli/ReportTab";import { hp, RF, wp } from "../../utils/responsive";

const tabs = ["Basic", "Charts", "KP", "AC", "Dasha", "Report"];

const KundliScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState("Basic");

  const renderTab = () => {
    switch (activeTab) {
      case "Basic":
        return <BasicTab />;
      case "Charts":
        return <ChartsTab />;
      case "KP":
        return <KPTab />;
      case "AC":
        return <ACTab />;
      case "Dasha":
        return <DashaTab />;
      case "Report":
        return <ReportTab />;
      default:
        return <BasicTab />;
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={RF(22)} color="#ff5a00" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Kundli</Text>

        <View style={{ width: RF(22) }} />
      </View>

      <View style={styles.tabWrapper}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab}
            activeOpacity={0.8}
            onPress={() => setActiveTab(tab)}
            style={[styles.tabBtn, activeTab === tab && styles.activeTabBtn]}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.activeTabText,
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {renderTab()}
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default KundliScreen;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#fff",
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
  tabWrapper: {
    flexDirection: "row",
    marginHorizontal: wp(5),
    borderWidth: 1,
    borderColor: "#ff5a00",
    borderRadius: wp(2),
    overflow: "hidden",
    marginTop: hp(1),
  },
  tabBtn: {
    flex: 1,
    height: hp(4.5),
    alignItems: "center",
    justifyContent: "center",
    borderRightWidth: 1,
    borderRightColor: "#ff5a00",
  },
  activeTabBtn: {
    backgroundColor: "#ff5a00",
  },
  tabText: {
    fontSize: RF(10),
    color: "#111",
    fontWeight: "600",
  },
  activeTabText: {
    color: "#fff",
  },
  scrollContent: {
    paddingHorizontal: wp(5),
    paddingTop: hp(2),
    paddingBottom: hp(3),
  },
});
