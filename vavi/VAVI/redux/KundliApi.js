import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createApi,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";

import { BASE_URL } from "../config/api";

// Expo automatically loads EXPO_PUBLIC_ variables from .env
const ASTROLOGY_ENGINE_TOKEN =
  process.env.EXPO_PUBLIC_ASTROLOGY_ENGINE_TOKEN;

export const kundliApi = createApi({
  reducerPath: "kundliApi",

  baseQuery: fetchBaseQuery({
    // Example:
    // https://your-ngrok-url.ngrok-free.app/api
    baseUrl: `${BASE_URL}/api`,

    timeout: 60000,

    prepareHeaders: async (headers) => {
      // Basic headers
      headers.set("Accept", "application/json");
      headers.set("Content-Type", "application/json");

      // Astrology Engine Token
      if (ASTROLOGY_ENGINE_TOKEN) {
        headers.set(
          "x-astrology-token",
          ASTROLOGY_ENGINE_TOKEN
        );
      }

      // Required for ngrok
      headers.set(
        "ngrok-skip-browser-warning",
        "true"
      );

      // Existing application login token
      // This is separate from ASTROLOGY_ENGINE_TOKEN.
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
    // BASIC / FULL KUNDLI
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
        url: "/astrology/kundali/panchang",
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