// utils/auth.js
// Shared helper to read the astrologer's stored session (token + profile),
// mirroring the AsyncStorage("userData") shape written in app/(auth)/otp.js.

import AsyncStorage from "@react-native-async-storage/async-storage";

export const getStoredUser = async () => {
  try {
    const raw = await AsyncStorage.getItem("userData");

    if (!raw) return null;

    return JSON.parse(raw);
  } catch (error) {
    console.log("GET STORED USER ERROR:", error);

    return null;
  }
};
