import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useEffect, useState } from "react";

import Colors from "../../constants/Colors";
import { hp, RF, wp } from "../../utils/responsive";

function ChatImage({ uri, onPress }) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [uri]);

  return failed ? (
    <Text style={styles.text}>Image unavailable</Text>
  ) : (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => onPress?.(uri)}
      accessibilityRole="imagebutton"
      accessibilityLabel="View image full screen"
    >
      <Image
        source={{ uri }}
        style={styles.image}
        resizeMode="contain"
        onError={() => setFailed(true)}
      />
    </TouchableOpacity>
  );
}

export default function MessageBubble({
  message,
  isOwnMessage,
  onRetry,
  onImagePress,
}) {
  const status = message?.status;
  const isFailed = status === "failed";
  const isImageType =
    String(message?.messageType || message?.type || "").toUpperCase() ===
    "IMAGE";
  const candidates = [
    message?.imageUrl,
    message?.image?.url,
    message?.image?.uri,
    message?.url,
    message?.content?.url,
    message?.content?.uri,
    message?.data?.url,
    message?.data?.uri,
    message?.payload?.imageUrl,
    message?.payload?.url,
    message?.message?.url,
    message?.message?.uri,
    message?.message,
    message?.content,
    message?.text,
  ];
  let imageUri = candidates.find(
    (value) =>
      typeof value === "string" &&
      /^(data:image\/|https?:\/\/|file:\/\/|content:\/\/|blob:)/i.test(value),
  );

  if (!imageUri && isImageType) {
    const base64 = candidates.find(
      (value) =>
        typeof value === "string" &&
        value.length > 256 &&
        /^[A-Za-z0-9+/]+={0,2}$/.test(value),
    );
    if (base64) {
      const mimeType = base64.startsWith("iVBORw0KGgo")
        ? "image/png"
        : base64.startsWith("/9j/")
          ? "image/jpeg"
          : base64.startsWith("R0lGOD")
            ? "image/gif"
            : base64.startsWith("UklGR")
              ? "image/webp"
              : "image/jpeg";
      imageUri = `data:${mimeType};base64,${base64}`;
    }
  }
  const isImage = isImageType || Boolean(imageUri);

  const canRetry = isFailed && !isImage;
  const Wrapper = canRetry ? TouchableOpacity : View;

  return (
    <Wrapper
      style={isOwnMessage ? styles.rightBubble : styles.leftBubble}
      {...(canRetry
        ? { activeOpacity: 0.7, onPress: () => onRetry?.(message) }
        : {})}
    >
      {isImage ? (
        imageUri ? (
          <ChatImage uri={imageUri} onPress={onImagePress} />
        ) : (
          <Text style={styles.text}>Image unavailable</Text>
        )
      ) : (
        <Text style={styles.text}>{message?.message}</Text>
      )}

      {isFailed ? (
        <Text style={styles.failedText}>
          {canRetry
            ? "Failed to send · Tap to retry"
            : "Image could not be sent"}
        </Text>
      ) : status === "sending" ? (
        <Text style={isOwnMessage ? styles.rightTime : styles.leftTime}>
          Sending…
        </Text>
      ) : (
        <Text style={isOwnMessage ? styles.rightTime : styles.leftTime}>
          {message?.createdAt
            ? new Date(message.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            : ""}
        </Text>
      )}
    </Wrapper>
  );
}

const styles = StyleSheet.create({
  leftBubble: {
    maxWidth: "85%",
    alignSelf: "flex-start",
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    borderRadius: wp(3),
    padding: wp(4),
    marginBottom: hp(1.5),
  },

  rightBubble: {
    maxWidth: "85%",
    alignSelf: "flex-end",
    backgroundColor: "#fff6f0",
    borderRadius: wp(3),
    padding: wp(4),
    marginBottom: hp(1.5),
  },

  text: {
    fontSize: RF(16),
    color: Colors.darkBrown,
    lineHeight: RF(16) * 1.35,
    fontWeight: "700",
  },

  image: {
    width: 220,
    height: 220,
    borderRadius: wp(2),
    backgroundColor: "#f3f4f6",
  },

  leftTime: {
    color: Colors.textGray,
    fontSize: RF(12),
    marginTop: hp(0.6),
    fontWeight: "700",
  },

  rightTime: {
    color: Colors.textGray,
    fontSize: RF(12),
    marginTop: hp(0.6),
    textAlign: "right",
    fontWeight: "700",
  },

  failedText: {
    color: "#dc2626",
    fontSize: RF(12),
    marginTop: hp(0.6),
    textAlign: "right",
    fontWeight: "700",
  },
});
