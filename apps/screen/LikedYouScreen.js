import React, { useState } from "react";
import {
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
import ScreenHeading from "../component/ScreenHeading";
import ProfileCard from "../component/ProfileCard";
import ProfileFilterModal from "../component/ProfileFilterModal";
import BrandLogo from "../component/BrandLogo";
import { useMatches } from "../state/MatchContext";
import {
  defaultProfileFilters,
  filterProfiles,
  profiles,
} from "../data/profiles";
export default function LikedYouScreen({ navigation }) {
  useFocusEffect(
    React.useCallback(() => {
      StatusBar.setBarStyle("dark-content");
    }, [])
  );
  const { width } = useWindowDimensions();
  const { subscription } = useMatches();
  const [devUnlocked, setDevUnlocked] = useState(false);
  const unlocked =
    (__DEV__ && devUnlocked) ||
    ["premium", "plus"].includes(subscription?.tier);
  const [filters, setFilters] = useState({ ...defaultProfileFilters });
  const [open, setOpen] = useState(false);
  const incoming = profiles.filter((profile) => profile.likesYou);
  const visible = filterProfiles(incoming, filters);
  const cardWidth = Math.min(width < 360 ? width - 40 : (width - 54) / 2, 300);
  const unlock = () => {
    if (__DEV__) {
      setDevUnlocked(true);
      return;
    }
    navigation.navigate("PremiumScreen", { tier: "premium" });
  };
  if (!unlocked) {
    return (
      <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
        <ScreenHeading
          title="Menyukaimu"
          icon="lock"
          label="Unlock yang menyukaimu"
          onPress={unlock}
        />
        <ScrollView contentContainerStyle={styles.lockedContent}>
          <View style={styles.lockedInner}>
            <View style={styles.lockedMark}>
              <BrandLogo size={112} />
              <View style={styles.lockBadge}>
                <Feather name="lock" size={20} color={Colors.main} />
              </View>
            </View>
            <Text style={styles.likeCount}>
              {incoming.length} orang menyukaimu
            </Text>
            <Text accessibilityRole="header" style={styles.lockedTitle}>
              Lihat siapa yang tertarik
            </Text>
            <Text style={styles.lockedCopy}>
              Buka dengan Premium untuk melihat profil mereka dan beri love
              balik untuk menemukan match.
            </Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Unlock dengan Premium"
              onPress={unlock}
              style={styles.unlock}
            >
              <Text style={styles.unlockText}>Unlock dengan Premium</Text>
            </Pressable>
            <Text style={styles.premiumHint}>
              Tersedia di Premium dan Premium+
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <ScreenHeading
        title="Menyukaimu"
        icon="sliders"
        label="Filter yang menyukaimu"
        onPress={() => setOpen(true)}
      />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.copy}>
          Ada yang tertarik padamu. Beri love balik untuk menemukan match
          kalian.
        </Text>
        {visible.length ? (
          <View style={styles.grid}>
            {visible.map((profile) => (
              <ProfileCard
                key={profile.id}
                profile={profile}
                navigation={navigation}
                width={cardWidth}
                tag="Sudah menyukaimu"
              />
            ))}
          </View>
        ) : (
          <View style={styles.empty}>
            <Feather name="heart" size={48} color={Colors.main} />
            <Text style={styles.emptyTitle}>Belum ada yang sesuai</Text>
            <Text style={styles.copy}>
              Coba perluas preferensimu untuk melihat profil lainnya.
            </Text>
          </View>
        )}
      </ScrollView>
      {open && (
        <ProfileFilterModal
          filters={filters}
          candidates={incoming}
          onClose={() => setOpen(false)}
          onApply={(value) => {
            setFilters(value);
            setOpen(false);
          }}
        />
      )}
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  lockedContent: {
    flexGrow: 1,
    paddingHorizontal: 28,
    paddingVertical: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  lockedInner: { width: "100%", maxWidth: 380, alignItems: "center" },
  lockedMark: {
    width: 128,
    height: 128,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 28,
  },
  lockBadge: {
    position: "absolute",
    right: 0,
    bottom: 0,
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: Colors.white,
    backgroundColor: Colors.accentSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  likeCount: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.main,
    textAlign: "center",
    marginBottom: 12,
  },
  lockedTitle: {
    color: Colors.text,
    fontSize: 24,
    lineHeight: 32,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 12,
  },
  lockedCopy: {
    color: Colors.grey,
    fontSize: 14,
    lineHeight: 23,
    textAlign: "center",
    marginBottom: 28,
  },
  unlock: {
    width: "100%",
    minHeight: 52,
    padding: 16,
    backgroundColor: Colors.primary,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  unlockText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: "700",
    textAlign: "center",
  },
  premiumHint: {
    color: Colors.grey,
    fontSize: 12,
    lineHeight: 19,
    textAlign: "center",
    marginTop: 14,
  },
  content: { paddingHorizontal: 20, paddingBottom: 24, flexGrow: 1 },
  copy: { color: Colors.grey, fontSize: 14, lineHeight: 23, marginBottom: 24 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 14 },
  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
    paddingVertical: 60,
  },
  emptyTitle: { fontSize: 23, color: Colors.text, fontWeight: "700" },
});
