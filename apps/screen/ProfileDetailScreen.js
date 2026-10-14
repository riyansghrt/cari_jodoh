import React from "react";
import {
  Image,
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
import PremiumBadge from "../component/PremiumBadge";
import { profiles } from "../data/profiles";
import { useMatches } from "../state/MatchContext";

const SectionTitle = ({ icon, children }) => (
  <View style={styles.sectionHeading}>
    <Feather name={icon} size={19} color={Colors.grey} />
    <Text accessibilityRole="header" style={styles.sectionTitle}>
      {children}
    </Text>
  </View>
);

export default function ProfileDetailScreen({ route, navigation }) {
  const { likedIds, toggleLike, isMatched } = useMatches();
  const { width } = useWindowDimensions();
  useFocusEffect(
    React.useCallback(() => {
      StatusBar.setBarStyle("dark-content");
    }, [])
  );
  const profile = profiles.find((item) => item.id === route?.params?.profileId);
  const liked = profile && likedIds.includes(profile.id);
  const matched = profile && isMatched(profile.id);
  const fields = profile
    ? [
        { label: "Nama lengkap", value: profile.fullName },
        { label: "Usia", value: `${profile.age} tahun` },
        { label: "Domisili", value: profile.city },
        { label: "Kota asal", value: profile.hometown },
        { label: "Tinggi badan", value: `${profile.height} cm` },
        { label: "Agama", value: profile.religion },
        { label: "Status pernikahan", value: profile.maritalStatus },
        { label: "Bahasa", value: profile.languages.join(", ") },
      ]
    : [];
  return (
    <SafeAreaView
      style={styles.container}
      edges={["top", "left", "right", "bottom"]}
    >
      <StatusBar barStyle="dark-content" backgroundColor={Colors.submain} />
      {!profile && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Kembali ke Home"
          onPress={() => navigation.goBack()}
          style={[styles.backButton, styles.emptyBack]}
        >
          <Feather name="arrow-left" size={23} color={Colors.text} />
        </Pressable>
      )}
      {!profile ? (
        <View style={styles.empty}>
          <Feather name="user-x" size={40} color={Colors.main} />
          <Text style={styles.emptyTitle}>Profil tidak ditemukan.</Text>
          <Text style={styles.body}>
            Kembali ke Home untuk melihat profil lainnya.
          </Text>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View>
            <Image
              accessibilityLabel={`Foto ${profile.name}`}
              source={profile.photo}
              resizeMode="cover"
              style={{ width: "100%", height: Math.min(width * 1.12, 480) }}
            />
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Kembali ke Home"
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            >
              <Feather name="arrow-left" size={23} color={Colors.text} />
            </Pressable>
          </View>
          <View style={styles.matchBar}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={
                liked ? `Batal love ${profile.name}` : `Love ${profile.name}`
              }
              accessibilityState={{ selected: Boolean(liked) }}
              onPress={() => toggleLike(profile.id)}
              style={[styles.loveButton, liked && styles.loveSelected]}
            >
              <Feather
                name="heart"
                size={22}
                color={liked ? Colors.white : Colors.main}
              />
            </Pressable>
            <View style={styles.matchCopy}>
              <Text accessibilityLiveRegion="polite" style={styles.matchTitle}>
                {matched
                  ? "Kalian match!"
                  : liked
                  ? "Menunggu love balik"
                  : "Belum match"}
              </Text>
              <Text style={styles.matchHint}>
                {matched
                  ? "Saatnya mulai kenalan."
                  : "Chat terbuka setelah saling love."}
              </Text>
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={
                matched ? `Mulai chat dengan ${profile.name}` : "Chat terkunci"
              }
              accessibilityState={{ disabled: !matched }}
              disabled={!matched}
              onPress={() => {
                if (isMatched(profile.id))
                  navigation.navigate("ChatScreen", { profileId: profile.id });
              }}
              style={[styles.chatButton, !matched && styles.chatDisabled]}
            >
              <Feather
                name={matched ? "message-circle" : "lock"}
                size={17}
                color={matched ? Colors.white : Colors.grey}
              />
              <Text
                style={[
                  styles.chatButtonText,
                  !matched && { color: Colors.grey },
                ]}
              >
                {matched ? "Chat" : "Terkunci"}
              </Text>
            </Pressable>
          </View>
          <View style={styles.content}>
            <View style={styles.identity}>
              <View style={styles.nameRow}>
                <Text accessibilityRole="header" style={styles.name}>
                  {profile.name}, {profile.age}
                </Text>
                <PremiumBadge premium={profile.isPremium} />
              </View>
              <View style={styles.location}>
                <Feather name="map-pin" size={15} color={Colors.grey} />
                <Text style={styles.locationText}>
                  {profile.city} / {profile.distanceKm} km darimu
                </Text>
              </View>
              <Text style={styles.occupation}>{profile.occupation}</Text>
            </View>

            <View style={styles.section}>
              <SectionTitle icon="user">Tentang {profile.name}</SectionTitle>
              <Text style={styles.body}>{profile.bio}</Text>
            </View>

            <View style={styles.section}>
              <SectionTitle icon="heart">Tujuan hubungan</SectionTitle>
              <Text style={styles.body}>{profile.relationshipGoal}</Text>
            </View>

            <View style={styles.section}>
              <SectionTitle icon="file-text">Biodata</SectionTitle>
              <View style={styles.grid}>
                {fields.map((field) => (
                  <View key={field.label} style={styles.field}>
                    <Text style={styles.fieldLabel}>{field.label}</Text>
                    <Text style={styles.fieldValue}>{field.value}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.section}>
              <SectionTitle icon="briefcase">Pekerjaan</SectionTitle>
              <Text style={styles.emphasis}>{profile.occupation}</Text>
              <Text style={styles.body}>{profile.company}</Text>
            </View>

            <View style={styles.section}>
              <SectionTitle icon="book-open">Riwayat pendidikan</SectionTitle>
              {profile.education.map((education, index) => (
                <View key={education.id} style={styles.educationRow}>
                  <View style={styles.timeline}>
                    <View style={styles.timelineDot} />
                    {index < profile.education.length - 1 && (
                      <View style={styles.timelineLine} />
                    )}
                  </View>
                  <View style={styles.educationCopy}>
                    <Text style={styles.educationPeriod}>
                      {education.startYear} - {education.endYear} /{" "}
                      {education.level}
                    </Text>
                    <Text style={styles.institution}>
                      {education.institution}
                    </Text>
                    <Text style={styles.major}>{education.major}</Text>
                  </View>
                </View>
              ))}
            </View>

            <View style={styles.section}>
              <SectionTitle icon="coffee">Minat & hobi</SectionTitle>
              <View style={styles.tags}>
                {profile.interests.map((interest) => (
                  <View key={interest} style={styles.tag}>
                    <Text style={styles.tagText}>{interest}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.section}>
              <SectionTitle icon="compass">
                Hal yang penting bagiku
              </SectionTitle>
              {profile.values.map((value) => (
                <View key={value} style={styles.valueRow}>
                  <Feather name="check" size={16} color={Colors.grey} />
                  <Text style={styles.valueText}>{value}</Text>
                </View>
              ))}
            </View>
            <Text style={styles.credit}>
              Foto: Unsplash. Identitas, biodata, dan riwayat pendidikan adalah
              data fiktif.
            </Text>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.submain },
  backButton: {
    position: "absolute",
    top: 16,
    left: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.white,
    elevation: 3,
    shadowColor: "#000000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    justifyContent: "center",
    alignItems: "center",
  },
  emptyBack: { zIndex: 1 },
  loveButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.light,
  },
  loveSelected: { backgroundColor: Colors.main },
  matchBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  matchCopy: { flex: 1 },
  matchTitle: {
    fontSize: 13,
    lineHeight: 20,
    fontWeight: "700",
    color: Colors.text,
  },
  matchHint: { fontSize: 11, lineHeight: 17, color: Colors.grey, marginTop: 2 },
  chatButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    minHeight: 44,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: Colors.primary,
  },
  chatDisabled: { backgroundColor: Colors.light },
  chatButtonText: { fontSize: 12, fontWeight: "700", color: Colors.white },
  scrollContent: { paddingBottom: 24 },
  content: {
    paddingHorizontal: 24,
    width: "100%",
    maxWidth: 640,
    alignSelf: "center",
  },
  identity: { paddingVertical: 26 },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 12,
  },
  name: {
    fontSize: 28,
    lineHeight: 38,
    fontWeight: "700",
    color: Colors.text,
    flexShrink: 1,
  },
  location: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 12,
  },
  locationText: { fontSize: 13, color: Colors.grey, flexShrink: 1 },
  occupation: { fontSize: 14, color: Colors.text, marginTop: 10 },
  section: {
    paddingVertical: 24,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  sectionHeading: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "700",
    color: Colors.text,
    flex: 1,
  },
  body: { fontSize: 14, lineHeight: 24, color: Colors.grey },
  grid: { flexDirection: "row", flexWrap: "wrap", columnGap: 16, rowGap: 22 },
  field: { width: "47%", flexGrow: 1 },
  fieldLabel: {
    fontSize: 12,
    lineHeight: 18,
    color: Colors.grey,
    marginBottom: 5,
  },
  fieldValue: {
    fontSize: 14,
    lineHeight: 22,
    fontWeight: "500",
    color: Colors.text,
  },
  emphasis: {
    fontSize: 15,
    lineHeight: 24,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 4,
  },
  educationRow: { flexDirection: "row", gap: 14 },
  timeline: { width: 12, alignItems: "center", paddingTop: 5 },
  timelineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.grey,
  },
  timelineLine: {
    width: 1,
    flex: 1,
    backgroundColor: Colors.border,
    marginTop: 4,
  },
  educationCopy: { flex: 1, paddingBottom: 24 },
  educationPeriod: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: "600",
    color: Colors.grey,
  },
  institution: {
    fontSize: 15,
    lineHeight: 23,
    fontWeight: "600",
    color: Colors.text,
    marginTop: 6,
  },
  major: { fontSize: 13, lineHeight: 21, color: Colors.grey, marginTop: 4 },
  tags: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: Colors.light,
  },
  tagText: { fontSize: 13, color: Colors.grey },
  valueRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
  },
  valueText: { fontSize: 14, lineHeight: 22, color: Colors.grey, flex: 1 },
  credit: {
    fontSize: 11,
    lineHeight: 18,
    color: Colors.grey,
    paddingTop: 12,
    paddingBottom: 8,
  },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    gap: 16,
  },
  emptyTitle: { fontSize: 22, fontWeight: "700", color: Colors.text },
});
