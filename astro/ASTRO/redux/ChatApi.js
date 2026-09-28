import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "../config/api";

// NOTE:
// There are TWO independent chat systems:
//
// 1. /consultation + socket events
//    Paid, timed consultation chat.
//
// 2. /chat/rooms* REST
//    Persistent user <-> astrologer chat.
//
// Existing chat architecture remains unchanged.
// Only delete message API has been added.

const LOG_TAG = "[ChatApi]";

export const chatApi = createApi({
  reducerPath: "chatApi",

  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/api`,

    prepareHeaders: async (headers) => {
      headers.set("Accept", "application/json");
      headers.set("Content-Type", "application/json");
      headers.set(
        "ngrok-skip-browser-warning",
        "true",
      );

      const userData =
        await AsyncStorage.getItem("userData");

      let tokenPresent = false;

      if (userData) {
        const parsedUser =
          JSON.parse(userData);

        if (parsedUser?.token) {
          const token =
            parsedUser.token.startsWith("Bearer ")
              ? parsedUser.token
              : `Bearer ${parsedUser.token}`;

          headers.set(
            "Authorization",
            token,
          );

          tokenPresent = true;
        }
      }

      console.log(
        LOG_TAG,
        "prepareHeaders: tokenPresent =",
        tokenPresent,
      );

      return headers;
    },
  }),

  tagTypes: [
    "ChatMessages",
    "ChatRooms",
    "ConsultationHistory",
  ],

  endpoints: (builder) => ({
    // ==========================
    // GET CHAT ROOMS
    // ==========================

    getChatRooms: builder.query({
      query: () => {
        console.log(
          LOG_TAG,
          "getChatRooms request",
        );

        return {
          url: "/chat/rooms",
          method: "GET",
        };
      },

      transformResponse: (response) => {
        console.log(
          LOG_TAG,
          "getChatRooms RAW response:",
          JSON.stringify(response),
        );

        if (!response?.success) {
          return [];
        }

        return response?.data ?? [];
      },

      transformErrorResponse: (error) => {
        console.log(
          LOG_TAG,
          "getChatRooms ERROR response:",
          JSON.stringify(error),
        );

        return error;
      },

      providesTags: (result) =>
        result
          ? [
              ...result.map((room) => ({
                type: "ChatRooms",
                id: room.id,
              })),

              {
                type: "ChatRooms",
                id: "LIST",
              },
            ]
          : [
              {
                type: "ChatRooms",
                id: "LIST",
              },
            ],
    }),

    // ==========================
    // GET CHAT MESSAGES
    // ==========================

    getChatMessages: builder.query({
      query: ({
        roomId,
        page = 1,
        limit = 50,
      }) => {
        console.log(
          LOG_TAG,
          "getChatMessages request:",
          {
            roomId,
            page,
            limit,
          },
        );

        return {
          url: `/chat/rooms/${roomId}/messages`,
          method: "GET",
          params: {
            page,
            limit,
          },
        };
      },

      transformResponse: (response) => {
        console.log(
          LOG_TAG,
          "getChatMessages RAW response:",
          JSON.stringify(response),
        );

        if (!response?.success) {
          return {
            messages: [],
            pagination: null,
          };
        }

        return {
          messages:
            response?.data?.messages ?? [],

          pagination:
            response?.data?.pagination ??
            null,
        };
      },

      transformErrorResponse: (error) => {
        console.log(
          LOG_TAG,
          "getChatMessages ERROR response:",
          JSON.stringify(error),
        );

        return error;
      },

      providesTags: (
        result,
        error,
        { roomId },
      ) => [
        {
          type: "ChatMessages",
          id: roomId,
        },
      ],
    }),

    // ==========================
    // SEND CHAT MESSAGE
    // ==========================

    sendChatMessage: builder.mutation({
      query: ({
        roomId,
        message,
        messageType = "TEXT",
        metadata,
      }) => {
        console.log(
          LOG_TAG,
          "sendChatMessage request:",
          {
            roomId,
            message,
            messageType,
          },
        );

        return {
          url: `/chat/rooms/${roomId}/messages`,
          method: "POST",

          body: {
            message,
            messageType,
            metadata,
          },
        };
      },

      transformResponse: (response) => {
        console.log(
          LOG_TAG,
          "sendChatMessage RAW response:",
          JSON.stringify(response),
        );

        if (!response?.success) {
          return null;
        }

        return response?.data ?? null;
      },

      transformErrorResponse: (error) => {
        console.log(
          LOG_TAG,
          "sendChatMessage ERROR response:",
          JSON.stringify(error),
        );

        return error;
      },

      invalidatesTags: (
        result,
        error,
        { roomId },
      ) => [
        {
          type: "ChatMessages",
          id: roomId,
        },

        {
          type: "ChatRooms",
          id: roomId,
        },

        {
          type: "ChatRooms",
          id: "LIST",
        },
      ],
    }),

    // ==========================
    // DELETE CHAT MESSAGE
    // ==========================

    deleteChatMessage: builder.mutation({
      query: ({
        messageId,
        deleteType = "me",
      }) => {
        console.log(
          LOG_TAG,
          "deleteChatMessage request:",
          {
            messageId,
            deleteType,
          },
        );

        return {
          url: `/chat/messages/${messageId}`,
          method: "DELETE",

          body: {
            deleteType,
          },
        };
      },

      transformResponse: (response) => {
        console.log(
          LOG_TAG,
          "deleteChatMessage RAW response:",
          JSON.stringify(response),
        );

        return response;
      },

      transformErrorResponse: (error) => {
        console.log(
          LOG_TAG,
          "deleteChatMessage ERROR response:",
          JSON.stringify(error),
        );

        return error;
      },

      invalidatesTags: [
        "ChatMessages",
        "ChatRooms",
      ],
    }),

    // ==========================
    // MARK ROOM READ
    // ==========================

    markRoomRead: builder.mutation({
      query: (roomId) => {
        console.log(
          LOG_TAG,
          "markRoomRead request:",
          roomId,
        );

        return {
          url: `/chat/rooms/${roomId}/read`,
          method: "POST",
        };
      },

      transformErrorResponse: (error) => {
        console.log(
          LOG_TAG,
          "markRoomRead ERROR response:",
          JSON.stringify(error),
        );

        return error;
      },

      invalidatesTags: (
        result,
        error,
        roomId,
      ) => [
        {
          type: "ChatRooms",
          id: roomId,
        },

        {
          type: "ChatRooms",
          id: "LIST",
        },
      ],
    }),

    // ==========================
    // CONSULTATION HISTORY
    // ==========================

    getConsultationHistory: builder.query({
      query: ({
        page = 1,
        limit = 20,
        type,
        status,
      } = {}) => {
        const params = {
          page,
          limit,
        };

        if (type) {
          params.type = type;
        }

        if (status) {
          params.status = status;
        }

        console.log(
          LOG_TAG,
          "getConsultationHistory request params:",
          params,
        );

        return {
          url: "/consultation/history",
          method: "GET",
          params,
        };
      },

      transformResponse: (response) => {
        console.log(
          LOG_TAG,
          "getConsultationHistory RAW response:",
          JSON.stringify(response),
        );

        if (!response?.success) {
          return {
            consultations: [],
            pagination: null,
          };
        }

        return {
          consultations:
            response?.data?.consultations ??
            [],

          pagination:
            response?.data?.pagination ??
            null,
        };
      },

      transformErrorResponse: (error) => {
        console.log(
          LOG_TAG,
          "getConsultationHistory ERROR response:",
          JSON.stringify(error),
        );

        return error;
      },

      providesTags: [
        "ConsultationHistory",
      ],
    }),

    // ==========================
    // GET CALL TOKEN
    // ==========================

    getCallToken: builder.mutation({
      query: (params) => {
        const consultationId =
          typeof params === "object"
            ? params.consultationId
            : params;

        const body =
          typeof params === "object"
            ? {
                uid: params.uid,
                role: params.role,
              }
            : undefined;

        return {
          url: `/consultation/token/${consultationId}`,
          method: "POST",
          body,
        };
      },
    }),
  }),
});

export const {
  useGetChatRoomsQuery,
  useGetChatMessagesQuery,
  useLazyGetChatMessagesQuery,
  useSendChatMessageMutation,
  useDeleteChatMessageMutation,
  useMarkRoomReadMutation,
  useGetConsultationHistoryQuery,
  useGetCallTokenMutation,
} = chatApi;