import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { BASE_URL as _BASE } from "../config/api";
const BASE_URL = `${_BASE}/api`;


export const loginApi = createApi({
  reducerPath: "loginApi",

  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,

    prepareHeaders: (headers) => {

      headers.set(
        "Accept",
        "application/json"
      );

      headers.set(
        "Content-Type",
        "application/json"
      );

      // Ngrok warning bypass
      headers.set(
        "ngrok-skip-browser-warning",
        "true"
      );

      return headers;
    },
  }),


  endpoints: (builder) => ({

    // Send OTP API
    sendLoginOtp: builder.mutation({

      query: (phone) => ({

        url: "/auth/login",

        method: "POST",

        body: {
          phone: phone,
        },

      }),


      transformResponse: (response) => {

        if (!response?.success) {
          return null;
        }

        return response;

      },

    }),



    // Verify OTP API
    verifyOtp: builder.mutation({

      query: ({
        phone,
        otp,
      }) => ({

        url: "/auth/verify-otp",

        method: "POST",

        body: {
          phone: phone,
          otp: otp,
        },

      }),


      transformResponse: (response) => {

        if (!response?.success) {
          return null;
        }

        return response;

      },

    }),


  }),

});


export const {
  useSendLoginOtpMutation,
  useVerifyOtpMutation,
} = loginApi;