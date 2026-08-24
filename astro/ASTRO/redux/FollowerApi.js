import AsyncStorage from "@react-native-async-storage/async-storage";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { BASE_URL } from "../config/api";

export const followerApi = createApi({
  reducerPath: "followerApi",

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

  tagTypes: ["Followers"],

  endpoints: (builder) => ({
    // =========================
    // GET FOLLOWERS
    // =========================

    getFollowers: builder.query({
      query: () => ({
        url: "/follower/get-followers",

        method: "GET",
      }),

      transformResponse: (response) => {
        if (!response?.success) {
          return {
            totalFollowers: 0,

            followers: [],

            pagination: null,
          };
        }

        return response.data;
      },

      providesTags: ["Followers"],
    }),
  }),
});

export const { useGetFollowersQuery } = followerApi;
