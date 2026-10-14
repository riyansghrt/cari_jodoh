import React from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import Feather from "react-native-vector-icons/Feather";
import { Colors } from "./Colors";
import FocusStatusBar from "./FocusStatusBar";
export default function ScreenHeading({
  title,
  icon = "help-circle",
  onPress,
  label = "Bantuan",
}) {
  return (
    <View style={styles.row}>
      <FocusStatusBar />
      <Text accessibilityRole="header" style={styles.title}>
        {title}
      </Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label}
        style={styles.button}
        onPress={
          onPress ||
          (() =>
            Alert.alert(
              "Cari Jodoh",
              "Kirim love untuk menunjukkan ketertarikan. Chat tersedia setelah kalian saling love."
            ))
        }
      >
        <Feather name={icon} size={24} color={Colors.text} />
      </Pressable>
    </View>
  );
}
const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 12,
    gap: 12,
    backgroundColor: Colors.white,
  },
  title: { flex: 1, fontSize: 28, fontWeight: "700", color: Colors.text },
  button: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
});
