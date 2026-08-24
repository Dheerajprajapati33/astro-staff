import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { BASE_URL as _BASE } from "../config/api";
const BASE_URL = `${_BASE}/api`;

export const languageApi = createApi({
  reducerPath: "languageApi",

  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,

    prepareHeaders: (headers) => {
      headers.set("Content-Type", "application/json");

      // Ngrok browser warning bypass
      headers.set("ngrok-skip-browser-warning", "true");

      return headers;
    },
  }),

  tagTypes: ["Language"],

  endpoints: (builder) => ({
    getLanguages: builder.query({
      query: () => ({
        url: "/language/get",
        method: "GET",
      }),

      transformResponse: (response) => {
        if (!response?.success) {
          return [];
        }

        return [...(response?.data || [])]
          .filter((item) => item?.isActive)
          .sort((a, b) => a.sortOrder - b.sortOrder);
      },

      providesTags: ["Language"],
    }),
  }),
});

export const { useGetLanguagesQuery } = languageApi;