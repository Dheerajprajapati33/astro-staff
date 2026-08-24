import AsyncStorage from "@react-native-async-storage/async-storage";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { BASE_URL } from "../config/api";

export const offerApi = createApi({
  reducerPath: "offerApi",

  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/api`,

    prepareHeaders: async (headers) => {
      headers.set("Accept", "application/json");

      headers.set("ngrok-skip-browser-warning", "true");

      const userData = await AsyncStorage.getItem("userData");

      if (userData) {
        const parsedUser = JSON.parse(userData);

        if (parsedUser?.token) {
          headers.set(
            "Authorization",

            `Bearer ${parsedUser.token}`,
          );
        }
      }

      return headers;
    },
  }),

  tagTypes: ["Offer"],

  endpoints: (builder) => ({
    // =========================
    // CREATE OFFER
    // =========================

    createOffer: builder.mutation({
      query: (data) => ({
        url: "/offer/create-offer",

        method: "POST",

        body: data,
      }),

      transformResponse: (response) => {
        if (!response?.success) {
          return null;
        }

        return response.data;
      },

      invalidatesTags: ["Offer"],
    }),

    // =========================
    // GET OFFERS
    // =========================

    getOffers: builder.query({
      query: () => ({
        url: "/offer/get-offers",

        method: "GET",
      }),

      transformResponse: (response) => {
        if (!response?.success) {
          return [];
        }

        return response?.data?.offers || [];
      },

      providesTags: ["Offer"],
    }),

    // =========================
    // DELETE OFFER
    // =========================

    deleteOffer: builder.mutation({
      query: (offerId) => ({
        url: `/offer/${offerId}/delete`,

        method: "DELETE",
      }),

      transformResponse: (response) => {
        if (!response?.success) {
          return null;
        }

        return response;
      },

      invalidatesTags: ["Offer"],
    }),
  }),
});

export const {
  useCreateOfferMutation,

  useGetOffersQuery,

  useDeleteOfferMutation,
} = offerApi;
