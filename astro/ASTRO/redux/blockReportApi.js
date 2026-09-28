import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createApi,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";

import { BASE_URL } from "../config/api";

export const blockReportApi = createApi({
  reducerPath: "blockReportApi",

  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/api`,

    prepareHeaders: async (headers) => {
      headers.set(
        "Accept",
        "application/json",
      );

      headers.set(
        "Content-Type",
        "application/json",
      );

      headers.set(
        "ngrok-skip-browser-warning",
        "true",
      );

      const userData =
        await AsyncStorage.getItem(
          "userData",
        );

      if (userData) {
        const parsedUser =
          JSON.parse(userData);

        if (parsedUser?.token) {
          const token =
            parsedUser.token.startsWith(
              "Bearer ",
            )
              ? parsedUser.token
              : `Bearer ${parsedUser.token}`;

          headers.set(
            "Authorization",
            token,
          );
        }
      }

      return headers;
    },
  }),

  tagTypes: [
    "BlockStatus",
    "BlockedUsers",
    "Reports",
  ],

  endpoints: (builder) => ({
    // ==========================
    // BLOCK / UNBLOCK USER
    // ==========================

    toggleBlockUser:
      builder.mutation({
        query: ({
          targetUserId,
          reason,
        }) => ({
          url: "/block/toggle",
          method: "POST",

          body: {
            targetUserId,

            ...(reason
              ? {
                  reason,
                }
              : {}),
          },
        }),

        invalidatesTags: [
          "BlockStatus",
          "BlockedUsers",
        ],
      }),

    // ==========================
    // CHECK BLOCK STATUS
    // ==========================

    getBlockStatus:
      builder.query({
        query: (
          targetUserId,
        ) => ({
          url: `/block/status/${targetUserId}`,
          method: "GET",
        }),

        providesTags: (
          result,
          error,
          targetUserId,
        ) => [
          {
            type: "BlockStatus",
            id: targetUserId,
          },
        ],
      }),

    // ==========================
    // GET BLOCKED USERS
    // ==========================

    getBlockedUsers:
      builder.query({
        query: ({
          page = 1,
          limit = 20,
          search,
        } = {}) => ({
          url: "/block/list",
          method: "GET",
          params: {
            page,
            limit,
            ...(search ? { search } : {}),
          },
        }),

        providesTags: [
          "BlockedUsers",
        ],
      }),

    getReports:
      builder.query({
        query: ({
          page = 1,
          limit = 20,
        } = {}) => ({
          url: "/reports",
          method: "GET",
          params: {
            page,
            limit,
          },
        }),

        providesTags: [
          "Reports",
        ],
      }),

    // ==========================
    // REPORT USER
    // ==========================

    reportUser:
      builder.mutation({
        query: ({
          reportedUserId,
          reason,
          description,
        }) => ({
          url: "/reports",
          method: "POST",

          body: {
            reportedUserId,
            reason,

            ...(description
              ? {
                  description,
                }
              : {}),
          },
        }),

        invalidatesTags: [
          "Reports",
        ],
      }),
  }),
});

export const {
  useToggleBlockUserMutation,
  useGetBlockStatusQuery,
  useGetBlockedUsersQuery,
  useReportUserMutation,
  useGetReportsQuery,
} = blockReportApi;