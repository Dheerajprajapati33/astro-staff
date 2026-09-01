import { configureStore } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

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

import { performClientLogoutVavi } from "../utils/auth";

let lastLoginTime = 0;

export const recordFreshLogin = () => {
  lastLoginTime = Date.now();
  console.log("[Store] Fresh login recorded at timestamp:", lastLoginTime);
};

const authErrorMiddleware = (store) => (next) => (action) => {
  const result = next(action);

  // Check for protected endpoint HTTP 401 Unauthorized errors
  if (
    action?.type?.endsWith("/rejected") &&
    action?.payload?.status === 401 &&
    !action?.type?.startsWith("authApi/")
  ) {
    // Ignore pre-login 401 errors arriving right after a fresh login transition (within 4 seconds)
    if (Date.now() - lastLoginTime < 4000) {
      console.log(
        "[Store Middleware] Ignoring stale pre-login 401 action right after fresh login:",
        action.type,
      );
      return result;
    }

    // Only trigger auto-logout if user actually has an active session stored
    AsyncStorage.getItem("userData")
      .then((userData) => {
        if (userData) {
          const parsed = JSON.parse(userData);
          if (parsed?.token) {
            console.log(
              "Unauthorized (401) on protected API detected:",
              action.type,
              "- logging out...",
            );
            performClientLogoutVavi();
          }
        }
      })
      .catch((err) => console.log("Failed to check userData on 401:", err));
  }

  return result;
};

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [updateApi.reducerPath]: updateApi.reducer,
    [AstroApi.reducerPath]: AstroApi.reducer,
    [walletApi.reducerPath]: walletApi.reducer,
    [PalmApi.reducerPath]: PalmApi.reducer,
    [numerologyApi.reducerPath]: numerologyApi.reducer,
    [PanchangApi.reducerPath]: PanchangApi.reducer,
    [TarotApi.reducerPath]: TarotApi.reducer,
    [kundliApi.reducerPath]: kundliApi.reducer,
    [saveKundliApi.reducerPath]: saveKundliApi.reducer,
    [followerApi.reducerPath]: followerApi.reducer,
    [appContentApi.reducerPath]: appContentApi.reducer,
    [consultationApi.reducerPath]: consultationApi.reducer,
    [liveApi.reducerPath]: liveApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authErrorMiddleware,
      authApi.middleware,
      updateApi.middleware,
      AstroApi.middleware,
      walletApi.middleware,
      PalmApi.middleware,
      numerologyApi.middleware,
      PanchangApi.middleware,
      TarotApi.middleware,
      kundliApi.middleware,
      saveKundliApi.middleware,
      followerApi.middleware,
      appContentApi.middleware,
      consultationApi.middleware,
      liveApi.middleware,
    ),
});
