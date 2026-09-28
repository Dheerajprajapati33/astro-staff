import AsyncStorage from "@react-native-async-storage/async-storage";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../config/api";

export const PanchangApi = createApi({
  reducerPath: "PanchangApi",

  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/api`,

    prepareHeaders: async (headers) => {
      // Basic headers
      headers.set("Accept", "application/json");
      headers.set("Content-Type", "application/json");
      headers.set("ngrok-skip-browser-warning", "true");

      // =====================================================
      // ASTROLOGY ENGINE TOKEN
      // =====================================================

      const astrologyToken =
        process.env.EXPO_PUBLIC_ASTROLOGY_ENGINE_TOKEN;

      if (astrologyToken) {
        headers.set(
          "x-astrology-token",
          astrologyToken
        );
      } else {
        console.log(
          "WARNING: EXPO_PUBLIC_ASTROLOGY_ENGINE_TOKEN is missing"
        );
      }

      // =====================================================
      // USER AUTH TOKEN
      // =====================================================

      try {
        const userData =
          await AsyncStorage.getItem("userData");

        if (userData) {
          const parsedUser =
            JSON.parse(userData);

          if (parsedUser?.token) {
            headers.set(
              "Authorization",
              `Bearer ${parsedUser.token}`
            );
          }
        }
      } catch (error) {
        console.log(
          "Panchang Auth Header Error:",
          error
        );
      }

      return headers;
    },
  }),

  tagTypes: ["Panchang"],

  endpoints: (builder) => ({
    // =====================================================
    // DAILY PANCHANG
    // =====================================================

    getPanchang: builder.mutation({
      query: ({
        date,
        birthPlace,
        la = "hi",
      }) => ({
        url: "/astrology/kundali/panchang",

        method: "POST",

        body: {
          date,
          birthPlace,
          la,
        },
      }),

      invalidatesTags: ["Panchang"],
    }),
  }),
});

export const {
  useGetPanchangMutation,
} = PanchangApi;