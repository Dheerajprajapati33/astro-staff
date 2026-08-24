import AsyncStorage from "@react-native-async-storage/async-storage";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { BASE_URL } from "../config/api";

export const reviewApi = createApi({
  reducerPath: "reviewApi",

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

  tagTypes: ["Reviews"],

  endpoints: (builder) => ({
    // ==========================
    // GET REVIEWS
    // ==========================

    getReviews: builder.query({
      query: () => ({
        url: "/review/get-reviews",

        method: "GET",
      }),

      transformResponse: (response) => {
        if (!response?.success) {
          return {
            astrologer: null,

            ratingSummary: {
              1: 0,

              2: 0,

              3: 0,

              4: 0,

              5: 0,
            },

            reviews: [],

            pagination: null,
          };
        }

        return response.data;
      },

      providesTags: ["Reviews"],
    }),

    // ==========================
    // ADD REVIEW REPLY
    // ==========================

    addReviewReply: builder.mutation({
      query: ({
        reviewId,

        reply,
      }) => ({
        url: `/review/${reviewId}/reply`,

        method: "PATCH",

        body: {
          reply: reply,
        },
      }),

      transformResponse: (response) => {
        if (!response?.success) {
          return null;
        }

        return response.data;
      },

      invalidatesTags: ["Reviews"],
    }),
  }),
});

export const {
  useGetReviewsQuery,

  useAddReviewReplyMutation,
} = reviewApi;
