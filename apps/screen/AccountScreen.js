import React, { useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import Feather from "react-native-vector-icons/Feather";
import { Colors } from "../component/Colors";
import { useMatches } from "../state/MatchContext";
import { premiumBenefits } from "../data/premium";
import FocusStatusBar from "../component/FocusStatusBar";
import ProfileProgressRing from "../component/ProfileProgressRing";
import { getProfileCompletion } from "../data/profileCompletion";

export default function AccountScreen({ navigation }) {
  const {
    resetSession,
    ownProfile: profile,
    privateProfile,
    subscription,
  } = useMatches();
  const completion = getProfileCompletion(profile, privateProfile);
  useFocusEffect(
    React.useCallback(() => {
      StatusBar.setBarStyle("dark-content");
    }, [])
  );
  const [section, setSection] = useState("Paket");
  const edit = () => navigation.navigate("EditProfileScreen");
  return (
    <SafeAreaView edges={["top", "left", "right"]} style={styles.container}>
      <FocusStatusBar />
      <View style={styles.heading}>
        <Text accessibilityRole="header" style={styles.title}>
          Profil
        </Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Bantuan profil"
          style={styles.close}
          onPress={() =>
            Alert.alert(
              "Profil kamu",
              "Lengkapi nama, domisili, dan cerita tentang dirimu. Bagikan informasi pribadi hanya dengan orang yang kamu percaya."
            )
          }
        >
          <Feather name="help-circle" size={24} color={Colors.text} />
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Pengaturan profil"
          style={styles.close}
          onPress={() =>
            Alert.alert("Pengaturan profil", "Akun demo Cari Jodoh", [
              { text: "Edit profil", onPress: edit },
              { text: "Tutup", style: "cancel" },
            ])
          }
        >
          <Feather name="settings" size={24} color={Colors.text} />
        </Pressable>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.identity}>
          <ProfileProgressRing percentage={completion.percentage}>
            <View style={styles.avatar}>
              <Feather name="user" size={38} color={Colors.text} />
            </View>
          </ProfileProgressRing>
          <View style={styles.profileCopy}>
            <Text style={styles.name}>{profile.name}</Text>
            <Text style={styles.username}>
              {profile.city} /{" "}
              {subscription
                ? subscription.tier === "plus"
                  ? "Premium+ demo"
                  : "Premium demo"
                : "Akun gratis"}
            </Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Edit profil"
              onPress={edit}
              style={styles.editButton}
            >
              <Feather name="edit-2" size={16} color={Colors.text} />
              <Text style={styles.editText}>Edit profil</Text>
            </Pressable>
          </View>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.sections}
        >
          {["Paket", "Insight foto", "Keamanan"].map((value) => (
            <Pressable
              key={value}
              accessibilityRole="tab"
              accessibilityLabel={`Profil ${value}`}
              accessibilityState={{ selected: section === value }}
              onPress={() => setSection(value)}
              style={[
                styles.sectionTab,
                section === value && styles.sectionActive,
              ]}
            >
              <Text
                style={[
                  styles.sectionText,
                  section === value && styles.sectionActiveText,
                ]}
              >
                {value}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
        {section === "Paket" ? (
          <>
            <View style={styles.boosts}>
              {[
                { title: "Spotlight", icon: "zap" },
                { title: "Super Love", icon: "star" },
              ].map((item) => (
                <Pressable
                  key={item.title}
                  accessibilityRole="button"
                  accessibilityLabel={item.title}
                  onPress={() =>
                    Alert.alert(
                      item.title,
                      "Fitur ini tersedia sebagai pratinjau paket. Belum ada pembelian atau pengiriman boost.",
                      [
                        { text: "Tutup", style: "cancel" },
                        {
                          text: "Lihat paket",
                          onPress: () =>
                            navigation.navigate("PremiumScreen", {
                              tier: "plus",
                            }),
                        },
                      ]
                    )
                  }
                  style={styles.boost}
                >
                  <Feather name={item.icon} size={24} color={Colors.text} />
                  <Text style={styles.boostTitle}>{item.title}</Text>
                </Pressable>
              ))}
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.offers}
            >
              {[
                {
                  tier: "plus",
                  title: "PREMIUM+",
                  copy: "Lebih menonjol. Lebih banyak kesempatan untuk terhubung.",
                },
                {
                  tier: "premium",
                  title: "PREMIUM",
                  copy: "Temukan yang menyukaimu dan cerita yang lebih sejalan.",
                },
              ].map((item) => (
                <View
                  key={item.tier}
                  style={[
                    styles.offer,
                    item.tier === "plus" && styles.offerPlus,
                  ]}
                >
                  <Text style={styles.offerTitle}>{item.title}</Text>
                  <Text style={styles.offerCopy}>{item.copy}</Text>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={`Jelajahi ${item.title}`}
                    onPress={() =>
                      navigation.navigate("PremiumScreen", { tier: item.tier })
                    }
                    style={styles.offerButton}
                  >
                    <Text style={styles.offerButtonText}>
                      Jelajahi{" "}
                      {item.title === "PREMIUM+" ? "Premium+" : "Premium"}
                    </Text>
                  </Pressable>
                </View>
              ))}
            </ScrollView>
            <View style={styles.comparisonHeading}>
              <Text style={[styles.label, styles.comparisonCopy]}>
                Manfaat paket
              </Text>
              <Text style={styles.comparisonLabel}>Plus</Text>
              <Text style={styles.comparisonLabel}>Premium</Text>
            </View>
            {premiumBenefits.map((item) => (
              <View key={item.title} style={styles.comparisonRow}>
                <Text style={[styles.bio, styles.comparisonCopy]}>
                  {item.title}
                </Text>
                <View style={styles.comparisonCell}>
                  <Feather name="check" size={20} color={Colors.text} />
                </View>
                <View style={styles.comparisonCell}>
                  <Feather
                    name={item.plusOnly ? "minus" : "check"}
                    size={20}
                    color={item.plusOnly ? Colors.border : Colors.text}
                  />
                </View>
              </View>
            ))}
            <Text style={styles.demoNote}>
              Pratinjau paket. Pembayaran belum tersedia.
            </Text>
          </>
        ) : section === "Insight foto" ? (
          <View style={styles.insights}>
            <Feather name="bar-chart-2" size={42} color={Colors.text} />
            <Text style={styles.insightTitle}>Foto yang bercerita</Text>
            <Text style={styles.bio}>Belum ada insight foto untuk akunmu.</Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Lihat paket insight"
              onPress={() =>
                navigation.navigate("PremiumScreen", { tier: "plus" })
              }
              style={styles.editButton}
            >
              <Text style={styles.editText}>Lihat Premium+</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.insights}>
            <Feather name="shield" size={42} color={Colors.text} />
            <Text style={styles.insightTitle}>Kenalan dengan nyaman</Text>
            <Text style={styles.bio}>
              Jaga data pribadimu, hindari mengirim uang, dan pilih tempat umum
              untuk pertemuan pertama.
            </Text>
            <Text style={styles.bio}>
              Chat hanya terbuka setelah kalian saling love.
            </Text>
          </View>
        )}
        <View style={styles.section}>
          <Text style={styles.label}>Tentang aku</Text>
          <Text style={styles.bio}>{profile.bio || "Belum ada cerita."}</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.label}>Tujuan hubungan</Text>
          <View style={styles.intent}>
            <Feather name="heart" size={18} color={Colors.main} />
            <Text style={styles.bio}>Hubungan serius</Text>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.label}>Minat & komunitas</Text>
          <Text style={styles.bio}>{profile.interests.join(" / ")}</Text>
          <Text style={styles.subtitle}>{profile.religion}</Text>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Keluar akun"
          onPress={() => {
            resetSession();
            navigation
              .getParent()
              .reset({ index: 0, routes: [{ name: "LoginScreen" }] });
          }}
          style={styles.logout}
        >
          <Text style={styles.logoutText}>Keluar akun</Text>
        </Pressable>
        <Text style={styles.footer}>Cari Jodoh / Awal dari cerita kita</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  content: { padding: 20, paddingTop: 8 },
  heading: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 12,
  },
  title: { fontSize: 28, fontWeight: "700", color: Colors.text, flex: 1 },
  subtitle: { fontSize: 14, color: Colors.grey, lineHeight: 22 },
  identity: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    paddingVertical: 12,
  },
  profileCopy: { flex: 1, minWidth: 0 },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: Colors.light,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  name: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.text,
  },
  username: { fontSize: 13, color: Colors.grey, marginTop: 4 },
  location: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 10,
  },
  editButton: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    paddingHorizontal: 20,
    minHeight: 44,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    marginTop: 12,
    alignSelf: "flex-start",
  },
  editText: { fontSize: 13, fontWeight: "600", color: Colors.text },
  sections: { gap: 8, paddingVertical: 20 },
  sectionTab: {
    paddingHorizontal: 14,
    minHeight: 42,
    justifyContent: "center",
    borderRadius: 8,
  },
  sectionActive: { backgroundColor: Colors.primary },
  sectionText: { color: Colors.grey, fontSize: 13, fontWeight: "600" },
  sectionActiveText: { color: Colors.white },
  boosts: { flexDirection: "row", gap: 12, marginBottom: 18 },
  boost: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    padding: 16,
    gap: 10,
  },
  boostTitle: { color: Colors.text, fontSize: 15, fontWeight: "700" },
  offers: { gap: 12, paddingBottom: 24 },
  offer: {
    width: 280,
    maxWidth: "100%",
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: "#F5F4F5",
    padding: 18,
    borderRadius: 8,
  },
  offerPlus: { backgroundColor: Colors.white, borderColor: Colors.border },
  offerTitle: { color: Colors.text, fontSize: 23, fontWeight: "800" },
  offerCopy: {
    color: Colors.text,
    fontSize: 14,
    lineHeight: 22,
    marginTop: 12,
    marginBottom: 20,
  },
  offerButton: {
    minHeight: 46,
    backgroundColor: Colors.primary,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: 12,
  },
  offerButtonText: {
    textAlign: "center",
    color: Colors.white,
    fontSize: 13,
    fontWeight: "700",
    flexShrink: 1,
  },
  comparisonHeading: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },
  comparisonRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: Colors.border,
  },
  comparisonCopy: { flex: 1, marginBottom: 0, fontSize: 13 },
  comparisonLabel: {
    width: 58,
    textAlign: "center",
    fontSize: 11,
    color: Colors.grey,
    fontWeight: "600",
  },
  comparisonCell: { width: 58, alignItems: "center" },
  demoNote: {
    fontSize: 11,
    lineHeight: 18,
    color: Colors.grey,
    marginVertical: 18,
  },
  insights: { paddingVertical: 24, gap: 18 },
  insightTitle: { color: Colors.text, fontSize: 22, fontWeight: "700" },
  section: {
    paddingVertical: 22,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  label: {
    fontSize: 13,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 10,
  },
  bio: { fontSize: 15, lineHeight: 24, color: Colors.text },
  intent: { flexDirection: "row", alignItems: "center", gap: 10 },
  logout: {
    justifyContent: "center",
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
    minHeight: 64,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.border,
  },
  logoutText: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.main,
    textAlign: "center",
  },
  footer: {
    fontSize: 11,
    color: Colors.grey,
    textAlign: "center",
    marginTop: 28,
    marginBottom: 12,
  },
  close: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
});
