import AsyncStorage from "@react-native-async-storage/async-storage";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../config/api";

export const AstroApi = createApi({
  reducerPath: "AstroApi",

  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/api`,

    prepareHeaders: async (headers) => {
      headers.set("Accept", "application/json");
      headers.set("ngrok-skip-browser-warning", "true");

      try {
        const savedUserData = await AsyncStorage.getItem("userData");

        if (savedUserData) {
          const parsedUserData = JSON.parse(savedUserData);

          if (parsedUserData?.token) {
            headers.set("Authorization", `Bearer ${parsedUserData.token}`);
          }
        }
      } catch (error) {
        console.log("Astrologer API token error:", error);
      }

      return headers;
    },
  }),

  tagTypes: ["Astrologers"],

  endpoints: (builder) => ({
    // ==================================
    // GET ASTROLOGERS
    // ==================================
    getAstrologers: builder.query({
      query: ({ page = 1, limit = 10, role = "astrologer" } = {}) => ({
        url: "/users/get-users",
        method: "GET",
        params: {
          page,
          limit,
          role,
        },
      }),

      // Group all pages of the same role under one cache entry so
      // subsequent pages append instead of replacing the list.
      serializeQueryArgs: ({ queryArgs }) => queryArgs?.role ?? "astrologer",

      merge: (currentCache, newResponse, { arg }) => {
        if (!arg || arg.page === 1) {
          return newResponse;
        }

        const existingUsers = currentCache?.data?.users || [];
        const newUsers = newResponse?.data?.users || [];
        const existingIds = new Set(existingUsers.map((u) => u.id));
        const mergedUsers = [
          ...existingUsers,
          ...newUsers.filter((u) => !existingIds.has(u.id)),
        ];

        currentCache.data = {
          ...newResponse.data,
          users: mergedUsers,
        };
      },

      forceRefetch: ({ currentArg, previousArg }) =>
        currentArg?.page !== previousArg?.page,

      providesTags: ["Astrologers"],
    }),
  }),
});

export const { useGetAstrologersQuery, useLazyGetAstrologersQuery } = AstroApi;
