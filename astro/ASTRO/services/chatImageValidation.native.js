import ImageLabeling from "@react-native-ml-kit/image-labeling";

export const MAX_CHAT_IMAGE_SIZE_BYTES = 8 * 1024 * 1024;

export function getChatImageSizeBytes(asset) {
  if (Number.isFinite(asset?.fileSize) && asset.fileSize >= 0) {
    return asset.fileSize;
  }

  if (typeof asset?.base64 === "string") {
    const padding = asset.base64.endsWith("==")
      ? 2
      : asset.base64.endsWith("=")
        ? 1
        : 0;
    return Math.floor((asset.base64.length * 3) / 4) - padding;
  }

  throw new Error("Unable to determine the selected image size.");
}

export async function validateChatImage(imageUri) {
  if (!imageUri) {
    throw new Error("The selected image could not be read.");
  }

  let labels;
  try {
    labels = await ImageLabeling.label(imageUri);
  } catch (error) {
    console.error("[ChatImageValidation] ML Kit could not analyze the image:", error);
    throw new Error(
      "Could not check this image. Rebuild the app with ML Kit and try again.",
    );
  }
  const acceptedKeywords = [
    "hand",
    "palm",
    "finger",
    "thumb",
    "wrist",
    "nail",
    "gesture",
    "arm",
    "skin",
    "person",
    "human",
    "face",
  ];
  const matches = labels.filter(
    (label) =>
      typeof label?.text === "string" &&
      Number.isFinite(label?.confidence) &&
      label.confidence >= 0.5 &&
      acceptedKeywords.some((keyword) =>
        label.text.toLowerCase().includes(keyword),
      ),
  );

  return {
    isValid: matches.length > 0,
    detectedLabels: matches.map(
      ({ text, confidence }) =>
        `${text} (${Math.round(confidence * 100)}%)`,
    ),
  };
}
