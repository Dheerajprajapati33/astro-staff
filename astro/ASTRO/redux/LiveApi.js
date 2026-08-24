import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "../config/api";

export const liveApi = createApi({
  reducerPath: "liveApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/api`,
    prepareHeaders: async (headers) => {
      headers.set("Accept", "application/json");
      headers.set("Content-Type", "application/json");
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
  tagTypes: ["LiveSession"],
  endpoints: (builder) => ({
    startLiveSession: builder.mutation({
      query: (data) => ({
        url: "/live/start",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["LiveSession"],
    }),
    endLiveSession: builder.mutation({
      query: () => ({
        url: "/live/end",
        method: "PATCH",
      }),
      invalidatesTags: ["LiveSession"],
    }),
    getLiveSessions: builder.query({
      query: ({ page = 1, limit = 10 } = {}) => ({
        url: `/live/get?page=${page}&limit=${limit}`,
        method: "GET",
      }),
      providesTags: ["LiveSession"],
    }),
  }),
});

export const {
  useStartLiveSessionMutation,
  useEndLiveSessionMutation,
  useGetLiveSessionsQuery,
} = liveApi;
