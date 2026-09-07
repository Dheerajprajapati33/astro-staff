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
      query: ({ page = 1, limit = 10, status, level } = {}) => {
        let url = `/warnings/get-warnings?page=${page}&limit=${limit}`;
        if (status) url += `&status=${status}`;
        if (level) url += `&level=${level}`;
        return {
          url,
          method: "GET",
        };
      },

      transformResponse: (response) => {
        if (!response?.success) {
          return { warnings: [], pagination: null };
        }

        const data = response?.data;
        if (Array.isArray(data)) {
          return { warnings: data, pagination: null };
        }
        if (Array.isArray(data?.warnings)) {
          return {
            warnings: data.warnings,
            pagination: data?.pagination || null,
          };
        }
        if (Array.isArray(data?.rows)) {
          return { warnings: data.rows, pagination: data?.pagination || null };
        }

        return { warnings: [], pagination: null };
      },

      providesTags: ["Warnings"],
    }),
  }),
});

export const { useGetWarningsQuery } = warningApi;
