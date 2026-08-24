import AsyncStorage from "@react-native-async-storage/async-storage";

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { BASE_URL } from "../config/api";

export const TarotApi = createApi({
  reducerPath: "TarotApi",

  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/api`,

    prepareHeaders: async (headers) => {
      headers.set("Accept", "application/json");

      headers.set("ngrok-skip-browser-warning", "true");

      const userData = await AsyncStorage.getItem("userData");

      if (userData) {
        const parsedUser = JSON.parse(userData);

        if (parsedUser?.token) {
          headers.set(
            "Authorization",

            `Bearer ${parsedUser.token}`,
          );
        }
      }

      return headers;
    },
  }),

  tagTypes: ["Tarot"],

  endpoints: (builder) => ({
    // =========================
    // DRAW TAROT CARDS
    // =========================

    drawTarotCards: builder.mutation({
      query: (data) => ({
        url: "/tools/tarot/draw",

        method: "POST",

        body: data,
      }),

      invalidatesTags: ["Tarot"],
    }),
  }),
});

export const { useDrawTarotCardsMutation } = TarotApi;
