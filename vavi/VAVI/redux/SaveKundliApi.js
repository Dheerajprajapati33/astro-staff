import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createApi,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";

import { BASE_URL } from "../config/api";

export const saveKundliApi = createApi({
  reducerPath: "saveKundliApi",

  // ==================================================
  // BASE QUERY
  // ==================================================

  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/api`,

    prepareHeaders: async (headers) => {
      // ==================================================
      // BASIC HEADERS
      // ==================================================

      headers.set(
        "Accept",
        "application/json"
      );

      headers.set(
        "Content-Type",
        "application/json"
      );

      // Ngrok
      headers.set(
        "ngrok-skip-browser-warning",
        "true"
      );

      // ==================================================
      // ASTROLOGY TOKEN
      // ==================================================

      try {
        const astrologyToken =
          process.env
            .EXPO_PUBLIC_ASTROLOGY_ENGINE_TOKEN;

        if (astrologyToken) {
          headers.set(
            "x-astrology-token",
            astrologyToken
          );

          console.log(
            "✅ Astrology token attached"
          );
        } else {
          console.log(
            "⚠️ ASTROLOGY TOKEN NOT FOUND"
          );
        }
      } catch (error) {
        console.log(
          "❌ Astrology token error:",
          error
        );
      }

      // ==================================================
      // USER LOGIN JWT
      // ==================================================

      try {
        const userData =
          await AsyncStorage.getItem(
            "userData"
          );

        if (userData) {
          const user =
            JSON.parse(userData);

          if (user?.token) {
            headers.set(
              "Authorization",
              `Bearer ${user.token}`
            );

            console.log(
              "✅ User Authorization token attached"
            );
          } else {
            console.log(
              "⚠️ userData found but token missing"
            );
          }
        } else {
          console.log(
            "⚠️ userData not found in AsyncStorage"
          );
        }
      } catch (error) {
        console.log(
          "❌ userData parse error:",
          error
        );
      }

      return headers;
    },
  }),

  // ==================================================
  // TAG TYPES
  // ==================================================

  tagTypes: [
    "SavedKundli",
  ],

  // ==================================================
  // ENDPOINTS
  // ==================================================

  endpoints: (builder) => ({

    // ==================================================
    // SAVE KUNDLI
    //
    // POST /api/astrology/kundali/save
    // ==================================================

    saveKundli:
      builder.mutation({
        query: (data) => {
          const url =
            "/astrology/kundali/save";

          console.log(
            "========================================"
          );

          console.log(
            "💾 SAVE KUNDLI API REQUEST"
          );

          console.log(
            "METHOD:",
            "POST"
          );

          console.log(
            "FINAL URL:",
            `${BASE_URL}/api${url}`
          );

          console.log(
            "SAVE KUNDLI DATA:",
            JSON.stringify(
              data,
              null,
              2
            )
          );

          console.log(
            "========================================"
          );

          return {
            url,
            method: "POST",
            body: data,
          };
        },

        invalidatesTags: [
          "SavedKundli",
        ],
      }),

    // ==================================================
    // GET SAVED KUNDLIS
    //
    // GET /api/astrology/kundali/saved
    // ==================================================

    getSavedKundli:
      builder.query({
        query: () => {
          const url =
            "/astrology/kundali/saved";

          console.log(
            "========================================"
          );

          console.log(
            "📚 GET SAVED KUNDLI API"
          );

          console.log(
            "METHOD:",
            "GET"
          );

          console.log(
            "FINAL URL:",
            `${BASE_URL}/api${url}`
          );

          console.log(
            "========================================"
          );

          return {
            url,
            method: "GET",
          };
        },

        providesTags: [
          "SavedKundli",
        ],

        transformResponse: (
          response
        ) => {
          console.log(
            "========================================"
          );

          console.log(
            "📚 GET SAVED KUNDLI RESPONSE"
          );

          console.log(
            JSON.stringify(
              response,
              null,
              2
            )
          );

          console.log(
            "========================================"
          );

          return response;
        },
      }),

    // ==================================================
    // DELETE SAVED KUNDLI
    //
    // DELETE
    // /api/astrology/kundali/saved/:id
    // ==================================================

    deleteSavedKundli:
      builder.mutation({
        query: (id) => {
          const url =
            `/astrology/kundali/saved/${id}`;

          console.log(
            "========================================"
          );

          console.log(
            "🗑️ DELETE SAVED KUNDLI"
          );

          console.log(
            "METHOD:",
            "DELETE"
          );

          console.log(
            "ID:",
            id
          );

          console.log(
            "FINAL URL:",
            `${BASE_URL}/api${url}`
          );

          console.log(
            "========================================"
          );

          return {
            url,
            method: "DELETE",
          };
        },

        invalidatesTags: [
          "SavedKundli",
        ],
      }),
  }),
});

// ==================================================
// EXPORT HOOKS
// ==================================================

export const {
  useSaveKundliMutation,
  useGetSavedKundliQuery,
  useDeleteSavedKundliMutation,
} = saveKundliApi;