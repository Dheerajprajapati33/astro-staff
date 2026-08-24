import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import Colors from "../../constants/Colors";import { hp, RF, wp } from "../../utils/responsive";

export default function WalletTabs() {
  const [activeTab, setActiveTab] = useState("transaction");

  return (
    <View style={styles.container}>
      {/* Wallet Transaction */}

      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => setActiveTab("transaction")}
        style={[
          styles.tab,
          activeTab === "transaction" && styles.activeTab,
        ]}
      >
        <Text
          style={[
            styles.tabText,
            activeTab === "transaction" && styles.activeTabText,
          ]}
        >
          Wallet Transaction
        </Text>
      </TouchableOpacity>

      {/* Payment Logs */}

      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => setActiveTab("payment")}
        style={[
          styles.tab,
          activeTab === "payment" && styles.activeTab,
        ]}
      >
        <Text
          style={[
            styles.tabText,
            activeTab === "payment" && styles.activeTabText,
          ]}
        >
          Payment Logs
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: wp(4),
    marginTop: hp(2),

    flexDirection: "row",

    backgroundColor: "#FFF6EE",

    borderRadius: wp(4),

    padding: wp(1),
  },

  tab: {
    flex: 1,

    height: hp(5.8),

    justifyContent: "center",
    alignItems: "center",

    borderRadius: wp(3),
  },

  activeTab: {
    backgroundColor: Colors.primary,

    elevation: 3,

    shadowColor: "#000",

    shadowOpacity: 0.1,

    shadowRadius: 4,

    shadowOffset: {
      width: 0,
      height: 2,
    },
  },

  tabText: {
    fontSize: RF(13),

    color: Colors.textGray,

    fontWeight: "500",
  },

  activeTabText: {
    color: Colors.white,

    fontWeight: "600",
  },
});