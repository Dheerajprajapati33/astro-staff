// utils/auth.js
// Shared helper to read stored session & handle 100% clean client-side logout.

import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { store } from "../redux/store";
import { disconnectSocket } from "./socket";

import { chatApi } from "../redux/ChatApi";
import { contentApi } from "../redux/contentApi";
import { expertiseApi } from "../redux/expertiseApi";
import { followerApi } from "../redux/FollowerApi";
import { galleryApi } from "../redux/GalleryApi";
import { languageApi } from "../redux/languageApi";
import { liveApi } from "../redux/LiveApi";
import { loginApi } from "../redux/LoginApi";
import { offerApi } from "../redux/OfferApi";
import { onlineApi } from "../redux/onlineApi";
import { priceUpdateApi } from "../redux/PriceupdateApi";
import { profileApi } from "../redux/ProfileApi";
import { registerApi } from "../redux/registerApi";
import { reviewApi } from "../redux/ReviewApi";
import { walletApi } from "../redux/walletApi";

let isLoggingOut = false;

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

/**
 * Clean client-side logout without backend API calls.
 * Includes re-entrancy lock to prevent duplicate execution.
 */
export const performClientLogout = async () => {
  if (isLoggingOut) return;
  isLoggingOut = true;

  try {
    // Step 1: Disconnect Active Socket Connection
    disconnectSocket();

    // Step 2: Clear ALL AsyncStorage Data
    await AsyncStorage.clear();

    // Step 3: Reset all RTK Query / Redux State Cache from memory
    store.dispatch(chatApi.util.resetApiState());
    store.dispatch(contentApi.util.resetApiState());
    store.dispatch(expertiseApi.util.resetApiState());
    store.dispatch(followerApi.util.resetApiState());
    store.dispatch(followerApi.util.resetApiState());
    store.dispatch(galleryApi.util.resetApiState());
    store.dispatch(languageApi.util.resetApiState());
    store.dispatch(liveApi.util.resetApiState());
    store.dispatch(loginApi.util.resetApiState());
    store.dispatch(offerApi.util.resetApiState());
    store.dispatch(onlineApi.util.resetApiState());
    store.dispatch(priceUpdateApi.util.resetApiState());
    store.dispatch(profileApi.util.resetApiState());
    store.dispatch(registerApi.util.resetApiState());
    store.dispatch(reviewApi.util.resetApiState());
    store.dispatch(walletApi.util.resetApiState());

    // Step 4: Navigate to Login Screen
    router.replace("/(auth)/login");
  } catch (error) {
    console.log("CLIENT LOGOUT ERROR:", error);
  } finally {
    setTimeout(() => {
      isLoggingOut = false;
    }, 1500);
  }
};
