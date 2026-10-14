import React from "react";
import { StatusBar } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import { Colors } from "./Colors";

export default function FocusStatusBar({ light = false }) {
  const focused = useIsFocused();
  return focused ? (
    <StatusBar
      translucent={light}
      backgroundColor={light ? "transparent" : Colors.white}
      barStyle={light ? "light-content" : "dark-content"}
    />
  ) : null;
}
