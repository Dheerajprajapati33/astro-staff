import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  createApi,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";

import { BASE_URL } from "../config/api";


export const PanchangApi = createApi({

  reducerPath: "PanchangApi",


  baseQuery: fetchBaseQuery({

    baseUrl: `${BASE_URL}/api`,


    prepareHeaders: async(headers)=>{


      headers.set(
        "Accept",
        "application/json"
      );


      headers.set(
        "ngrok-skip-browser-warning",
        "true"
      );



      const userData =
      await AsyncStorage.getItem(
        "userData"
      );



      if(userData){


        const parsedUser =
        JSON.parse(userData);



        if(parsedUser?.token){


          headers.set(

            "Authorization",

            `Bearer ${parsedUser.token}`

          );


        }


      }



      return headers;


    },


  }),



  tagTypes:[

    "Panchang"

  ],




  endpoints:(builder)=>({



    // ==========================
    // GET DAILY PANCHANG
    // ==========================


    getPanchang:


    builder.mutation({


      query:(data)=>({


        url:"/tools/panchang",


        method:"POST",


        body:data,


      }),



      invalidatesTags:[

        "Panchang"

      ],



    }),



  }),



});





export const {


 useGetPanchangMutation,


}=PanchangApi;