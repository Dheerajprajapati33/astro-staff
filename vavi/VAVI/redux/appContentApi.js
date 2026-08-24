import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../config/api";

export const appContentApi = createApi({
  reducerPath: "appContentApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/api`,
    prepareHeaders: (headers, { getState }) => {
      const token = getState()?.auth?.token; // agar token use ho raha hai
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["AppContent"],
  endpoints: (builder) => ({
    getAppContent: builder.query({
      query: (type) => `/content/get/${type}`,
      providesTags: ["AppContent"],
    }),
  }),
});

export const { useGetAppContentQuery } = appContentApi;