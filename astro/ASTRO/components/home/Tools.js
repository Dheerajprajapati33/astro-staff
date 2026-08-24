import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import Typography from "../../constants/Typography";
import { hp, RF, wp } from "../../utils/responsive";

const tools = [
  {
    title: "Call History",
    icon: "call-outline",
    type: "ion",
    route: "/callhistory",
  },
  {
    title: "Chat History",
    icon: "chatbubble-ellipses-outline",
    type: "ion",
    route: "/chathistory",
  },

  { title: "Go Live", icon: "radio-outline", type: "ion", route: "/golive" },
  { title: "Wallet", icon: "wallet-outline", type: "ion", route: "/wallet" },

  {
    title: "Waitlist",
    icon: "person-add-outline",
    type: "ion",
    route: "/waitlist",
  },
  {
    title: "Warnings",
    icon: "warning-outline",
    type: "ion",
    route: "/warnings",
  },
  {
    title: "Manage Profile",
    icon: "account-outline",
    type: "mci",
    route: "/manageprofile",
  },
  {
    title: "My Followers",
    icon: "account-group-outline",
    type: "mci",
    route: "/followers",
  },
  { title: "My Reviews", icon: "star-outline", type: "ion", route: "/reviews" },
  { title: "Gallery", icon: "image-outline", type: "ion", route: "/gallery" },
  { title: "Offers", icon: "pricetag-outline", type: "ion", route: "/offers" },
  {
    title: "Settings",
    icon: "settings-outline",
    type: "ion",
    route: "/settings",
  },
];

const Tools = () => {
  console.log("TOOLS DONE");
  const handleRoute = (item) => {
    router.push(item.route);
  };

  return (
    <View style={styles.grid}>
      {tools.map((item) => (
        <TouchableOpacity
          key={item.title}
          style={styles.toolCard}
          activeOpacity={0.85}
          onPress={() => handleRoute(item)}
        >
          <View style={styles.arrowBox}>
          </View>

          <View style={styles.iconBox}>
            {item.type === "ion" ? (
              <Ionicons name={item.icon} size={RF(22)} color="#ff6a00" />
            ) : (
              <MaterialCommunityIcons
                name={item.icon}
                size={RF(22)}
                color="#ff6a00"
              />
            )}
          </View>

          <Text style={styles.toolText}>{item.title}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default Tools;

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  toolCard: {
    width: wp(28),
    height: hp(12),
    borderWidth: 1,
    borderColor: "#f1e8df",
    borderRadius: wp(3),
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: hp(1.4),
    position: "relative",
  },
  arrowBox: {
    position: "absolute",
    top: hp(1),
    right: wp(2),
  },
  iconBox: {
    width: wp(9),
    height: wp(9),
    borderRadius: wp(4.5),
    backgroundColor: "#fff4ec",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: hp(0.8),
  },
  toolText: {
    fontSize: RF(16),
    color: "#333",
    fontWeight: "700",
    textAlign: "center",
    fontFamily: Typography?.bold,
  },
});
