import AsyncStorage from "@react-native-async-storage/async-storage";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../config/api";

export const updateApi = createApi({
  reducerPath: "updateApi",

  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/api`,

    prepareHeaders: async (headers) => {
      headers.set("Accept", "application/json");
      headers.set("ngrok-skip-browser-warning", "true");

      try {
        const savedUserData = await AsyncStorage.getItem("userData");

        if (savedUserData) {
          const parsedUserData = JSON.parse(savedUserData);

          if (parsedUserData?.token) {
            headers.set("Authorization", `Bearer ${parsedUserData.token}`);
          }
        }
      } catch (error) {
        console.log("Token read error:", error);
      }

      return headers;
    },
  }),

  tagTypes: ["Profile"],

  endpoints: (builder) => ({
    // Get logged-in user profile
    getProfile: builder.query({
      query: () => ({
        url: "/users/get-profile",
        method: "GET",
      }),

      providesTags: ["Profile"],
    }),

    // Update logged-in user profile
    updateProfile: builder.mutation({
      query: (formData) => ({
        url: "/users/update-profile",
        method: "PATCH",
        body: formData,
      }),

      invalidatesTags: ["Profile"],
    }),
  }),
});

export const {
  useGetProfileQuery,
  useLazyGetProfileQuery,
  useUpdateProfileMutation,
} = updateApi;
