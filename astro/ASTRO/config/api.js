// app/_config/api.js

export const BASE_URL =
  "https://jai-kulariya.taile3ce76.ts.net";

export const resolveImageUri = (uri) => {
  if (!uri) return null;
  if (uri.startsWith("http://") || uri.startsWith("https://")) {
    return { uri };
  }
  const cleanPath = uri.startsWith("/") ? uri.slice(1) : uri;
  return { uri: `${BASE_URL}/${cleanPath}` };
};

// Socket.io connects to the same host as the REST API (no "/api" suffix).
export const SOCKET_URL = BASE_URL;