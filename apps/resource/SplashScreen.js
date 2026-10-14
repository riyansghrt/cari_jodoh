import React, { useEffect } from "react";
import { StatusBar, StyleSheet, Text, View } from "react-native";
import BrandLogo from "../component/BrandLogo";
import { Colors } from "../component/Colors";

export default function SplashScreen({ navigation }) {
  useEffect(() => {
    if (!navigation) return;
    const timer = setTimeout(() => navigation.replace("MainTabs"), 1600);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <View style={styles.brand}>
        <View style={styles.mark}>
          <BrandLogo size={144} />
        </View>
        <Text style={styles.title}>Cari Jodoh</Text>
        <Text style={styles.subtitle}>
          Kenal lebih dekat. Temukan yang sejalan.
        </Text>
      </View>
      <Text style={styles.footer}>AWAL DARI CERITA KITA</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  title: {
    color: Colors.text,
    fontSize: 36,
    fontWeight: "700",
    textAlign: "center",
  },
  brand: { alignItems: "center", width: "100%", maxWidth: 360 },
  mark: {
    width: 144,
    height: 144,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  subtitle: {
    color: Colors.grey,
    fontSize: 14,
    lineHeight: 22,
    textAlign: "center",
    marginTop: 12,
  },
  footer: {
    color: Colors.grey,
    fontSize: 11,
    textAlign: "center",
    marginTop: 48,
  },
});
