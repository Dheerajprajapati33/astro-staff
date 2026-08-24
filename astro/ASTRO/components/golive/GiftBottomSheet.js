// import { Ionicons } from "@expo/vector-icons";
// import {
//   FlatList,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import { useSafeAreaInsets } from "react-native-safe-area-context";

// import GiftData from "../../constants/GiftData";
// import Typography from "../../constants/Typography";
// import { hp, RF, wp } from "../../utils/responsive";

// const ORANGE = "#ff6a00";

// export default function GiftBottomSheet({ onClose }) {
//   const insets = useSafeAreaInsets();

//   return (
//     <View style={[styles.sheet, { paddingBottom: insets.bottom + hp(2.5) }]}>
//       <View style={styles.drag} />

//       <View style={styles.header}>
//         <View>
//           <View style={styles.titleRow}>
//             <Ionicons name="gift" size={RF(18)} color={ORANGE} />
//             <Text style={styles.title}>Send a Gift</Text>
//           </View>
//           <Text style={styles.sub}>Show your appreciation and support</Text>
//         </View>

//         <View style={styles.rightRow}>
//           <View style={styles.coinBox}>
//             <Text style={styles.coin}>🪙</Text>
//             <Text style={styles.coinText}>1250</Text>
//           </View>

//           <TouchableOpacity onPress={onClose}>
//             <Ionicons name="close" size={RF(21)} color="#777" />
//           </TouchableOpacity>
//         </View>
//       </View>

//       <FlatList
//         data={GiftData}
//         keyExtractor={(item) => item.id.toString()}
//         numColumns={4}
//         scrollEnabled={false}
//         columnWrapperStyle={styles.row}
//         renderItem={({ item }) => (
//           <TouchableOpacity activeOpacity={0.85} style={styles.giftCard}>
//             <Text style={styles.emoji}>{item.emoji}</Text>
//             <Text numberOfLines={1} style={styles.giftName}>
//               {item.name}
//             </Text>

//             <View style={styles.coinRow}>
//               <Text style={styles.smallCoin}>🪙</Text>
//               <Text style={styles.giftCoin}>{item.coins}</Text>
//             </View>
//           </TouchableOpacity>
//         )}
//       />

//       <View style={styles.footer}>
//         <Text style={styles.balance}>
//           Your Balance: <Text style={styles.balanceCoin}>🪙 1250</Text>
//         </Text>

//         <TouchableOpacity style={styles.rechargeBtn}>
//           <Text style={styles.rechargeText}>Recharge</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   sheet: {
//     position: "absolute",
//     left: 0,
//     right: 0,
//     bottom: 0,
//     backgroundColor: "#fff",
//     borderTopLeftRadius: wp(6),
//     borderTopRightRadius: wp(6),
//     paddingHorizontal: wp(4),
//     paddingTop: hp(0.8),
//   },
//   drag: {
//     width: wp(12),
//     height: hp(0.45),
//     borderRadius: wp(2),
//     backgroundColor: "#ddd",
//     alignSelf: "center",
//     marginBottom: hp(1),
//   },
//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: hp(1.2),
//   },
//   titleRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: wp(2),
//   },
//   title: {
//     color: ORANGE,
//     fontSize: RF(14),
//     fontWeight: "800",
//     fontFamily: Typography?.bold,
//   },
//   sub: {
//     color: "#999",
//     fontSize: RF(9),
//     marginTop: hp(0.3),
//     fontFamily: Typography?.regular,
//   },
//   rightRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: wp(2),
//   },
//   coinBox: {
//     backgroundColor: "#fff7e8",
//     paddingHorizontal: wp(2.5),
//     paddingVertical: hp(0.5),
//     borderRadius: wp(4),
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   coin: {
//     fontSize: RF(11),
//   },
//   coinText: {
//     fontSize: RF(10),
//     color: "#444",
//     marginLeft: wp(1),
//     fontWeight: "800",
//   },
//   row: {
//     justifyContent: "space-between",
//   },
//   giftCard: {
//     width: wp(21),
//     height: hp(9.4),
//     borderWidth: 1,
//     borderColor: "#f0e6dc",
//     borderRadius: wp(3),
//     alignItems: "center",
//     justifyContent: "center",
//     marginBottom: hp(1),
//     backgroundColor: "#fff",
//   },
//   emoji: {
//     fontSize: RF(24),
//   },
//   giftName: {
//     fontSize: RF(8.5),
//     color: "#333",
//     marginTop: hp(0.3),
//     fontFamily: Typography?.medium,
//   },
//   coinRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginTop: hp(0.2),
//   },
//   smallCoin: {
//     fontSize: RF(8),
//   },
//   giftCoin: {
//     fontSize: RF(8.5),
//     color: "#555",
//     marginLeft: wp(0.5),
//     fontWeight: "700",
//   },
//   footer: {
//     borderTopWidth: 1,
//     borderTopColor: "#eee",
//     paddingTop: hp(1),
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//   },
//   balance: {
//     fontSize: RF(9.5),
//     color: "#555",
//     fontFamily: Typography?.regular,
//   },
//   balanceCoin: {
//     color: "#333",
//     fontWeight: "800",
//   },
//   rechargeBtn: {
//     backgroundColor: ORANGE,
//     paddingHorizontal: wp(4.5),
//     paddingVertical: hp(0.9),
//     borderRadius: wp(2),
//   },
//   rechargeText: {
//     color: "#fff",
//     fontSize: RF(10.5),
//     fontWeight: "800",
//     fontFamily: Typography?.bold,
//   },
// });
