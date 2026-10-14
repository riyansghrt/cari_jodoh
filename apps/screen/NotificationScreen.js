import React from "react";
import {
  FlatList,
  Image,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import Feather from "react-native-vector-icons/Feather";
import { Colors } from "../component/Colors";
import { profiles } from "../data/profiles";

export const initialNotifications = [
  {
    id: "1",
    title: "Ada yang tertarik denganmu",
    body: "Alyssa menyukai profilmu. Mungkin ini awal cerita yang baik.",
    time: "Baru saja",
    photo: profiles[0].photo,
    read: false,
  },
  {
    id: "2",
    title: "Kenalan baru menunggumu",
    body: "Nadia baru bergabung. Temukan hal yang kalian sukai bersama.",
    time: "20 menit lalu",
    photo: profiles[1].photo,
    read: false,
  },
  {
    id: "3",
    title: "Selamat datang di Cari Jodoh",
    body: "Mulai perjalananmu dengan mengenal seseorang yang sejalan.",
    time: "Hari ini",
    read: true,
  },
];

export default function NotificationScreen({ notifications, onRead }) {
  useFocusEffect(
    React.useCallback(() => {
      StatusBar.setBarStyle("dark-content");
    }, [])
  );
  const unread = notifications.filter((item) => !item.read).length;
  return (
    <SafeAreaView edges={["top", "left", "right"]} style={styles.container}>
      <View style={styles.header}>
        <Text accessibilityRole="header" style={styles.title}>
          Notifikasi
        </Text>
        <Text style={styles.subtitle}>
          {unread
            ? `${unread} kabar baru untukmu`
            : "Semua kabar sudah kamu baca"}
        </Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Hari ini</Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Tandai semua dibaca"
          disabled={!unread}
          onPress={() => onRead("all")}
          style={styles.readButton}
        >
          <Feather
            name="check-circle"
            size={17}
            color={unread ? Colors.main : Colors.grey}
          />
          <Text style={[styles.readText, !unread && { color: Colors.grey }]}>
            Baca semua
          </Text>
        </Pressable>
      </View>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`${item.title}${
              item.read ? ", sudah dibaca" : ", belum dibaca"
            }`}
            onPress={() => onRead(item.id)}
            style={[styles.row, !item.read && styles.unread]}
          >
            {item.photo ? (
              <Image source={item.photo} style={styles.avatar} />
            ) : (
              <View style={styles.systemAvatar}>
                <Feather name="heart" size={22} color={Colors.main} />
              </View>
            )}
            <View style={styles.copy}>
              <View style={styles.titleRow}>
                <Text style={styles.rowTitle}>{item.title}</Text>
                {!item.read && <View style={styles.dot} />}
              </View>
              <Text style={styles.body}>{item.body}</Text>
              <Text style={styles.time}>{item.time}</Text>
            </View>
          </Pressable>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.submain },
  header: { padding: 24, paddingTop: 28 },
  title: { fontSize: 28, fontWeight: "700", color: Colors.text },
  subtitle: { fontSize: 14, lineHeight: 22, color: Colors.grey, marginTop: 8 },
  section: {
    paddingHorizontal: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 12,
  },
  sectionTitle: { fontSize: 13, fontWeight: "700", color: Colors.grey },
  readButton: {
    flexDirection: "row",
    gap: 6,
    alignItems: "center",
    minHeight: 44,
  },
  readText: { fontSize: 12, fontWeight: "600", color: Colors.main },
  list: { paddingBottom: 24 },
  row: {
    flexDirection: "row",
    gap: 14,
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  unread: { backgroundColor: Colors.light },
  avatar: { width: 48, height: 48, borderRadius: 24 },
  systemAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.light,
  },
  copy: { flex: 1 },
  titleRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  rowTitle: {
    fontSize: 14,
    lineHeight: 21,
    fontWeight: "700",
    color: Colors.text,
    flex: 1,
  },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: Colors.main },
  body: { fontSize: 13, lineHeight: 21, color: Colors.grey, marginTop: 6 },
  time: { fontSize: 11, color: Colors.grey, marginTop: 10 },
});
