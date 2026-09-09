import AsyncStorage from "@react-native-async-storage/async-storage";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { BASE_URL } from "../config/api";

export const notificationApi = createApi({
  reducerPath: "notificationApi",

  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/api`,

    prepareHeaders: async (headers) => {
      headers.set("Accept", "application/json");
      headers.set("ngrok-skip-browser-warning", "true");

      try {
        const userData = await AsyncStorage.getItem("userData");
        if (userData) {
          const parsedUser = JSON.parse(userData);
          if (parsedUser?.token) {
            const rawToken = parsedUser.token.startsWith("Bearer ")
              ? parsedUser.token
              : `Bearer ${parsedUser.token}`;
            headers.set("Authorization", rawToken);
          }
        }
      } catch (error) {
        console.log("[notificationApi] Error preparing headers:", error);
      }

      return headers;
    },
  }),

  tagTypes: ["Notifications"],

  endpoints: (builder) => ({
    
    // ==========================
    // GET NOTIFICATIONS LIST
    // ==========================
    getNotifications: builder.query({
      query: ({ page = 1, limit = 10 } = {}) => ({
        url: `/notifications/get?page=${page}&limit=${limit}`,
        method: "GET",
      }),
      providesTags: ["Notifications"],
    }),

    // ==========================
    // DELETE NOTIFICATION (Admin/User)
    // ==========================
    deleteNotification: builder.mutation({
      query: (id) => ({
        url: `/notifications/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Notifications"],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useLazyGetNotificationsQuery,
  useDeleteNotificationMutation,
} = notificationApi;
