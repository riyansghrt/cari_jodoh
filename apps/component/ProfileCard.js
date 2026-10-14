import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import Feather from "react-native-vector-icons/Feather";
import PremiumBadge from "./PremiumBadge";
import { Colors } from "./Colors";
import { useMatches } from "../state/MatchContext";
export default function ProfileCard({ profile, navigation, width, tag }) {
  const { likedIds, toggleLike, isMatched } = useMatches();
  const liked = likedIds.includes(profile.id);
  const detail = () =>
    navigation.navigate("ProfileDetailScreen", { profileId: profile.id });
  return (
    <View style={[styles.card, { width }]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Lihat profil ${profile.name}`}
        onPress={detail}
      >
        <Image
          source={profile.photo}
          accessibilityLabel={`Foto ${profile.name}`}
          resizeMode="cover"
          style={[
            styles.photo,
            { width: width - 22, height: (width - 22) / 0.77 },
          ]}
        />
        {!!tag && (
          <View pointerEvents="none" style={styles.tag}>
            <Text style={styles.tagText}>{tag}</Text>
          </View>
        )}
      </Pressable>
      <View style={styles.footer}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Detail ${profile.name}`}
          style={styles.identity}
          onPress={detail}
        >
          <Text style={styles.name}>
            {profile.name}, {profile.age}
          </Text>
          <PremiumBadge premium={profile.isPremium} compact />
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={
            liked ? `Batal suka ${profile.name}` : `Suka ${profile.name}`
          }
          accessibilityState={{ selected: liked }}
          onPress={() => toggleLike(profile.id)}
          style={styles.love}
        >
          <Feather
            name="heart"
            size={24}
            color={liked ? Colors.main : Colors.text}
          />
          {liked && <View style={styles.dot} />}
        </Pressable>
      </View>
      {isMatched(profile.id) && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Chat dengan ${profile.name}`}
          onPress={() =>
            navigation.navigate("ChatScreen", { profileId: profile.id })
          }
          style={styles.match}
        >
          <Feather name="message-circle" size={15} color={Colors.text} />
          <Text style={styles.matchText}>Match! Mulai chat</Text>
        </Pressable>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    padding: 10,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: "hidden",
  },
  photo: { borderRadius: 6 },
  tag: {
    position: "absolute",
    bottom: 10,
    left: 8,
    right: 8,
    backgroundColor: "#202124D9",
    borderRadius: 6,
    padding: 8,
  },
  tagText: { fontSize: 12, lineHeight: 17, color: Colors.white },
  footer: { flexDirection: "row", alignItems: "center", gap: 4, paddingTop: 7 },
  identity: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 6,
    minHeight: 44,
  },
  name: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: "700",
    color: Colors.text,
    flexShrink: 1,
  },
  love: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  dot: {
    position: "absolute",
    bottom: 4,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.main,
  },
  match: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    minHeight: 40,
    backgroundColor: Colors.light,
    borderRadius: 6,
    marginTop: 5,
  },
  matchText: { color: Colors.text, fontSize: 12, fontWeight: "600" },
});
