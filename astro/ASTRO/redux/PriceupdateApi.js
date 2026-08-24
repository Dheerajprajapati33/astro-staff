import AsyncStorage from "@react-native-async-storage/async-storage";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { BASE_URL } from "../config/api";

export const priceUpdateApi = createApi({
  reducerPath: "priceUpdateApi",

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

  tagTypes: ["PriceUpdate"],

  endpoints: (builder) => ({
    updateConsultationPrice: builder.mutation({
      query: ({
        type,

        requestedPrice,
      }) => ({
        url: "/users/consultation-price",

        method: "POST",

        body: {
          type,

          requestedPrice,
        },
      }),

      transformResponse: (response) => {
        if (!response?.success) {
          return null;
        }

        return response.data;
      },

      invalidatesTags: ["PriceUpdate"],
    }),
  }),
});

export const { useUpdateConsultationPriceMutation } = priceUpdateApi;
