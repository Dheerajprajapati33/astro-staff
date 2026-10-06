import { Ionicons } from "@expo/vector-icons";
import {
  Image,
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

export default function ChatImagePreviewModal({ imageUri, onClose }) {
  return (
    <Modal
      visible={!!imageUri}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Close image preview"
        >
          <Ionicons name="close" size={28} color="#fff" />
        </TouchableOpacity>
        {imageUri ? (
          <Image
            source={{ uri: imageUri }}
            style={styles.image}
            resizeMode="contain"
          />
        ) : null}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.96)",
    alignItems: "center",
    justifyContent: "center",
  },
  closeButton: {
    position: "absolute",
    top: 48,
    right: 20,
    zIndex: 1,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: "100%",
    height: "82%",
  },
});
