import React from "react";
import { Redirect } from "expo-router";

const Love = () => {
  return (
    <Redirect href={{ pathname: "/(tabs)", params: { category: "Love" } }} />
  );
};

export default Love;
