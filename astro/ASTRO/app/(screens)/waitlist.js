import { useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import CurrentCallCard from "../../components/waitlist/CurrentCallCard";
import Header from "../../components/waitlist/Header";
import HowItWorks from "../../components/waitlist/HowItWorks";
import WaitListItem from "../../components/waitlist/WaitListItem";
import WaitListData from "../../constants/WaitListData";

import Typography from "../../constants/Typography";
import { hp, RF, wp } from "../../utils/responsive";

const GREEN = "#16a34a";

export default function Waitlist() {
  const [showInfo, setShowInfo] = useState(false);

  return (
    <SafeAreaView style={styles.safe} edges={[]}>
      <Header onHelpPress={() => setShowInfo((prev) => !prev)} />

      {showInfo && <HowItWorks />}

      <FlatList
        data={WaitListData}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <>
            <CurrentCallCard />

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Waitlist</Text>

              {/* <TouchableOpacity>
                <Ionicons name="options-outline" size={RF(22)} color={GREEN} />
              </TouchableOpacity> */}
            </View>
          </>
        }
        renderItem={({ item }) => <WaitListItem item={item} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#fff",
  },
  list: {
    paddingBottom: hp(2),
  },
  sectionHeader: {
    paddingHorizontal: wp(4),
    marginTop: hp(2),
    marginBottom: hp(1.2),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionTitle: {
    fontSize: RF(16),
    color: "#111827",
    fontWeight: "900",
    fontFamily: Typography?.bold,
    left: 4,
  },
});
