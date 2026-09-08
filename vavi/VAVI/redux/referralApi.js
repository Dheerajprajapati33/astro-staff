import AsyncStorage from "@react-native-async-storage/async-storage";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../config/api";

export const referralApi = createApi({
  reducerPath: "referralApi",

  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/api`,

    prepareHeaders: async (headers) => {
      headers.set("Accept", "application/json");
      headers.set("ngrok-skip-browser-warning", "true");

      try {
        const savedUserData = await AsyncStorage.getItem("userData");
        if (savedUserData) {
          const parsed = JSON.parse(savedUserData);
          if (parsed?.token) {
            headers.set("Authorization", `Bearer ${parsed.token}`);
          }
        }
      } catch (error) {
        console.log("[referralApi] token error:", error);
      }

      return headers;
    },
  }),

  tagTypes: ["Referral"],

  endpoints: (builder) => ({
    // ==================================
    // GET REFERRAL DETAILS
    // ==================================
    getReferralDetails: builder.query({
      query: () => ({
        url: "/users/referral",
        method: "GET",
      }),
      providesTags: ["Referral"],
    }),
  }),
});

export const { useGetReferralDetailsQuery } = referralApi;
