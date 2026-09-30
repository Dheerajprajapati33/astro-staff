import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";
import ACTab from "../../components/kundli/ACTab";
import BasicTab from "../../components/kundli/BasicTab";
import ChartsTab from "../../components/kundli/ChartsTab";
import DashaTab from "../../components/kundli/DashaTab";
import KPTab from "../../components/kundli/KPTab";
// import ReportTab from "../../components/kundli/ReportTab";
import { hp, RF, wp } from "../../utils/responsive";

const tabs = ["Basic", "Charts", "Dasha Charts", "KP Kundli", "AC Scores"];
const KundliScreen = ({
  data: suppliedData,
  onClose,
  availableWidth,
}) => {
  const [activeTab, setActiveTab] = useState("Basic");
  const params = useLocalSearchParams();
  const embeddedChartSize = availableWidth
    ? Math.max(200, availableWidth - wp(10))
    : undefined;

  const kundliData = useMemo(() => {
    const routeData = Array.isArray(params?.data)
      ? params.data[0]
      : params?.data;
    const sourceData = suppliedData ?? routeData;

    if (!sourceData) return null;
    try {
      return typeof sourceData === "string"
        ? JSON.parse(sourceData)
        : sourceData;
    } catch (e) {
      console.log("Error parsing kundli data param:", e);
      return null;
    }
  }, [params?.data, suppliedData]);

  const renderTab = () => {
    switch (activeTab) {
      case "Basic":
        return (
          <BasicTab
            data={kundliData?.basic || kundliData}
            fullData={kundliData}
          />
        );
      case "Charts":
        return (
          <ChartsTab
            data={kundliData?.charts || kundliData}
            fullData={kundliData}
            chartSize={embeddedChartSize}
          />
        );
      case "KP Kundli":
        return (
          <KPTab data={kundliData?.kp || kundliData} fullData={kundliData} />
        );
      case "AC Scores":
        return (
          <ACTab
            data={kundliData?.ashtakvarga || kundliData?.ac || kundliData}
            fullData={kundliData}
            chartSize={embeddedChartSize}
          />
        );
      case "Dasha Charts":
        return (
          <DashaTab
            data={kundliData?.dasha || kundliData}
            fullData={kundliData}
          />
        );
      // case "Kundali Report":
      //   return (
      //     <ReportTab
      //       data={kundliData?.doshas || kundliData?.report || kundliData}
      //       fullData={kundliData}
      //     />
      //   );
      default:
        return (
          <BasicTab
            data={kundliData?.basic || kundliData}
            fullData={kundliData}
          />
        );
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose || (() => router.back())}>
          <Ionicons name="arrow-back" size={RF(22)} color="#ff5a00" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Kundli</Text>

        <View style={{ width: RF(22) }} />
      </View>

      <View style={styles.tabWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabContent}
        >
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
                numberOfLines={2}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
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
  tabContent: {
    flexDirection: "row",
  },
  tabBtn: {
    width: wp(24),
    minWidth: 78,
    height: hp(6.5),
    alignItems: "center",
    justifyContent: "center",
    borderRightWidth: 1,
    borderRightColor: "#ff5a00",
  },
  activeTabBtn: {
    backgroundColor: "#ff5a00",
  },
  tabText: {
    fontSize: RF(13),
    color: "#111",
    fontWeight: "600",
    textAlign: "center",
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
