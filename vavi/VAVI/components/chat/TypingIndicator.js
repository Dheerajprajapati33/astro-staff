import { StyleSheet, Text } from "react-native";

import Colors from "../../constants/Colors";
import { hp, RF, wp } from "../../utils/responsive";

export default function TypingIndicator({ visible, name }) {
  if (!visible) {
    return null;
  }

  return (
    <Text style={styles.text}>{name || "Astrologer"} is typing...</Text>
  );
}

const styles = StyleSheet.create({
  text: {
    alignSelf: "flex-start",
    marginHorizontal: wp(4),
    color: Colors.textGray,
    fontSize: RF(12),
    fontStyle: "italic",
    marginTop: hp(0.5),
    fontWeight: "700",
  },
});
