import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "../config/api";

// NOTE (verified live against the backend on 2026-08-12): there are TWO
// separate, independent chat systems on this backend:
//
// 1. `/consultation` + socket events (join_chat_session/send_chat_message/
//    end_chat_session) - paid, timed, ephemeral-per-session. Matches
//    `3_chat_consultation_integration_guide.md`. Fully live-tested earlier.
//
// 2. `/chat/rooms*` REST - persistent, one room per user<->astrologer pair
//    (POST /chat/rooms is idempotent: same pair always returns the same
//    room). This is what's actually populated with real usage data. All
//    endpoints below are confirmed working live with real accounts/rooms:
//      GET  /chat/rooms                  -> list of rooms with lastMessage/unread counts
//      GET  /chat/rooms/:roomId/messages -> real message history
//      POST /chat/rooms/:roomId/messages -> send (201, persists immediately)
//      POST /chat/rooms/:roomId/read     -> marks room read
//
// The astrologer app's chat screen is built on system #2 per product
// decision (system #2 has the real conversation data). System #2's
// real-time PUSH event name is NOT yet confirmed - no astrologer-side
// socket was available to observe it live. sendMessage is REST (proven),
// getChatMessages is polled from the chat screen as a safety net until the
// real push event is confirmed - see chat.js's onAny debug tap.

const LOG_TAG = "[ChatApi]";

export const chatApi = createApi({
  reducerPath: "chatApi",

  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/api`,
    prepareHeaders: async (headers) => {
      headers.set("Accept", "application/json");
      headers.set("Content-Type", "application/json");
      headers.set("ngrok-skip-browser-warning", "true");

      const userData = await AsyncStorage.getItem("userData");
      let tokenPresent = false;
      if (userData) {
        const parsedUser = JSON.parse(userData);
        if (parsedUser?.token) {
          headers.set("Authorization", `Bearer ${parsedUser.token}`);
          tokenPresent = true;
        }
      }

      console.log(LOG_TAG, "prepareHeaders: tokenPresent =", tokenPresent);

      return headers;
    },
  }),

  tagTypes: ["ChatMessages", "ChatRooms", "ConsultationHistory"],

  endpoints: (builder) => ({
    getChatRooms: builder.query({
      query: () => {
        console.log(LOG_TAG, "getChatRooms request");

        return { url: `/chat/rooms`, method: "GET" };
      },

      transformResponse: (response) => {
        console.log(LOG_TAG, "getChatRooms RAW response:", JSON.stringify(response));

        if (!response?.success) return [];
        return response?.data ?? [];
      },

      transformErrorResponse: (error) => {
        console.log(LOG_TAG, "getChatRooms ERROR response:", JSON.stringify(error));
        return error;
      },

      providesTags: (result) =>
        result
          ? [
              ...result.map((room) => ({ type: "ChatRooms", id: room.id })),
              { type: "ChatRooms", id: "LIST" },
            ]
          : [{ type: "ChatRooms", id: "LIST" }],
    }),

    getChatMessages: builder.query({
      query: ({ roomId, page = 1, limit = 50 }) => {
        console.log(LOG_TAG, "getChatMessages request:", { roomId, page, limit });

        return {
          url: `/chat/rooms/${roomId}/messages`,
          method: "GET",
          params: { page, limit },
        };
      },

      transformResponse: (response) => {
        console.log(LOG_TAG, "getChatMessages RAW response:", JSON.stringify(response));

        if (!response?.success) return { messages: [], pagination: null };
        return {
          messages: response?.data?.messages ?? [],
          pagination: response?.data?.pagination ?? null,
        };
      },

      transformErrorResponse: (error) => {
        console.log(LOG_TAG, "getChatMessages ERROR response:", JSON.stringify(error));
        return error;
      },

      providesTags: (result, error, { roomId }) => [
        { type: "ChatMessages", id: roomId },
      ],
    }),

    sendChatMessage: builder.mutation({
      query: ({ roomId, message, messageType = "TEXT", metadata }) => {
        console.log(LOG_TAG, "sendChatMessage request:", { roomId, message, messageType });

        return {
          url: `/chat/rooms/${roomId}/messages`,
          method: "POST",
          body: { message, messageType, metadata },
        };
      },

      transformResponse: (response) => {
        console.log(LOG_TAG, "sendChatMessage RAW response:", JSON.stringify(response));

        if (!response?.success) return null;
        return response?.data ?? null;
      },

      transformErrorResponse: (error) => {
        console.log(LOG_TAG, "sendChatMessage ERROR response:", JSON.stringify(error));
        return error;
      },

      invalidatesTags: (result, error, { roomId }) => [
        { type: "ChatMessages", id: roomId },
        { type: "ChatRooms", id: roomId },
        { type: "ChatRooms", id: "LIST" },
      ],
    }),

    markRoomRead: builder.mutation({
      query: (roomId) => {
        console.log(LOG_TAG, "markRoomRead request:", roomId);

        return { url: `/chat/rooms/${roomId}/read`, method: "POST" };
      },

      transformErrorResponse: (error) => {
        console.log(LOG_TAG, "markRoomRead ERROR response:", JSON.stringify(error));
        return error;
      },

      invalidatesTags: (result, error, roomId) => [
        { type: "ChatRooms", id: roomId },
        { type: "ChatRooms", id: "LIST" },
      ],
    }),

    // Kept for the paid consultation flow (waiting-request polling in
    // ChatRequestProvider.js) - separate system, see note at top of file.
    getConsultationHistory: builder.query({
      query: ({ page = 1, limit = 20, type, status } = {}) => {
        const params = { page, limit };
        if (type) params.type = type;
        if (status) params.status = status;

        console.log(LOG_TAG, "getConsultationHistory request params:", params);

        return {
          url: `/consultation/history`,
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
          return { consultations: [], pagination: null };
        }

        return {
          consultations: response?.data?.consultations ?? [],
          pagination: response?.data?.pagination ?? null,
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

      providesTags: ["ConsultationHistory"],
    }),

    // ==========================
    // GET CALL TOKEN (Agora RTC Host Token)
    // ==========================
    getCallToken: builder.mutation({
      query: (consultationId) => ({
        url: `/consultation/token/${consultationId}`,
        method: "POST",
      }),
    }),
  }),
});

export const {
  useGetChatRoomsQuery,
  useGetChatMessagesQuery,
  useLazyGetChatMessagesQuery,
  useSendChatMessageMutation,
  useMarkRoomReadMutation,
  useGetConsultationHistoryQuery,
  useGetCallTokenMutation,
} = chatApi;
