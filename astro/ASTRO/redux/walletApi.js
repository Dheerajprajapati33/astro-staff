import AsyncStorage from "@react-native-async-storage/async-storage";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { BASE_URL } from "../config/api";

export const walletApi = createApi({
  reducerPath: "walletApi",

  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/api`,

    prepareHeaders: async (headers) => {
      headers.set("Accept", "application/json");
      headers.set("Content-Type", "application/json");
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

  tagTypes: ["Wallet", "Withdrawals"],

  endpoints: (builder) => ({
    // ==========================
    // GET ASTROLOGER WALLET BALANCE
    // ==========================
    getWalletBalance: builder.query({
      query: () => ({
        url: "/wallet/balance",
        method: "GET",
      }),
      providesTags: ["Wallet"],
    }),

    // ==========================
    // GET EARNINGS TRANSACTION HISTORY
    // ==========================
    getWalletTransactions: builder.query({
      query: ({ page = 1, limit = 20 } = {}) => ({
        url: `/wallet/transactions?page=${page}&limit=${limit}`,
        method: "GET",
      }),
      providesTags: ["Wallet"],
    }),

    // ==========================
    // SUBMIT BANK / UPI PAYOUT WITHDRAWAL REQUEST
    // ==========================
    requestWithdrawal: builder.mutation({
      query: ({ amount, paymentMethod = "UPI", paymentDetails }) => ({
        url: "/wallet/withdraw",
        method: "POST",
        body: {
          amount,
          paymentMethod,
          paymentDetails,
        },
      }),
      invalidatesTags: ["Wallet", "Withdrawals"],
    }),

    // ==========================
    // GET PAST WITHDRAWAL REQUESTS
    // ==========================
    getWithdrawals: builder.query({
      query: () => ({
        url: "/wallet/withdrawals",
        method: "GET",
      }),
      providesTags: ["Withdrawals"],
    }),
  }),
});

export const {
  useGetWalletBalanceQuery,
  useGetWalletTransactionsQuery,
  useRequestWithdrawalMutation,
  useGetWithdrawalsQuery,
} = walletApi;
