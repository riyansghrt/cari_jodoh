import React, { useState } from "react";
import {
  FlatList,
  Image,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import Feather from "react-native-vector-icons/Feather";
import { Colors } from "../component/Colors";
import {
  profiles,
  defaultProfileFilters,
  filterProfiles,
} from "../data/profiles";
import ProfileFilterModal from "../component/ProfileFilterModal";
import PremiumBadge from "../component/PremiumBadge";
import FocusStatusBar from "../component/FocusStatusBar";
import BrandLogo from "../component/BrandLogo";
import { useMatches } from "../state/MatchContext";

export const createProfilePages = (items) =>
  Array.from({ length: Math.ceil(items.length / 4) }, (_, index) =>
    items.slice(index * 4, index * 4 + 4)
  );

export default function HomeScreen({ navigation }) {
  useFocusEffect(
    React.useCallback(() => {
      StatusBar.setBarStyle("dark-content");
    }, [])
  );
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const [height, setHeight] = useState(0);
  const { likedIds, toggleLike } = useMatches();
  const [filters, setFilters] = useState({ ...defaultProfileFilters });
  const [filterOpen, setFilterOpen] = useState(false);
  const visibleProfiles = filterProfiles(profiles, filters);
  const pages = createProfilePages(visibleProfiles);
  const activeFilterCount =
    Number(filters.minAge !== 18 || filters.maxAge !== 60) +
    Number(filters.maxDistanceKm !== defaultProfileFilters.maxDistanceKm) +
    Number(filters.religion !== "all") +
    Number(filters.relationshipIntent !== "all") +
    Number(filters.premiumOnly);
  const pageHeight = Math.max(376, height - insets.top - 69);
  const cardHeight = (pageHeight - 36) / 2;
  const cardWidth = (width - insets.left - insets.right - 44) / 2;

  return (
    <View
      style={[
        styles.container,
        { paddingLeft: insets.left, paddingRight: insets.right },
      ]}
      onLayout={(event) => setHeight(event.nativeEvent.layout.height)}
    >
      <FocusStatusBar />
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <View style={styles.brand}>
          <BrandLogo size={34} />
          <Text style={styles.brandText}>Cari Jodoh</Text>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Filter profil"
          onPress={() => setFilterOpen(true)}
          style={styles.filterButton}
        >
          <Feather name="sliders" size={20} color={Colors.text} />
          {activeFilterCount > 0 && (
            <View style={styles.filterBadge}>
              <Text style={styles.filterBadgeText}>{activeFilterCount}</Text>
            </View>
          )}
        </Pressable>
      </View>
      {height > 0 && (
        <FlatList
          key={`${width}-${pageHeight}-${JSON.stringify(filters)}`}
          style={styles.list}
          data={pages}
          extraData={likedIds}
          keyExtractor={(page) => page[0].id}
          pagingEnabled
          snapToInterval={pageHeight}
          decelerationRate="fast"
          showsVerticalScrollIndicator={false}
          initialNumToRender={2}
          windowSize={3}
          getItemLayout={(_, index) => ({
            length: pageHeight,
            offset: pageHeight * index,
            index,
          })}
          ListEmptyComponent={
            <View style={[styles.empty, { height: pageHeight }]}>
              <Feather name="users" size={44} color={Colors.grey} />
              <Text style={styles.emptyTitle}>Belum ada yang cocok.</Text>
              <Text style={styles.emptyText}>
                {activeFilterCount
                  ? "Coba perluas usia, jarak, atau preferensi lainnya."
                  : "Belum ada profil tersedia."}
              </Text>
              {activeFilterCount > 0 && (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Reset hasil filter"
                  onPress={() => setFilters({ ...defaultProfileFilters })}
                  style={styles.resetButton}
                >
                  <Text style={styles.resetText}>Reset filter</Text>
                </Pressable>
              )}
            </View>
          }
          renderItem={({ item: page }) => (
            <View
              testID="profile-grid-page"
              style={[styles.page, { height: pageHeight }]}
            >
              {page.map((item) => {
                const liked = likedIds.includes(item.id);
                const openProfile = () =>
                  navigation.navigate("ProfileDetailScreen", {
                    profileId: item.id,
                  });
                return (
                  <View
                    key={item.id}
                    testID={`profile-card-${item.id}`}
                    style={[
                      styles.card,
                      { width: cardWidth, height: cardHeight },
                    ]}
                  >
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel={`Foto profil ${item.name}`}
                      onPress={openProfile}
                    >
                      <Image
                        accessibilityLabel={`Foto ${item.name}`}
                        source={item.photo}
                        resizeMode="cover"
                        style={{
                          width: cardWidth - 2,
                          height: cardHeight - 90,
                        }}
                      />
                    </Pressable>
                    <View style={styles.cardContent}>
                      <Pressable
                        accessibilityRole="button"
                        accessibilityLabel={`Lihat profil ${item.name}`}
                        onPress={openProfile}
                        style={styles.identity}
                      >
                        <Text
                          style={styles.name}
                          numberOfLines={1}
                          adjustsFontSizeToFit
                          minimumFontScale={0.8}
                        >
                          {item.name}, {item.age}
                        </Text>
                        <PremiumBadge premium={item.isPremium} compact />
                      </Pressable>
                      <View style={styles.cardBottom}>
                        <View style={styles.location}>
                          <Text numberOfLines={1} style={styles.city}>
                            {item.city}
                          </Text>
                          <Text style={styles.distance}>
                            {item.distanceKm} km darimu
                          </Text>
                        </View>
                        <Pressable
                          accessibilityRole="button"
                          accessibilityLabel={
                            liked
                              ? `Batal suka ${item.name}`
                              : `Suka ${item.name}`
                          }
                          accessibilityState={{ selected: liked }}
                          onPress={() => toggleLike(item.id)}
                          style={({ pressed }) => [
                            styles.loveButton,
                            liked && styles.loveSelected,
                            pressed && styles.pressed,
                          ]}
                        >
                          <Feather
                            name="heart"
                            size={21}
                            color={liked ? Colors.main : Colors.text}
                          />
                        </Pressable>
                      </View>
                    </View>
                  </View>
                );
              })}
            </View>
          )}
        />
      )}
      {filterOpen && (
        <ProfileFilterModal
          filters={filters}
          candidates={profiles}
          onClose={() => setFilterOpen(false)}
          onApply={(nextFilters) => {
            setFilters(nextFilters);
            setFilterOpen(false);
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  brand: { flex: 1, flexDirection: "row", alignItems: "center", gap: 10 },
  brandText: {
    color: Colors.text,
    fontSize: 22,
    fontWeight: "700",
    flexShrink: 1,
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.light,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    width: 19,
    height: 19,
    borderRadius: 10,
    backgroundColor: Colors.main,
    alignItems: "center",
    justifyContent: "center",
  },
  filterBadgeText: { color: Colors.white, fontSize: 10, fontWeight: "700" },
  list: { flex: 1 },
  page: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignContent: "flex-start",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  card: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    overflow: "hidden",
  },
  cardContent: {
    height: 88,
    paddingHorizontal: 10,
    paddingTop: 6,
    paddingBottom: 6,
  },
  identity: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    minHeight: 28,
  },
  name: {
    fontSize: 15,
    lineHeight: 21,
    fontWeight: "700",
    color: Colors.text,
    flexShrink: 1,
  },
  cardBottom: { flexDirection: "row", alignItems: "center", gap: 4 },
  location: { flex: 1, minWidth: 0 },
  city: { fontSize: 11, lineHeight: 16, color: Colors.grey },
  distance: { fontSize: 10, lineHeight: 15, color: Colors.grey },
  loveButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  loveSelected: { backgroundColor: Colors.accentSoft },
  pressed: { opacity: 0.7 },
  empty: {
    paddingHorizontal: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyTitle: {
    color: Colors.text,
    fontSize: 23,
    lineHeight: 31,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 20,
  },
  emptyText: {
    color: Colors.grey,
    fontSize: 14,
    lineHeight: 22,
    textAlign: "center",
    marginTop: 12,
  },
  resetButton: {
    minHeight: 48,
    paddingHorizontal: 20,
    justifyContent: "center",
    backgroundColor: Colors.primary,
    borderRadius: 8,
    marginTop: 24,
  },
  resetText: { color: Colors.white, fontSize: 14, fontWeight: "700" },
});
