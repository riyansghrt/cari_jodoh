import React from "react";
import { StyleSheet, Text, View } from "react-native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

export default function PremiumBadge({ premium, compact = false }) {
  if (!premium) return null;
  return (
    <View
      accessible
      accessibilityLabel="Pengguna premium"
      style={[styles.badge, compact && styles.compact]}
    >
      <FontAwesome5
        name="crown"
        solid
        size={compact ? 13 : 12}
        color="#80580B"
      />
      {!compact && <Text style={styles.text}>Premium</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#FFE7A2",
    borderColor: "#E8C66D",
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 10,
    minHeight: 28,
    alignSelf: "flex-start",
  },
  compact: {
    width: 28,
    height: 28,
    paddingHorizontal: 0,
    justifyContent: "center",
    alignSelf: "center",
  },
  text: { fontSize: 11, fontWeight: "700", color: "#80580B" },
});
