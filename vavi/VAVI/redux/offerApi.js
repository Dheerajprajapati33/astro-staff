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
          headers.set("Authorization", `Bearer ${parsedUser.token}`);
        }
      }

      return headers;
    },
  }),

  tagTypes: ["Offer"],

  endpoints: (builder) => ({
    // ==========================
    // GET ACTIVE OFFERS
    // ==========================
    getActiveOffers: builder.query({
      query: (params = {}) => {
        const queryParams = new URLSearchParams();
        if (params.astrologerId)
          queryParams.append("astrologerId", params.astrologerId);
        if (params.page) queryParams.append("page", params.page);
        if (params.limit) queryParams.append("limit", params.limit);
        const queryString = queryParams.toString();

        return {
          url: `/offer/get-offers${queryString ? `?${queryString}` : ""}`,
          method: "GET",
        };
      },
      transformResponse: (response) => {
        if (!response) return [];
        if (Array.isArray(response)) return response;
        if (Array.isArray(response?.data?.offers)) return response.data.offers;
        if (Array.isArray(response?.data)) return response.data;
        if (Array.isArray(response?.offers)) return response.offers;
        return [];
      },
      providesTags: ["Offer"],
    }),

    // ==========================
    // APPLY PROMO OFFER
    // ==========================
    applyPromoOffer: builder.mutation({
      query: (data) => ({
        url: "/offer/apply",
        method: "POST",
        body: {
          promoCode: data?.promoCode || data?.code,
          code: data?.promoCode || data?.code,
          amount: data?.amount,
          ...(data?.astrologerId ? { astrologerId: data.astrologerId } : {}),
          ...(data?.offerId ? { offerId: data.offerId } : {}),
          ...(data?.type ? { type: data.type } : {}),
        },
      }),
      invalidatesTags: ["Offer"],
    }),
  }),
});

export const { useGetActiveOffersQuery, useApplyPromoOfferMutation } = offerApi;
