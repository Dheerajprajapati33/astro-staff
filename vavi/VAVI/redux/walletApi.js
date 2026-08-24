import AsyncStorage from "@react-native-async-storage/async-storage";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { BASE_URL } from "../config/api";

export const walletApi = createApi({
  reducerPath: "walletApi",

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

  tagTypes: ["Wallet"],

  endpoints: (builder) => ({
    // ==========================
    // GET WALLET BALANCE
    // ==========================

    getWalletBalance: builder.query({
      query: () => ({
        url: "/wallet/balance",

        method: "GET",
      }),

      providesTags: ["Wallet"],
    }),

    // ==========================
    // RECHARGE WALLET
    // ==========================

    rechargeWallet: builder.mutation({
      query: (data) => ({
        url: "/wallet/recharge",

        method: "POST",

        body: data,
      }),

      invalidatesTags: ["Wallet"],
    }),

    // ==========================
    // GET TRANSACTION HISTORY
    // ==========================

    getWalletTransactions: builder.query({
      query: ({ page = 1, limit = 10 }) => ({
        url: `/wallet/transactions?page=${page}&limit=${limit}`,

        method: "GET",
      }),

      providesTags: ["Wallet"],
    }),

    // ==========================
    // CREATE RAZORPAY ORDER
    // ==========================

    createPaymentOrder: builder.mutation({
      query: ({ amount }) => ({
        url: "/payment/create-order",
        method: "POST",
        body: { amount },
      }),
    }),

    // ==========================
    // VERIFY RAZORPAY PAYMENT
    // ==========================

    verifyPayment: builder.mutation({
      query: ({ razorpayOrderId, razorpayPaymentId, razorpaySignature, amount }) => ({
        url: "/payment/verify",
        method: "POST",
        body: {
          razorpayOrderId,
          razorpayPaymentId,
          razorpaySignature,
          amount,
        },
      }),

      invalidatesTags: ["Wallet"],
    }),
  }),
});

export const {
  useGetWalletBalanceQuery,
  useRechargeWalletMutation,
  useGetWalletTransactionsQuery,
  useCreatePaymentOrderMutation,
  useVerifyPaymentMutation,
} = walletApi;

