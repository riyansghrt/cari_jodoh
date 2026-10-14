import React, { useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Feather from "react-native-vector-icons/Feather";
import { Colors } from "./Colors";
import {
  defaultProfileFilters,
  filterProfiles,
  profiles,
  relationshipIntentOptions,
} from "../data/profiles";

const SliderMarker = ({ markerStyle }) => (
  <View collapsable={false} style={markerStyle} />
);

export default function ProfileFilterModal({
  filters,
  candidates,
  onApply,
  onClose,
}) {
  const insets = useSafeAreaInsets();
  const [draft, setDraft] = useState({ ...filters });
  const [sliderWidth, setSliderWidth] = useState(240);
  const [dragging, setDragging] = useState(false);
  const count = filterProfiles(candidates, draft).length;
  return (
    <Modal transparent visible animationType="slide" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Tutup filter"
          style={StyleSheet.absoluteFill}
          onPress={onClose}
        />
        <View
          accessibilityViewIsModal
          style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, 24) }]}
        >
          <View style={styles.heading}>
            <View style={styles.flex}>
              <Text accessibilityRole="header" style={styles.title}>
                Preferensi kamu
              </Text>
              <Text style={styles.subtitle}>Temukan yang lebih sejalan.</Text>
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Tutup"
              onPress={onClose}
              style={styles.iconButton}
            >
              <Feather name="x" size={24} color={Colors.text} />
            </Pressable>
          </View>
          <ScrollView
            style={styles.scroll}
            showsVerticalScrollIndicator={false}
            scrollEnabled={!dragging}
            removeClippedSubviews={false}
          >
            <View style={styles.labelRow}>
              <Text style={styles.label}>Rentang usia</Text>
              <Text style={styles.ageValue}>
                {draft.minAge} - {draft.maxAge} tahun
              </Text>
            </View>
            <View
              style={styles.slider}
              onLayout={(event) =>
                setSliderWidth(
                  Math.max(100, event.nativeEvent.layout.width - 24)
                )
              }
            >
              <MultiSlider
                testID="age-slider"
                values={[draft.minAge, draft.maxAge]}
                sliderLength={sliderWidth}
                min={18}
                max={60}
                step={1}
                snapped
                allowOverlap
                customMarker={SliderMarker}
                markerContainerStyle={styles.markerContainer}
                onValuesChangeStart={() => setDragging(true)}
                onValuesChangeFinish={() => setDragging(false)}
                onValuesChange={(values) =>
                  setDraft((previous) => ({
                    ...previous,
                    minAge: values[0],
                    maxAge: values[1],
                  }))
                }
                selectedStyle={{ backgroundColor: Colors.primary }}
                unselectedStyle={{ backgroundColor: Colors.border }}
                markerStyle={styles.marker}
              />
            </View>
            <View style={styles.rangeLabels}>
              <Text style={styles.subtitle}>18 tahun</Text>
              <Text style={styles.subtitle}>60 tahun</Text>
            </View>
            <View style={[styles.labelRow, styles.sectionLabel]}>
              <Text style={styles.label}>Jarak maksimal</Text>
              <Text style={styles.ageValue}>{draft.maxDistanceKm} km</Text>
            </View>
            <View style={styles.slider}>
              <MultiSlider
                testID="distance-slider"
                values={[draft.maxDistanceKm]}
                sliderLength={sliderWidth}
                min={1}
                max={100}
                step={1}
                snapped
                allowOverlap
                customMarker={SliderMarker}
                markerContainerStyle={styles.markerContainer}
                onValuesChangeStart={() => setDragging(true)}
                onValuesChangeFinish={() => setDragging(false)}
                onValuesChange={([maxDistanceKm]) =>
                  setDraft((previous) => ({ ...previous, maxDistanceKm }))
                }
                selectedStyle={{ backgroundColor: Colors.primary }}
                unselectedStyle={{ backgroundColor: Colors.border }}
                markerStyle={styles.marker}
              />
            </View>
            <View style={styles.rangeLabels}>
              <Text style={styles.subtitle}>1 km</Text>
              <Text style={styles.subtitle}>100 km</Text>
            </View>
            <Text style={[styles.label, styles.sectionLabel]}>Agama</Text>
            <View style={styles.pickerWrap}>
              <Picker
                accessibilityLabel="Agama pilihan"
                selectedValue={draft.religion}
                onValueChange={(religion) =>
                  setDraft((previous) => ({ ...previous, religion }))
                }
                style={styles.picker}
                dropdownIconColor={Colors.text}
              >
                <Picker.Item label="Semua agama" value="all" />
                {[...new Set(profiles.map((profile) => profile.religion))].map(
                  (religion) => (
                    <Picker.Item
                      key={religion}
                      label={religion}
                      value={religion}
                    />
                  )
                )}
              </Picker>
            </View>
            <Text style={[styles.label, styles.sectionLabel]}>
              Tujuan hubungan
            </Text>
            <View style={styles.pickerWrap}>
              <Picker
                accessibilityLabel="Tujuan hubungan pilihan"
                selectedValue={draft.relationshipIntent}
                onValueChange={(relationshipIntent) =>
                  setDraft((previous) => ({ ...previous, relationshipIntent }))
                }
                style={styles.picker}
                dropdownIconColor={Colors.text}
              >
                <Picker.Item label="Semua tujuan" value="all" />
                {relationshipIntentOptions.map(({ value, label }) => (
                  <Picker.Item key={value} label={label} value={value} />
                ))}
              </Picker>
            </View>
            <View style={[styles.labelRow, styles.sectionLabel]}>
              <Text style={[styles.label, styles.flex]}>
                Hanya pengguna premium
              </Text>
              <Switch
                accessibilityLabel="Hanya pengguna premium"
                value={draft.premiumOnly}
                onValueChange={(premiumOnly) =>
                  setDraft((previous) => ({ ...previous, premiumOnly }))
                }
                trackColor={{ false: Colors.border, true: Colors.main }}
                thumbColor={Colors.white}
              />
            </View>
          </ScrollView>
          <View style={styles.result}>
            <Feather name="users" size={18} color={Colors.grey} />
            <Text accessibilityLiveRegion="polite" style={styles.resultText}>
              {count} profil sesuai preferensimu
            </Text>
          </View>
          <View style={styles.buttons}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Reset filter"
              onPress={() => setDraft({ ...defaultProfileFilters })}
              style={styles.reset}
            >
              <Feather name="rotate-ccw" size={18} color={Colors.text} />
              <Text style={styles.resetText}>Reset</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Terapkan filter"
              onPress={() => onApply(draft)}
              style={styles.apply}
            >
              <Text style={styles.applyText}>Tampilkan profil</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  backdrop: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "#00000088",
  },
  sheet: {
    backgroundColor: Colors.submain,
    padding: 24,
    maxHeight: "88%",
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  heading: { flexDirection: "row", alignItems: "center", marginBottom: 24 },
  scroll: { flexShrink: 1 },
  title: { fontSize: 22, fontWeight: "700", color: Colors.text },
  subtitle: { fontSize: 13, lineHeight: 20, color: Colors.grey, marginTop: 6 },
  iconButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 8,
  },
  label: { fontSize: 14, fontWeight: "600", color: Colors.text },
  ageValue: { fontSize: 14, fontWeight: "700", color: Colors.text },
  slider: { alignItems: "center", marginTop: 12 },
  marker: {
    width: 24,
    height: 24,
    backgroundColor: Colors.primary,
    borderWidth: 3,
    borderColor: Colors.white,
    borderRadius: 12,
  },
  // Keep markers mounted as native views while they cross the slider midpoint.
  markerContainer: { zIndex: 1 },
  rangeLabels: { flexDirection: "row", justifyContent: "space-between" },
  sectionLabel: { marginTop: 24, marginBottom: 12 },
  pickerWrap: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    backgroundColor: Colors.white,
    overflow: "hidden",
  },
  picker: { color: Colors.text },
  result: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    marginVertical: 16,
  },
  resultText: { fontSize: 13, color: Colors.grey, flex: 1, lineHeight: 20 },
  buttons: { flexDirection: "row", gap: 12 },
  reset: {
    minHeight: 52,
    paddingHorizontal: 14,
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  resetText: { fontSize: 14, color: Colors.text, fontWeight: "600" },
  apply: {
    flex: 1,
    minHeight: 52,
    flexDirection: "row",
    gap: 10,
    padding: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.primary,
    borderRadius: 8,
  },
  applyText: {
    textAlign: "center",
    fontSize: 14,
    color: Colors.white,
    fontWeight: "700",
    flexShrink: 1,
  },
});
