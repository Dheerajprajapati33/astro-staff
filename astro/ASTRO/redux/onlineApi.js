import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "../config/api";

export const onlineApi = createApi({
  reducerPath: "onlineApi",

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

  tagTypes: ["OnlineStatus", "Profile"],

  endpoints: (builder) => ({
    updateOnlineStatus: builder.mutation({
      query: ({ isChatOnline, isCallOnline }) => {
        const body = {};
        if (typeof isChatOnline === "boolean") body.isChatOnline = isChatOnline;
        if (typeof isCallOnline === "boolean") body.isCallOnline = isCallOnline;

        return {
          url: "/users/update-online-status", // userId removed
          method: "PATCH",
          body,
        };
      },

      transformResponse: (response) => {
        if (!response?.success) return null;
        return response?.data ?? null;
      },

      invalidatesTags: ["OnlineStatus", "Profile"],
    }),
  }),
});

export const { useUpdateOnlineStatusMutation } = onlineApi;