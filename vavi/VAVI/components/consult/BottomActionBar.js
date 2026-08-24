import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { hp, RF, wp } from "../../utils/responsive";
import { useRouter } from "expo-router";
import { useNavigation } from "@react-navigation/native";

export default function BottomActionBar() {
  const insets = useSafeAreaInsets();
const navigation = useNavigation()

 const handleChatAstrologer = () => {
    console.log("Opening Consult tab");

    navigation.navigate("index");
  };

  const handleCallAstrologer = () => {
    console.log("Opening Consult tab");

    navigation.navigate("index");
  };

  return (
    <View
      style={[
        styles.container,
        {
          paddingBottom: hp(0.8),
        },
      ]}
    >
      {/* Chat */}

      <LinearGradient
        colors={["#FF8A00", "#FF5A00"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.chatButton}
      >
        <TouchableOpacity activeOpacity={0.85} style={styles.buttonContent} onPress={handleChatAstrologer}>
          <Ionicons
            name="chatbubble-ellipses-outline"
            size={RF(17)}
            color="#FFF"
          />

          <Text style={styles.buttonText}>Chat Astrologer</Text>
        </TouchableOpacity>
      </LinearGradient>

      {/* Call */}

      <LinearGradient
        colors={["#33C833", "#138A17"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.callButton}
      >
        <TouchableOpacity activeOpacity={0.85} style={styles.buttonContent} onPress={handleCallAstrologer}>
          <Ionicons name="call-outline" size={RF(17)} color="#FFF" />

          <Text style={styles.buttonText}>Call Astrologer</Text>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContent: {
    flex: 1,

    flexDirection: "row",

    justifyContent: "center",

    alignItems: "center",
  },
  buttonText: {
    left: 4,
    color: "#ffffff",
    fontWeight: 500,
  },

  container: {
    position: "absolute",

    left: 0,

    right: 0,

    bottom: 0,

    flexDirection: "row",

    backgroundColor: "#FFF8F4",

    paddingHorizontal: wp(4),

    paddingTop: hp(0.8),

    paddingBottom: hp(0.8),

    borderTopWidth: 0,

    elevation: 12,

    shadowColor: "#000",

    shadowOpacity: 0.05,

    shadowRadius: 8,

    shadowOffset: {
      width: 0,
      height: -2,
    },
  },

  chatButton: {
    flex: 1,

    height: hp(5.6),

    borderRadius: hp(6),

    marginRight: wp(2),

    shadowColor: "#FF6A00",

    shadowOpacity: 0.3,

    shadowRadius: 8,

    shadowOffset: {
      width: 0,
      height: 4,
    },

    elevation: 8,

    overflow: "hidden",
  },

  callButton: {
    flex: 1,

    height: hp(5.6),

    borderRadius: hp(6),

    marginLeft: wp(2),

    shadowColor: "#20A52A",

    shadowOpacity: 0.3,

    shadowRadius: 8,

    shadowOffset: {
      width: 0,
      height: 4,
    },

    elevation: 8,

    overflow: "hidden",
  },
  chatText: {
    color: "#FFFFFF",

    marginLeft: wp(2),

    fontSize: RF(13),

    fontWeight: "600",
  },

  callText: {
    color: "#FFFFFF",

    marginLeft: wp(2),

    fontSize: RF(13),

    fontWeight: "600",
  },
});
