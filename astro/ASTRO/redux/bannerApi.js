import AsyncStorage from "@react-native-async-storage/async-storage";

import { BASE_URL } from "../config/api";

export const getBanners = async () => {
  try {
    const userData = await AsyncStorage.getItem("userData");

    let token = null;

    if (userData) {
      const parsedUser = JSON.parse(userData);

      token = parsedUser?.token;
    }

    const response = await fetch(`${BASE_URL}/api/banners/get`, {
      method: "GET",

      headers: {
        Authorization: `Bearer ${token}`,

        "Content-Type": "application/json",

        "ngrok-skip-browser-warning": "true",
      },
    });

    const result = await response.json();

    console.log("BANNER RESPONSE:", result);

    if (result.success) {
       return (result.data || []).map((item) => {
         const rawImg = item?.image || item?.imageUrl || "";
         const cleanImg = rawImg.replace(/^\/+/, "");
         const imageUrl = rawImg.startsWith("http")
           ? rawImg
           : `${BASE_URL}/${cleanImg}`;
         return {
           ...item,
           imageUrl,
         };
       });
     }

    return [];
  } catch (error) {
    console.log("Banner API Error:", error);

    return [];
  }
};
