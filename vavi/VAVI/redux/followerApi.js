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
          headers.set("Authorization", `Bearer ${parsedUser.token}`);
        }
      }
      return headers;
    },
  }),
  tagTypes: ["Follower"],
  endpoints: (builder) => ({
    // =========================
    // FOLLOW ASTROLOGER
    // =========================
    followAstrologer: builder.mutation({
      query: (astrologerId) => ({
        url: `/follower/follow/${astrologerId}`,
        method: "POST",
      }),
      invalidatesTags: ["Follower"],
    }),
    // =========================
    // GET FOLLOWING LIST
    // =========================
    getFollowing: builder.query({
      query: ({ page = 1, limit = 10 }) => ({
        url: `/follower/get-following?page=${page}&limit=${limit}`,
        method: "GET",
      }),
      providesTags: ["Follower"],
    }),
  }),
});

export const {
  useFollowAstrologerMutation,
  useGetFollowingQuery,
} = followerApi;