import React, { useRef, useState } from "react";
import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
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
import { profiles } from "../data/profiles";
import { useMatches } from "../state/MatchContext";

export default function ChatScreen({ route, navigation }) {
  useFocusEffect(
    React.useCallback(() => {
      StatusBar.setBarStyle("dark-content");
    }, [])
  );
  const { isMatched, messages, sendMessage } = useMatches();
  const [draft, setDraft] = useState("");
  const listRef = useRef(null);
  const profile = profiles.find((item) => item.id === route?.params?.profileId);
  const matched = profile && isMatched(profile.id);
  const send = () => {
    if (profile && sendMessage(profile.id, draft)) setDraft("");
  };
  return (
    <SafeAreaView
      style={styles.container}
      edges={["top", "bottom", "left", "right"]}
    >
      <StatusBar barStyle="dark-content" backgroundColor={Colors.submain} />
      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Kembali ke profil"
          onPress={() => navigation.goBack()}
          style={styles.iconButton}
        >
          <Feather name="arrow-left" size={23} color={Colors.text} />
        </Pressable>
        {profile && <Image source={profile.photo} style={styles.avatar} />}
        <View style={styles.headerCopy}>
          <Text style={styles.name}>{profile?.name || "Chat"}</Text>
          <Text style={styles.subtitle}>
            {matched ? "Kalian sudah match" : "Chat terkunci"}
          </Text>
        </View>
      </View>
      {!matched ? (
        <View style={styles.empty}>
          <Feather name="lock" size={44} color={Colors.main} />
          <Text style={styles.emptyTitle}>Chat belum tersedia</Text>
          <Text style={styles.emptyText}>
            Kamu dan pengguna ini harus saling love sebelum bisa bertukar pesan.
          </Text>
        </View>
      ) : (
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <FlatList
            ref={listRef}
            data={messages[profile.id] || []}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.messages}
            onContentSizeChange={() =>
              listRef.current?.scrollToEnd({ animated: true })
            }
            keyboardShouldPersistTaps="handled"
            ListEmptyComponent={
              <View style={styles.empty}>
                <Feather name="heart" size={40} color={Colors.main} />
                <Text style={styles.emptyTitle}>Awal cerita kalian</Text>
                <Text style={styles.emptyText}>
                  Sapa {profile.name} dan mulai kenalan.
                </Text>
              </View>
            }
            renderItem={({ item }) => (
              <View style={styles.bubble}>
                <Text style={styles.message}>{item.text}</Text>
              </View>
            )}
          />
          <View style={styles.composer}>
            <TextInput
              accessibilityLabel="Tulis pesan"
              placeholder="Tulis pesan..."
              placeholderTextColor={Colors.grey}
              value={draft}
              onChangeText={setDraft}
              maxLength={1000}
              multiline
              style={styles.input}
            />
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Kirim pesan"
              disabled={!draft.trim()}
              accessibilityState={{ disabled: !draft.trim() }}
              onPress={send}
              style={[styles.send, !draft.trim() && styles.sendDisabled]}
            >
              <Feather name="send" size={20} color={Colors.white} />
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1, backgroundColor: Colors.submain },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.white,
  },
  iconButton: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  avatar: { width: 40, height: 40, borderRadius: 20 },
  headerCopy: { flex: 1 },
  name: { fontSize: 16, fontWeight: "700", color: Colors.text },
  subtitle: { fontSize: 11, color: Colors.grey, marginTop: 4 },
  messages: { flexGrow: 1, padding: 20, gap: 12 },
  bubble: {
    alignSelf: "flex-end",
    maxWidth: "85%",
    borderRadius: 8,
    backgroundColor: Colors.light,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  message: { fontSize: 14, lineHeight: 22, color: Colors.text },
  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
    padding: 28,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: Colors.text,
    textAlign: "center",
  },
  emptyText: {
    fontSize: 14,
    lineHeight: 23,
    color: Colors.grey,
    textAlign: "center",
  },
  composer: {
    flexDirection: "row",
    gap: 10,
    alignItems: "flex-end",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.white,
  },
  input: {
    flex: 1,
    minHeight: 48,
    maxHeight: 120,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: Colors.text,
  },
  send: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.primary,
    borderRadius: 8,
  },
  sendDisabled: { backgroundColor: "#BFC1C5" },
});
