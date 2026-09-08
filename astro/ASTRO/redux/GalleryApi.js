import AsyncStorage from "@react-native-async-storage/async-storage";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { BASE_URL as _BASE } from "../config/api";
const BASE_URL = `${_BASE}/api`;

export const galleryApi = createApi({
  reducerPath: "galleryApi",

  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,

    prepareHeaders: async (headers) => {
      headers.set("Accept", "application/json");

      headers.set("ngrok-skip-browser-warning", "true");

      const userData = await AsyncStorage.getItem("userData");

      if (userData) {
        const user = JSON.parse(userData);

        if (user?.token) {
          headers.set("Authorization", `Bearer ${user.token}`);
        }
      }

      return headers;
    },
  }),

  tagTypes: ["Gallery"],

  endpoints: (builder) => ({
    // Upload Gallery Images
    uploadGallery: builder.mutation({
      query: (images) => {
        const formData = new FormData();

        images.forEach((image, index) => {
          formData.append("images", {
            uri: image.uri,
            name: image.fileName || `gallery_${index}.jpg`,
            type: image.mimeType || "image/jpeg",
          });
        });

        return {
          url: "/gallery/upload",
          method: "POST",
          body: formData,
        };
      },

      transformResponse: (response) => {
        if (!response?.success) {
          return [];
        }

        return response?.data || [];
      },

      invalidatesTags: ["Gallery"],
    }),

    // Get Gallery Data
    getGallery: builder.query({
      query: (params) => {
        let url = "/gallery/get-gallery";
        if (params) {
          const queryParams = new URLSearchParams();
          if (params.astrologerId)
            queryParams.append("astrologerId", params.astrologerId);
          if (params.page) queryParams.append("page", params.page);
          if (params.limit) queryParams.append("limit", params.limit);
          const queryString = queryParams.toString();
          if (queryString) {
            url += `?${queryString}`;
          }
        }

        return {
          url,
          method: "GET",
        };
      },

      transformResponse: (response) => {
        if (!response?.success) {
          return null;
        }

        return response?.data || null;
      },

      providesTags: ["Gallery"],
    }),

    // Delete Gallery Photo
    deleteGallery: builder.mutation({
      query: (photoId) => ({
        url: `/gallery/${photoId}/delete`,
        method: "DELETE",
      }),

      transformResponse: (response) => {
        if (!response?.success) {
          return null;
        }

        return response?.data || response;
      },

      invalidatesTags: ["Gallery"],
    }),

    // Reorder Gallery Images
    reorderGallery: builder.mutation({
      query: (body) => ({
        url: "/gallery/reorder",
        method: "PATCH",
        body,
      }),

      transformResponse: (response) => {
        if (!response?.success) {
          return null;
        }

        return response?.data || response;
      },

      invalidatesTags: ["Gallery"],
    }),
  }),
});

export const {
  useUploadGalleryMutation,
  useGetGalleryQuery,
  useDeleteGalleryMutation,
  useReorderGalleryMutation,
} = galleryApi;
