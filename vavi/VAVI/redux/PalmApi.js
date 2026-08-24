import AsyncStorage from "@react-native-async-storage/async-storage";

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { BASE_URL } from "../config/api";

export const PalmApi = createApi({
  reducerPath: "PalmApi",

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

  tagTypes: ["Palm"],

  endpoints: (builder) => ({
    // ==========================
    // PALM SCAN API
    // ==========================

    scanPalm: builder.mutation({
      query: (image) => {
        const formData = new FormData();

        formData.append("palmImage", {
          uri: image.uri,

          type: image.type || "image/jpeg",

          name: image.fileName || "palmImage.jpg",
        });

        return {
          url: "/tools/palm/scan",

          method: "POST",

          body: formData,
        };
      },

      invalidatesTags: ["Palm"],
    }),
  }),
});

export const { useScanPalmMutation } = PalmApi;
