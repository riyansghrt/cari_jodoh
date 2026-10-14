import React, { useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import Feather from "react-native-vector-icons/Feather";
import { Colors } from "../component/Colors";
import ScreenHeading from "../component/ScreenHeading";
import PremiumBadge from "../component/PremiumBadge";
import { profiles } from "../data/profiles";
import { useMatches } from "../state/MatchContext";
export default function ChatsScreen({ navigation }) {
  useFocusEffect(
    React.useCallback(() => {
      StatusBar.setBarStyle("dark-content");
    }, [])
  );
  const { isMatched, messages } = useMatches();
  const [query, setQuery] = useState("");
  const matches = profiles.filter((profile) => isMatched(profile.id));
  const visible = matches.filter((profile) =>
    profile.name.toLowerCase().includes(query.trim().toLowerCase())
  );
  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <ScreenHeading title="Chat" />
      <View style={styles.search}>
        <Feather name="search" size={18} color={Colors.grey} />
        <TextInput
          accessibilityLabel="Cari chat"
          placeholder="Cari nama"
          placeholderTextColor={Colors.grey}
          value={query}
          onChangeText={setQuery}
          style={styles.input}
        />
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        {!matches.length ? (
          <View style={styles.empty}>
            <View style={styles.emptyIcon}>
              <Feather name="message-circle" size={46} color={Colors.main} />
            </View>
            <Text style={styles.emptyTitle}>Cerita dimulai dari match</Text>
            <Text style={styles.copy}>
              Saat kalian saling love, percakapanmu akan muncul di sini.
            </Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Temukan match"
              onPress={() => navigation.navigate("LikedYouScreen")}
              style={styles.primary}
            >
              <Text style={styles.primaryText}>Lihat yang menyukaimu</Text>
            </Pressable>
          </View>
        ) : (
          <>
            <Text style={styles.label}>{matches.length} match</Text>
            {!visible.length && (
              <Text style={styles.copy}>
                Tidak ada percakapan dengan nama itu.
              </Text>
            )}
            {visible.map((profile) => {
              const history = messages[profile.id] || [];
              return (
                <Pressable
                  key={profile.id}
                  accessibilityRole="button"
                  accessibilityLabel={`Buka chat ${profile.name}`}
                  style={styles.row}
                  onPress={() => {
                    if (isMatched(profile.id))
                      navigation.navigate("ChatScreen", {
                        profileId: profile.id,
                      });
                  }}
                >
                  <Image source={profile.photo} style={styles.avatar} />
                  <View style={styles.rowCopy}>
                    <View style={styles.nameRow}>
                      <Text style={styles.name}>{profile.name}</Text>
                      <PremiumBadge premium={profile.isPremium} compact />
                    </View>
                    <Text numberOfLines={1} style={styles.preview}>
                      {history.length
                        ? `Kamu: ${history[history.length - 1].text}`
                        : "Kalian match! Sapa duluan."}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  search: {
    marginHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 14,
    backgroundColor: "#F5F4F5",
    borderRadius: 8,
    marginBottom: 20,
  },
  input: { flex: 1, minHeight: 46, color: Colors.text, fontSize: 14 },
  content: { flexGrow: 1, paddingHorizontal: 20, paddingBottom: 24 },
  label: {
    fontSize: 13,
    fontWeight: "700",
    color: Colors.grey,
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    gap: 14,
    alignItems: "center",
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderColor: Colors.border,
  },
  avatar: { width: 62, height: 62, borderRadius: 31 },
  rowCopy: { flex: 1, minWidth: 0 },
  nameRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  name: { fontSize: 17, fontWeight: "700", color: Colors.text, flexShrink: 1 },
  preview: { fontSize: 13, color: Colors.grey, marginTop: 7 },
  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
    paddingVertical: 50,
  },
  emptyIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.light,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyTitle: {
    fontSize: 23,
    fontWeight: "700",
    color: Colors.text,
    textAlign: "center",
  },
  copy: {
    fontSize: 14,
    lineHeight: 23,
    textAlign: "center",
    color: Colors.grey,
  },
  primary: {
    justifyContent: "center",
    minHeight: 50,
    paddingHorizontal: 18,
    borderRadius: 8,
    backgroundColor: Colors.primary,
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  primaryText: {
    textAlign: "center",
    fontSize: 13,
    fontWeight: "700",
    color: Colors.white,
    flexShrink: 1,
  },
});
