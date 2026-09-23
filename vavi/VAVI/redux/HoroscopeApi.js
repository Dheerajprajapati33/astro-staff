import AsyncStorage from "@react-native-async-storage/async-storage";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../config/api";

export const HoroscopeApi = createApi({
  reducerPath: "HoroscopeApi",
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
  tagTypes: ["Horoscope"],
  endpoints: (builder) => ({
    // ===================================
    // GET HOROSCOPE (Query & Mutation)
    // ===================================
    getHoroscope: builder.query({
      query: ({ sign = "aries", timeframe = "Today", date } = {}) => {
        let url = `/tools/horoscope?sign=${encodeURIComponent(sign)}&timeframe=${encodeURIComponent(timeframe)}`;
        if (date) url += `&date=${encodeURIComponent(date)}`;
        return { url, method: "GET" };
      },
      providesTags: ["Horoscope"],
    }),

    fetchHoroscope: builder.mutation({
      query: (data) => ({
        url: "/tools/horoscope",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Horoscope"],
    }),
  }),
});

export const {
  useGetHoroscopeQuery,
  useLazyGetHoroscopeQuery,
  useFetchHoroscopeMutation,
} = HoroscopeApi;
