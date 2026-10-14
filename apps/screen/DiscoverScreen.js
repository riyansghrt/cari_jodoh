import React from "react";
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { Colors } from "../component/Colors";
import ScreenHeading from "../component/ScreenHeading";
import ProfileCard from "../component/ProfileCard";
import { profiles, relationshipIntentOptions } from "../data/profiles";
import { useMatches } from "../state/MatchContext";
export default function DiscoverScreen({ navigation }) {
  useFocusEffect(
    React.useCallback(() => {
      StatusBar.setBarStyle("dark-content");
    }, [])
  );
  const { width } = useWindowDimensions();
  const { ownProfile } = useMatches();
  const sections = [
    {
      title: "Rekomendasi untukmu",
      items: profiles,
      large: true,
      tag: (item) => `${item.distanceKm} km darimu`,
    },
    {
      title: "Minat yang sama",
      items: profiles.filter((item) =>
        item.interests.some((value) => ownProfile.interests.includes(value))
      ),
      tag: (item) =>
        item.interests.find((value) => ownProfile.interests.includes(value)),
    },
    {
      title: "Tujuan yang sejalan",
      items: profiles.filter(
        (item) => item.relationshipIntent === ownProfile.relationshipIntent
      ),
      tag: (item) =>
        relationshipIntentOptions.find(
          (value) => value.value === item.relationshipIntent
        ).label,
    },
    {
      title: "Komunitas yang sama",
      items: profiles.filter((item) => item.religion === ownProfile.religion),
      tag: (item) => item.religion,
    },
  ];
  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <ScreenHeading title="Discover" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        <View style={styles.intro}>
          <Text style={styles.eyebrow}>Pilihan hari ini</Text>
          <Text style={styles.copy}>
            Temukan seseorang dari hal-hal yang kalian sukai.
          </Text>
        </View>
        {sections.map((section, index) => (
          <View
            key={section.title}
            style={[styles.section, index % 2 === 1 && styles.alternate]}
          >
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.cards}
            >
              {section.items.map((profile) => (
                <ProfileCard
                  key={profile.id}
                  profile={profile}
                  navigation={navigation}
                  width={Math.min(
                    section.large ? width - 66 : width * 0.64,
                    section.large ? 330 : 260
                  )}
                  tag={section.tag(profile)}
                />
              ))}
            </ScrollView>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  scroll: { paddingBottom: 20 },
  intro: { paddingHorizontal: 20, paddingBottom: 12 },
  eyebrow: {
    color: Colors.grey,
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 10,
  },
  copy: { color: Colors.text, fontSize: 16, lineHeight: 25 },
  section: { paddingVertical: 20 },
  alternate: { backgroundColor: "#F5F4F5" },
  sectionTitle: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: "700",
    color: Colors.text,
    marginHorizontal: 20,
    marginBottom: 16,
  },
  cards: { paddingHorizontal: 20, gap: 14, alignItems: "flex-start" },
});
