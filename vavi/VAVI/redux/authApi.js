import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../config/api";

export const authApi = createApi({
  reducerPath: "authApi",

  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/api`,

    prepareHeaders: (headers) => {
      headers.set("Accept", "application/json");
      headers.set("Content-Type", "application/json");
      headers.set("ngrok-skip-browser-warning", "true");

      return headers;
    },
  }),

  endpoints: (builder) => ({
    // Send OTP API
    login: builder.mutation({
      query: ({ phone, role = "user" }) => ({
        url: "/auth/login",
        method: "POST",
        body: {
          phone,
          role,
        },
      }),
    }),

    // Verify OTP API
    verifyOtp: builder.mutation({
      query: ({ phone, otp, role = "user" }) => ({
        url: "/auth/verify-otp",
        method: "POST",
        body: {
          phone,
          role,
          otp,
        },
      }),
    }),
  }),
});

export const { useLoginMutation, useVerifyOtpMutation } = authApi;
