import { configureStore } from "@reduxjs/toolkit";
import { chatApi } from "./ChatApi";
import { contentApi } from "./contentApi";
import { expertiseApi } from "./expertiseApi";
import { followerApi } from "./FollowerApi";
import { galleryApi } from "./GalleryApi";
import { languageApi } from "./languageApi";
import { liveApi } from "./LiveApi";
import { loginApi } from "./LoginApi";
import { offerApi } from "./OfferApi";
import { onlineApi } from "./onlineApi";
import { priceUpdateApi } from "./PriceupdateApi";
import { profileApi } from "./ProfileApi";
import { registerApi } from "./registerApi";
import { reviewApi } from "./ReviewApi";
import { walletApi } from "./walletApi";

export const store = configureStore({
  reducer: {
    [expertiseApi.reducerPath]: expertiseApi.reducer,
    [languageApi.reducerPath]: languageApi.reducer,
    [registerApi.reducerPath]: registerApi.reducer,
    [profileApi.reducerPath]: profileApi.reducer,
    [onlineApi.reducerPath]: onlineApi.reducer,
    [loginApi.reducerPath]: loginApi.reducer,
    [galleryApi.reducerPath]: galleryApi.reducer,
    [contentApi.reducerPath]: contentApi.reducer,
    [offerApi.reducerPath]: offerApi.reducer,
    [followerApi.reducerPath]: followerApi.reducer,
    [reviewApi.reducerPath]: reviewApi.reducer,
    [priceUpdateApi.reducerPath]: priceUpdateApi.reducer,
    [chatApi.reducerPath]: chatApi.reducer,
    [liveApi.reducerPath]: liveApi.reducer,
    [walletApi.reducerPath]: walletApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      expertiseApi.middleware,
      languageApi.middleware,
      registerApi.middleware,
      profileApi.middleware,
      onlineApi.middleware,
      loginApi.middleware,
      galleryApi.middleware,
      contentApi.middleware,
      offerApi.middleware,
      followerApi.middleware,
      reviewApi.middleware,
      priceUpdateApi.middleware,
      chatApi.middleware,
      liveApi.middleware,
      walletApi.middleware,
    ),
});

