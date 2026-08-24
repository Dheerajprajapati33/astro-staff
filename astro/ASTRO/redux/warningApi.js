import AsyncStorage from "@react-native-async-storage/async-storage";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { BASE_URL as _BASE } from "../config/api";
const BASE_URL = `${_BASE}/api`;

export const warningApi = createApi({
  reducerPath: "warningApi",

  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,

    prepareHeaders: async (headers) => {
      headers.set("Accept", "application/json");

      headers.set("ngrok-skip-browser-warning", "true");

      const userData = await AsyncStorage.getItem("userData");

      if (userData) {
        const user = JSON.parse(userData);

        if (user?.token) {
          headers.set("Authorization", `Bearer ${user.token}`);
        }
      }

      return headers;
    },
  }),

  tagTypes: ["Warnings"],

  endpoints: (builder) => ({
    getWarnings: builder.query({
      query: () => ({
        url: "/warnings/get-warnings",

        method: "GET",
      }),

      transformResponse: (response) => {
        if (!response?.success) {
          return [];
        }

        return response?.data?.warnings || [];
      },

      providesTags: ["Warnings"],
    }),
  }),
});

export const { useGetWarningsQuery } = warningApi;
