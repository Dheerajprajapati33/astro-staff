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

export async function validateChatImage() {
  throw new Error(
    "Image checking is only available in the Android and iOS apps.",
  );
}
