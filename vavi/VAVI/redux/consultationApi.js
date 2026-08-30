import AsyncStorage from "@react-native-async-storage/async-storage";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { BASE_URL } from "../config/api";

export const consultationApi = createApi({
  reducerPath: "consultationApi",

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

  tagTypes: ["ChatMessages", "ConsultationHistory", "Reviews"],

  endpoints: (builder) => ({
    // ==========================
    // CREATE CHAT CONSULTATION
    // ==========================

    createConsultation: builder.mutation({
      query: (data) => ({
        url: "/consultation/create",

        method: "POST",

        body: data,
      }),
    }),

    // ==========================
    // GET CHAT MESSAGE HISTORY
    // ==========================

    getChatMessages: builder.query({
      query: ({ roomId, page = 1, limit = 50 }) => ({
        url: `/chat/rooms/${roomId}/messages?page=${page}&limit=${limit}`,

        method: "GET",
      }),

      providesTags: ["ChatMessages"],
    }),

    // ==========================
    // GET CONSULTATION HISTORY
    // ==========================

    getConsultationHistory: builder.query({
      query: ({ page = 1, limit = 50 } = {}) => ({
        url: `/consultation/history?page=${page}&limit=${limit}`,

        method: "GET",
      }),
      providesTags: ["ConsultationHistory"],
    }),

    // ==========================
    // GET CALL TOKEN (Agora RTC)
    // ==========================

    getCallToken: builder.mutation({
      query: (consultationId) => ({
        url: `/consultation/token/${consultationId}`,

        method: "POST",
      }),
    }),

    // ==========================
    // CREATE / SUBMIT CONSULTATION REVIEW
    // ==========================

    createReview: builder.mutation({
      query: ({ astrologerId, consultationId, rating, review }) => ({
        url: "/review/create-review",
        method: "POST",
        body: {
          astrologerId,
          consultationId,
          rating,
          review,
        },
      }),
      invalidatesTags: ["ConsultationHistory", "Reviews", "ChatMessages"],
    }),
  }),
});

export const {
  useCreateConsultationMutation,
  useGetChatMessagesQuery,
  useGetConsultationHistoryQuery,
  useGetCallTokenMutation,
  useCreateReviewMutation,
} = consultationApi;

