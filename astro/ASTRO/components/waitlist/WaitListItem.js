import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Typography from "../../constants/Typography";
import { hp, RF, wp } from "../../utils/responsive";

const ORANGE = "#ff6a00";
const GREEN = "#16a34a";

export default function WaitListItem({ item }) {
  return (
    <TouchableOpacity activeOpacity={0.85} style={styles.card}>
      <View style={[styles.avatar, { backgroundColor: item.bg }]}>
        <Text style={[styles.avatarText, { color: item.color }]}>
          {item.initials}
        </Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.name}>{item.name}</Text>

        <View style={styles.row}>
          <Ionicons name="location-outline" size={RF(12)} color={GREEN} />
          <Text style={styles.smallText}>{item.city}</Text>
        </View>

        <View style={styles.row}>
          <Ionicons name="time-outline" size={RF(12)} color={GREEN} />
          <Text style={styles.smallText}>Requested: {item.time}</Text>
        </View>

        <Text style={styles.reason} numberOfLines={1} ellipsizeMode="tail">
          Reason: <Text style={styles.reasonValue}>{item.reason}</Text>
        </Text>
      </View>

      <TouchableOpacity style={styles.notifyBtn}>
        <Ionicons name="notifications-outline" size={RF(15)} color={GREEN} />
        <Text style={styles.notifyText}>Notify</Text>
      </TouchableOpacity>

      {/* <Ionicons name="chevron-forward" size={RF(18)} color="#9ca3af" /> */}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: hp(12),
    backgroundColor: "#fff",
    borderWidth: 1,
    marginHorizontal: wp(4),
    borderColor: "#f0f0f0",
    borderRadius: wp(4),
    padding: wp(2.5),
    marginBottom: hp(1.4),
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  avatar: {
    width: wp(14),
    height: wp(14),
    borderRadius: wp(7),
    alignItems: "center",
    justifyContent: "center",
    marginRight: wp(3),
  },
  avatarText: {
    fontSize: RF(25.5),
    fontWeight: "900",
    fontFamily: Typography?.bold,
  },
  content: {
    flex: 1,
  },
  name: {
    fontSize: RF(16),
    color: "#1f2937",
    fontWeight: "900",
    marginBottom: hp(0.6),
    fontFamily: Typography?.bold,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hp(0.4),
  },
  smallText: {
    fontSize: RF(14),
    color: "#374151",
    marginLeft: wp(1),
    fontWeight: "700",
    fontFamily: Typography?.bold,
  },
  reason: {
    marginTop: hp(0.3),
    fontSize: RF(14),
    color: "#1f2937",
    fontWeight: "700",
    fontFamily: Typography?.bold,
  },
  reasonValue: {
    color: ORANGE,
    fontWeight: "900",
    fontFamily: Typography?.bold,
  },
  notifyBtn: {
    height: hp(4.8),
    paddingHorizontal: wp(2.0),
    borderWidth: 1,
    borderColor: GREEN,
    borderRadius: wp(2),
    flexDirection: "row",
    alignItems: "center",
    marginRight: wp(2),
  },
  notifyText: {
    marginLeft: wp(1),
    color: GREEN,
    fontSize: RF(16),
    fontWeight: "900",
    fontFamily: Typography?.bold,
  },
});
