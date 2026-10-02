import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createApi,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";

import { BASE_URL } from "../config/api";

// Expo automatically loads EXPO_PUBLIC_ variables from .env
const ASTROLOGY_ENGINE_TOKEN =
  process.env.EXPO_PUBLIC_ASTROLOGY_ENGINE_TOKEN || "d9b62fc075139e3f91a28ad5390f8d5a91999ef844c6f5c6ff836ea97d4d5b1e";

export const kundliApi = createApi({
  reducerPath: "kundliApi",

  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/api`,

    timeout: 60000,

    prepareHeaders: async (headers) => {
      headers.set("Accept", "application/json");
      headers.set("Content-Type", "application/json");

      // Astrology Engine Token
      if (ASTROLOGY_ENGINE_TOKEN) {
        headers.set(
          "x-astrology-token",
          ASTROLOGY_ENGINE_TOKEN
        );
      }

      // Ngrok
      headers.set(
        "ngrok-skip-browser-warning",
        "true"
      );

      // Application login token
      try {
        const userData =
          await AsyncStorage.getItem("userData");

        if (userData) {
          const user = JSON.parse(userData);

          if (user?.token) {
            headers.set(
              "Authorization",
              `Bearer ${user.token}`
            );
          }
        }
      } catch (error) {
        console.log(
          "Unable to read userData:",
          error
        );
      }

      return headers;
    },
  }),

  tagTypes: ["Kundli"],

  endpoints: (builder) => ({

    // ==========================================
    // FULL KUNDLI
    // ==========================================
    getFullKundli: builder.mutation({
      query: (body) => ({
        url: "/astrology/kundali/basic",
        method: "POST",
        body,
      }),

      invalidatesTags: ["Kundli"],
    }),

    // ==========================================
    // BASIC KUNDLI
    // ==========================================
    getBasicKundli: builder.mutation({
      query: (body) => ({
        url: "/astrology/kundali/basic",
        method: "POST",
        body,
      }),

      invalidatesTags: ["Kundli"],
    }),

    // ==========================================
    // PANCHANG
    // ==========================================
    getPanchang: builder.mutation({
      query: (body) => ({
        url: "/tools/panchang",
        method: "POST",
        body,
      }),
    }),

    // ==========================================
    // KUNDLI MATCHING
    // ==========================================
    matchKundli: builder.mutation({
      query: (body) => ({
        url: "/astrology/kundali/match",
        method: "POST",
        body,
      }),
    }),
  }),
});

// ==========================================
// EXPORT HOOKS
// ==========================================

export const {
  useGetFullKundliMutation,
  useGetBasicKundliMutation,
  useGetPanchangMutation,
  useMatchKundliMutation,
} = kundliApi;