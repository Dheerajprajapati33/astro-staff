import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { BASE_URL as _BASE } from "../config/api";
const BASE_URL = `${_BASE}/api`;

const appendFileToFormData = (formData, key, file) => {
  if (!file) return;

  // Expo ImagePicker generally returns:
  // {
  //   uri: "file:///...",
  //   fileName: "image.jpg",
  //   mimeType: "image/jpeg"
  // }

  if (typeof file === "string") {
    const fileName = file.split("/").pop() || `${key}.jpg`;

    formData.append(key, {
      uri: file,
      name: fileName,
      type: "image/jpeg",
    });

    return;
  }

  if (file?.uri) {
    const fileName =
      file.fileName || file.name || file.uri.split("/").pop() || `${key}.jpg`;

    const fileType = file.mimeType || file.type || "image/jpeg";

    formData.append(key, {
      uri: file.uri,
      name: fileName,
      type: fileType,
    });
  }
};

export const registerApi = createApi({
  reducerPath: "registerApi",

  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,

    prepareHeaders: (headers) => {
      // Ngrok warning page bypass
      headers.set("ngrok-skip-browser-warning", "true");

      /*
        FormData ke case me Content-Type manually set mat karo.
        React Native automatically multipart boundary set karta hai.
      */

      return headers;
    },
  }),

  endpoints: (builder) => ({
    registerUser: builder.mutation({
      query: ({
        name,
        username,
        email,
        phone,
        role,
        experience,
        about,
        expertiseIds = [],
        languageIds = [],
        availability,
        profilePic,
        aadhaarFront,
        aadhaarBack,
        panFront,
      }) => {
        const formData = new FormData();

        formData.append("name", name || "");
        formData.append("username", username || "");
        formData.append("email", email || "");
        formData.append("phone", phone || "");
        formData.append("role", role || "astrologer");
        formData.append("experience", String(experience || ""));
        formData.append("about", about || "");
        formData.append("availability", availability || "");

        /*
          Backend ke hisaab se arrays usually in 3 formats me ja sakti hain:

          1. JSON string:
             expertiseIds: '["id1","id2"]'

          2. Repeated keys:
             expertiseIds=id1
             expertiseIds=id2

          3. expertiseIds[] keys

          Abhi JSON.stringify use kiya hai.
        */

        formData.append("expertiseIds", JSON.stringify(expertiseIds));

        formData.append("languageIds", JSON.stringify(languageIds));

        appendFileToFormData(formData, "profilePic", profilePic);
        appendFileToFormData(formData, "aadhaarFront", aadhaarFront);
        appendFileToFormData(formData, "aadhaarBack", aadhaarBack);
        appendFileToFormData(formData, "panFront", panFront);

        return {
          url: "/auth/register",
          method: "POST",
          body: formData,
        };
      },
    }),
  }),
});

export const { useRegisterUserMutation } = registerApi;
