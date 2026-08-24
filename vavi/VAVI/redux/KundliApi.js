import AsyncStorage from "@react-native-async-storage/async-storage";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { BASE_URL } from "../config/api";

export const kundliApi = createApi({
  reducerPath: "kundliApi",

  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/api`,

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

  tagTypes: ["Kundli"],

  endpoints: (builder) => ({
    // =========================
    // GENERATE KUNDLI
    // =========================

    generateKundli: builder.mutation({
      query: (data) => ({
        url: "/kundli/generate",

        method: "POST",

        body: data,
      }),

      invalidatesTags: ["Kundli"],
    }),
  }),
});

export const { useGenerateKundliMutation } = kundliApi;
