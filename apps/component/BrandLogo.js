import React from "react";
import { Image } from "react-native";

export default function BrandLogo({ size = 32 }) {
  return (
    <Image
      accessibilityLabel="Logo Cari Jodoh"
      source={require("../../assets/icon/logocarijodoh.png")}
      resizeMode="contain"
      style={{ width: size, height: size }}
    />
  );
}
