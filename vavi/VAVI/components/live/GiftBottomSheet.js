import React from "react";
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import GiftData from "../../constants/GiftData";
import Colors from "../../constants/Colors";
import { hp, RF, wp } from "../../utils/responsive";

const ORANGE = "#ff6a00";

export default function GiftBottomSheet({
  visible,
  onClose,
  onSendGift,
  userBalance = 1000,
}) {
  const insets = useSafeAreaInsets();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.backdrop}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity
          activeOpacity={1}
          style={[styles.sheet, { paddingBottom: insets.bottom + hp(2) }]}
        >
          <View style={styles.drag} />

          <View style={styles.header}>
            <View>
              <View style={styles.titleRow}>
                <Ionicons name="gift" size={RF(18)} color={ORANGE} />
                <Text style={styles.title}>Send a Gift</Text>
              </View>
              <Text style={styles.sub}>Support your astrologer during live</Text>
            </View>

            <View style={styles.rightRow}>
              <View style={styles.coinBox}>
                <Text style={styles.coin}>🪙</Text>
                <Text style={styles.coinText}>{userBalance}</Text>
              </View>

              <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                <Ionicons name="close" size={RF(20)} color="#777" />
              </TouchableOpacity>
            </View>
          </View>

          <FlatList
            data={GiftData}
            keyExtractor={(item) => item.id.toString()}
            numColumns={4}
            scrollEnabled={false}
            columnWrapperStyle={styles.row}
            renderItem={({ item }) => (
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.giftCard}
                onPress={() => onSendGift(item)}
              >
                <Text style={styles.emoji}>{item.emoji}</Text>
                <Text numberOfLines={1} style={styles.giftName}>
                  {item.name}
                </Text>

                <View style={styles.coinRow}>
                  <Text style={styles.smallCoin}>🪙</Text>
                  <Text style={styles.giftCoin}>{item.coins}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: wp(6),
    borderTopRightRadius: wp(6),
    paddingHorizontal: wp(4),
    paddingTop: hp(1.2),
  },
  drag: {
    width: wp(12),
    height: hp(0.5),
    borderRadius: wp(2),
    backgroundColor: "#ddd",
    alignSelf: "center",
    marginBottom: hp(1.2),
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: hp(1.8),
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(1.5),
  },
  title: {
    color: ORANGE,
    fontSize: RF(15),
    fontWeight: "800",
  },
  sub: {
    color: "#888",
    fontSize: RF(11),
    marginTop: hp(0.2),
  },
  rightRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(2),
  },
  coinBox: {
    backgroundColor: "#fff7e8",
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.5),
    borderRadius: wp(4),
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ffe0b2",
  },
  coin: {
    fontSize: RF(12),
  },
  coinText: {
    fontSize: RF(11.5),
    color: "#333",
    marginLeft: wp(1),
    fontWeight: "800",
  },
  closeBtn: {
    padding: wp(1),
  },
  row: {
    justifyContent: "space-between",
  },
  giftCard: {
    width: wp(21),
    height: hp(10),
    borderWidth: 1,
    borderColor: "#f0e6dc",
    borderRadius: wp(3.5),
    alignItems: "center",
    justifyContent: "center",
    marginBottom: hp(1.2),
    backgroundColor: "#fafafa",
  },
  emoji: {
    fontSize: RF(24),
  },
  giftName: {
    fontSize: RF(10),
    color: "#333",
    marginTop: hp(0.4),
    fontWeight: "600",
  },
  coinRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: hp(0.3),
  },
  smallCoin: {
    fontSize: RF(9),
  },
  giftCoin: {
    fontSize: RF(10),
    color: "#e65100",
    marginLeft: wp(0.5),
    fontWeight: "700",
  },
});
