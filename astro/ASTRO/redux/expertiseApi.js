import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { BASE_URL as _BASE } from "../config/api";
const BASE_URL = `${_BASE}/api`;

export const expertiseApi = createApi({
  reducerPath: "expertiseApi",

  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers) => {
      headers.set("Content-Type", "application/json");

      // Ngrok warning page ko bypass karne ke liye
      headers.set("ngrok-skip-browser-warning", "true");

      return headers;
    },
  }),

  tagTypes: ["Expertise"],

  endpoints: (builder) => ({
    getExpertises: builder.query({
      query: () => ({
        url: "/expertise/get",
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

      providesTags: ["Expertise"],
    }),
  }),
});

export const { useGetExpertisesQuery } = expertiseApi;