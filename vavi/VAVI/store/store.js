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

const authErrorMiddleware = (store) => (next) => (action) => {
  if (action?.payload?.status === 401) {
    console.log("Unauthorized (401) detected, logging out...");
    AsyncStorage.multiRemove(["userData", "token", "user"])
      .then(() => {
        router.replace("/(auth)/login");
      })
      .catch((err) => console.log("Failed to clear userData on 401:", err));
  }
  return next(action);
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
