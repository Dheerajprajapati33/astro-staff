import AsyncStorage from "@react-native-async-storage/async-storage";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { BASE_URL } from "../config/api";

export const saveKundliApi = createApi({
  reducerPath: "saveKundliApi",

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

  tagTypes: ["SavedKundli"],

  endpoints: (builder) => ({
    // =================================
    // SAVE KUNDLI
    // POST /kundli/save
    // =================================

    saveKundli: builder.mutation({
      query: (data) => ({
        url: "/kundli/save",

        method: "POST",

        body: data,
      }),

      invalidatesTags: ["SavedKundli"],
    }),

    // =================================
    // GET SAVED KUNDLI
    // GET /kundli/saved
    // =================================

    getSavedKundli: builder.query({
      query: () => ({
        url: "/kundli/saved",

        method: "GET",
      }),

      providesTags: ["SavedKundli"],
    }),
  }),
});

export const {
  useSaveKundliMutation,

  useGetSavedKundliQuery,
} = saveKundliApi;
