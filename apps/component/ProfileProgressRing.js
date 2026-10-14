import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Colors } from "./Colors";

const size = 100;
export default function ProfileProgressRing({ percentage, children }) {
  const progress = Math.max(
    0,
    Math.min(100, Number.isFinite(percentage) ? percentage : 0)
  );
  return (
    <View
      style={styles.wrapper}
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel="Kelengkapan profil"
      accessibilityValue={{
        min: 0,
        max: 100,
        now: progress,
        text: `${progress}% lengkap`,
      }}
    >
      <View style={[styles.track, progress === 100 && styles.complete]} />
      {progress > 0 &&
        progress < 100 &&
        Array.from({ length: Math.ceil(progress * 3.6) }, (_, index) => {
          const angle = (index * Math.PI) / 180;
          return (
            <View
              key={index}
              testID={`progress-segment-${index}`}
              pointerEvents="none"
              collapsable={false}
              style={[
                styles.segment,
                {
                  left: size / 2 + (size / 2 - 1.5) * Math.sin(angle) - 1.5,
                  top: size / 2 - (size / 2 - 1.5) * Math.cos(angle) - 1.5,
                },
              ]}
            />
          );
        })}
      <View style={styles.avatar}>{children}</View>
      <View style={[styles.badge, progress === 100 && styles.completeBadge]}>
        <Text style={styles.percent}>{progress}%</Text>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  wrapper: { width: size, height: size + 10 },
  track: {
    width: size,
    height: size,
    borderRadius: size / 2,
    borderWidth: 3,
    borderColor: Colors.border,
  },
  complete: { borderColor: Colors.main },
  // Overlapping dots avoid Android's inconsistent clipped, multicolor rounded borders.
  segment: {
    position: "absolute",
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: Colors.main,
  },
  avatar: {
    position: "absolute",
    top: 6,
    left: 6,
    width: size - 12,
    height: size - 12,
    borderRadius: (size - 12) / 2,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  badge: {
    position: "absolute",
    bottom: 0,
    alignSelf: "center",
    minWidth: 46,
    height: 24,
    paddingHorizontal: 7,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.white,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  completeBadge: { backgroundColor: Colors.main },
  percent: { color: Colors.white, fontSize: 10, fontWeight: "700" },
});
