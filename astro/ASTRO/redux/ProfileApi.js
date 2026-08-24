import AsyncStorage from "@react-native-async-storage/async-storage";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { BASE_URL } from "../config/api";

export const profileApi = createApi({
  reducerPath: "profileApi",

  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/api`,

    prepareHeaders: async (headers) => {
      headers.set("Accept", "application/json");

      headers.set("ngrok-skip-browser-warning", "true");

      const userData = await AsyncStorage.getItem("userData");

      if (userData) {
        const parsed = JSON.parse(userData);

        if (parsed?.token) {
          headers.set("Authorization", `Bearer ${parsed.token}`);
        }
      }

      return headers;
    },
  }),

  tagTypes: ["Profile"],

  endpoints: (builder) => ({
    // GET PROFILE USING TOKEN

    getProfile: builder.query({
      query: () => ({
        url: "/users/get-profile",

        method: "GET",
      }),

      transformResponse: (response) => {
        if (!response?.success) {
          return null;
        }

        return response?.data ?? null;
      },

      providesTags: ["Profile"],
    }),

    // UPDATE PROFILE

    updateProfile: builder.mutation({
      query: ({ userId, profilePic, ...profileData }) => {
        const formData = new FormData();

        Object.entries(profileData).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            formData.append(key, String(value));
          }
        });

        if (profilePic?.uri) {
          formData.append("profilePic", {
            uri: profilePic.uri,

            name: profilePic.name || "profile.jpg",

            type: profilePic.type || "image/jpeg",
          });
        }

        return {
          url: "/users/update-profile",

          method: "PATCH",

          body: formData,
        };
      },

      transformResponse: (response) => {
        if (!response?.success) {
          return null;
        }

        return response.data;
      },

      invalidatesTags: ["Profile"],
    }),
  }),
});

export const {
  useGetProfileQuery,

  useUpdateProfileMutation,
} = profileApi;
