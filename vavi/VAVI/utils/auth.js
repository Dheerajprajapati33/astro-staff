// utils/auth.js
// Shared auth helper for VAVI app - Handles 100% clean client-side logout without backend API calls.

import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { getCallSocket } from "../services/callSocketService";

import { AstroApi } from "../redux/AstroApi";
import { kundliApi } from "../redux/KundliApi";
import { PalmApi } from "../redux/PalmApi";
import { PanchangApi } from "../redux/PanchangApi";
import { saveKundliApi } from "../redux/SaveKundliApi";
import { TarotApi } from "../redux/TarotApi";
import { appContentApi } from "../redux/appContentApi";
import { authApi } from "../redux/authApi";
import { consultationApi } from "../redux/consultationApi";
import { followerApi } from "../redux/followerApi";
import { liveApi } from "../redux/liveApi";
import { numerologyApi } from "../redux/numerologyApi";
import { updateApi } from "../redux/updateApi";
import { walletApi } from "../redux/walletApi";

let isLoggingOut = false;

export const resetAllApiStatesVavi = () => {
  try {
    const { store } = require("../store/store");
    console.log("[VAVI Auth] Resetting all RTK Query API states...");
    store.dispatch(authApi.util.resetApiState());
    store.dispatch(updateApi.util.resetApiState());
    store.dispatch(AstroApi.util.resetApiState());
    store.dispatch(walletApi.util.resetApiState());
    store.dispatch(PalmApi.util.resetApiState());
    store.dispatch(numerologyApi.util.resetApiState());
    store.dispatch(PanchangApi.util.resetApiState());
    store.dispatch(TarotApi.util.resetApiState());
    store.dispatch(kundliApi.util.resetApiState());
    store.dispatch(saveKundliApi.util.resetApiState());
    store.dispatch(followerApi.util.resetApiState());
    store.dispatch(appContentApi.util.resetApiState());
    store.dispatch(consultationApi.util.resetApiState());
    store.dispatch(liveApi.util.resetApiState());
  } catch (err) {
    console.log("Reset API states error:", err);
  }
};

/**
 * Clean client-side logout for VAVI app without backend API dependency.
 * Includes re-entrancy lock to prevent infinite recursion during Redux reset.
 */
export const performClientLogoutVavi = async () => {
  if (isLoggingOut) {
    console.log("[VAVI Logout] Logout already in progress, skipping duplicate call...");
    return;
  }
  isLoggingOut = true;

  try {
    // Step 1: Disconnect Active Socket Connection
    const socket = getCallSocket();
    if (socket) {
      console.log("[VAVI Logout] Disconnecting socket...");
      socket.disconnect();
    }

    // Step 2: Clear ALL AsyncStorage Keys
    console.log("[VAVI Logout] Wiping AsyncStorage...");
    await AsyncStorage.clear();

    // Step 3: Reset all RTK Query API Caches in Redux
    console.log("[VAVI Logout] Resetting Redux RTK Query caches...");
    resetAllApiStatesVavi();

    // Step 4: Navigate to Login Screen
    console.log("[VAVI Logout] Navigating to login screen...");
    router.replace("/(auth)/login");
  } catch (error) {
    console.log("VAVI CLIENT LOGOUT ERROR:", error);
  } finally {
    setTimeout(() => {
      isLoggingOut = false;
    }, 1500);
  }
};
