import AsyncStorage from "@react-native-async-storage/async-storage";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../config/api";

export const UpayaApi = createApi({
  reducerPath: "UpayaApi",
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
  tagTypes: ["Upaya"],
  endpoints: (builder) => ({
    // ===================================
    // GET AAJ KA MAHA UPAYA (Query & Mutation)
    // ===================================
    getDailyUpaya: builder.query({
      query: ({ category, date } = {}) => {
        let url = "/tools/maha-upaya";
        const params = [];
        if (category) params.push(`category=${encodeURIComponent(category)}`);
        if (date) params.push(`date=${encodeURIComponent(date)}`);
        if (params.length > 0) url += `?${params.join("&")}`;
        return { url, method: "GET" };
      },
      providesTags: ["Upaya"],
    }),

    fetchDailyUpaya: builder.mutation({
      query: (data) => ({
        url: "/tools/maha-upaya",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Upaya"],
    }),
  }),
});

export const {
  useGetDailyUpayaQuery,
  useLazyGetDailyUpayaQuery,
  useFetchDailyUpayaMutation,
} = UpayaApi;
