// app/_config/api.js

export const BASE_URL =
  "https://tissue-relay-reptile.ngrok-free.dev";

export const resolveImageUri = (uri) => {
  if (!uri) return null;
  const localServerUrl = uri.match(
    /^https?:\/\/(?:localhost|127\.0\.0\.1|0\.0\.0\.0)(?::\d+)?(\/.*)?$/i,
  );
  if (localServerUrl) {
    return { uri: `${BASE_URL}${localServerUrl[1] || ""}` };
  }
  if (uri.startsWith("http://") || uri.startsWith("https://")) {
    return { uri };
  }
  const cleanPath = uri.startsWith("/") ? uri.slice(1) : uri;
  return { uri: `${BASE_URL}/${cleanPath}` };
};

// Socket.io connects to the same host as the REST API (no "/api" suffix).
export const SOCKET_URL = BASE_URL;