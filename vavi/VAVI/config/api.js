export const BASE_URL =
  "https://noncompulsory-augustine-unbewilderingly.ngrok-free.dev";

export const resolveImageUri = (uri) => {
  if (!uri) return null;
  if (uri.startsWith("http://") || uri.startsWith("https://")) {
    return { uri };
  }
  const cleanPath = uri.startsWith("/") ? uri.slice(1) : uri;
  return { uri: `${BASE_URL}/${cleanPath}` };
};

export const SOCKET_URL = BASE_URL;