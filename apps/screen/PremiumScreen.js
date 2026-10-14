import React, { useState } from "react";
import {
  Alert,
  ImageBackground,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import Feather from "react-native-vector-icons/Feather";
import { Colors } from "../component/Colors";
import { profiles } from "../data/profiles";
import { premiumBenefits, premiumPlans, formatRupiah } from "../data/premium";
import { useMatches } from "../state/MatchContext";

export default function PremiumScreen({ navigation, route }) {
  useFocusEffect(
    React.useCallback(() => {
      StatusBar.setBarStyle("dark-content");
    }, [])
  );
  const [tier, setTier] = useState(
    route?.params?.tier === "plus" ? "plus" : "premium"
  );
  const [period, setPeriod] = useState("week");
  const [expanded, setExpanded] = useState(false);
  const { setSubscription } = useMatches();
  const { width } = useWindowDimensions();
  const selected = premiumPlans.find((plan) => plan.id === period);
  const benefits = premiumBenefits.filter(
    (benefit) => tier === "plus" || !benefit.plusOnly
  );
  const activate = () =>
    Alert.alert(
      "Simulasi paket",
      `${tier === "plus" ? "Premium+" : "Premium"} / ${
        selected.label
      }. Tidak ada pembayaran atau perpanjangan otomatis.`,
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Aktifkan demo",
          onPress: () => {
            setSubscription({ tier, period });
            navigation.goBack();
          },
        },
      ]
    );
  return (
    <SafeAreaView
      style={styles.container}
      edges={["top", "bottom", "left", "right"]}
    >
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />
      <View style={styles.header}>
        <View accessibilityRole="tablist" style={styles.tabs}>
          {[
            { id: "premium", label: "Premium" },
            { id: "plus", label: "Premium+" },
          ].map((item) => (
            <Pressable
              key={item.id}
              accessibilityRole="tab"
              accessibilityLabel={`Paket ${item.label}`}
              accessibilityState={{ selected: tier === item.id }}
              onPress={() => {
                setTier(item.id);
                setExpanded(false);
              }}
              style={[styles.tab, tier === item.id && styles.activeTab]}
            >
              <Text
                style={[styles.tabText, tier === item.id && styles.activeText]}
              >
                {item.label}
              </Text>
            </Pressable>
          ))}
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Tutup paket premium"
          onPress={() => navigation.goBack()}
          style={styles.close}
        >
          <Feather name="x" size={26} color={Colors.text} />
        </Pressable>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <ImageBackground
          source={profiles[3].photo}
          style={styles.hero}
          imageStyle={styles.heroImage}
        >
          <View style={styles.heroShade}>
            <Text style={styles.heroTitle}>
              {tier === "plus" ? "Cari Jodoh Premium+" : "Cari Jodoh Premium"}
            </Text>
            <Text style={styles.heroCopy}>
              Lebih dekat dengan cerita barumu.
            </Text>
          </View>
        </ImageBackground>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.plans}
        >
          {premiumPlans.map((plan) => {
            const active = period === plan.id;
            const saving = Math.round(
              (1 - plan[tier] / (premiumPlans[0][tier] * plan.weeks)) * 100
            );
            return (
              <Pressable
                key={plan.id}
                accessibilityRole="radio"
                accessibilityLabel={`Durasi ${plan.label}`}
                accessibilityState={{ checked: active }}
                onPress={() => setPeriod(plan.id)}
                style={[
                  styles.plan,
                  { width: Math.min(width - 100, 210) },
                  active && styles.selectedPlan,
                ]}
              >
                <View style={styles.planTop}>
                  <Text style={styles.planTitle}>{plan.label}</Text>
                  <Feather
                    name={active ? "check-circle" : "circle"}
                    size={23}
                    color={active ? Colors.primary : Colors.grey}
                  />
                </View>
                <Text style={styles.price}>{formatRupiah(plan[tier])}</Text>
                <Text style={styles.planHint}>Total per paket</Text>
                <Text style={styles.saving}>
                  {saving ? `Hemat ${saving}%` : "Pilihan fleksibel"}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
        <View style={styles.benefits}>
          {(expanded ? benefits : benefits.slice(0, 3)).map((benefit) => (
            <View key={benefit.title} style={styles.benefit}>
              <View style={styles.benefitIcon}>
                <Feather name={benefit.icon} size={19} color={Colors.white} />
              </View>
              <View style={styles.flex}>
                <Text style={styles.benefitTitle}>{benefit.title}</Text>
                <Text style={styles.description}>{benefit.description}</Text>
              </View>
            </View>
          ))}
          {benefits.length > 3 && (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Lihat semua manfaat"
              onPress={() => setExpanded((value) => !value)}
              style={styles.more}
            >
              <Text style={styles.moreText}>
                {expanded ? "Tampilkan lebih sedikit" : "Lihat semua manfaat"}
              </Text>
            </Pressable>
          )}
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <Text style={styles.disclaimer}>
          Paket dan harga simulasi. Tidak ada tagihan. Manfaat berbayar belum
          terhubung ke layanan backend.
        </Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Aktifkan demo premium"
          onPress={activate}
          style={styles.activate}
        >
          <Text style={styles.activateText}>
            Coba {selected.label} / {formatRupiah(selected[tier])}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  flex: { flex: 1 },
  header: {
    flexDirection: "row",
    paddingHorizontal: 16,
    alignItems: "center",
    gap: 8,
  },
  tabs: { flex: 1, flexDirection: "row", justifyContent: "center", gap: 20 },
  tab: {
    paddingVertical: 17,
    borderBottomWidth: 3,
    borderColor: "transparent",
  },
  activeTab: { borderColor: Colors.main },
  tabText: { fontSize: 17, color: Colors.grey },
  activeText: { color: Colors.text, fontWeight: "700" },
  close: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  hero: { height: 180, justifyContent: "flex-end" },
  heroImage: { resizeMode: "cover" },
  heroShade: { padding: 20, backgroundColor: "#20212488" },
  heroTitle: { color: Colors.white, fontSize: 25, fontWeight: "700" },
  heroCopy: { color: Colors.white, fontSize: 14, lineHeight: 22, marginTop: 7 },
  plans: { padding: 20, gap: 12 },
  plan: {
    borderRadius: 8,
    padding: 16,
    backgroundColor: "#F5F4F5",
    borderWidth: 1,
    borderColor: Colors.border,
    minHeight: 150,
  },
  selectedPlan: { backgroundColor: Colors.white, borderColor: Colors.primary },
  planTop: { flexDirection: "row", alignItems: "center", gap: 8 },
  planTitle: { flex: 1, color: Colors.text, fontWeight: "700", fontSize: 17 },
  price: { fontSize: 21, fontWeight: "600", color: Colors.text, marginTop: 12 },
  planHint: { fontSize: 11, color: Colors.grey, marginTop: 6 },
  saving: {
    color: Colors.grey,
    fontSize: 12,
    fontWeight: "700",
    marginTop: 16,
  },
  benefits: { paddingHorizontal: 20, paddingBottom: 24 },
  benefit: {
    flexDirection: "row",
    gap: 12,
    alignItems: "flex-start",
    paddingVertical: 12,
  },
  benefitIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  benefitTitle: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: "700",
    lineHeight: 23,
  },
  description: {
    fontSize: 13,
    lineHeight: 21,
    color: Colors.grey,
    marginTop: 4,
  },
  more: {
    minHeight: 44,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 12,
  },
  moreText: {
    fontSize: 13,
    color: Colors.text,
    fontWeight: "600",
    textAlign: "center",
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderColor: Colors.border,
    gap: 12,
  },
  disclaimer: { fontSize: 11, lineHeight: 17, color: Colors.grey },
  activate: {
    minHeight: 52,
    padding: 14,
    backgroundColor: Colors.primary,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  activateText: {
    textAlign: "center",
    color: Colors.white,
    fontSize: 14,
    fontWeight: "700",
    flexShrink: 1,
  },
});
