import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { BASE_URL as _BASE } from "../config/api";
const BASE_URL = `${_BASE}/api`;


export const contentApi = createApi({

  reducerPath:"contentApi",


  baseQuery:fetchBaseQuery({

    baseUrl:BASE_URL,

    prepareHeaders:(headers)=>{

      headers.set(
        "Accept",
        "application/json"
      );

      headers.set(
        "ngrok-skip-browser-warning",
        "true"
      );

      return headers;

    }

  }),


  endpoints:(builder)=>({

    getContent:builder.query({

      query:(type)=>({

        url:`/content/get/${type}`,

        method:"GET",

      }),


      transformResponse:(response)=>{

        if(!response?.success){

          return null;

        }

        return response.data;

      },


    }),


  }),


});



export const {
  useGetContentQuery
}=contentApi;