import React, { useRef, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Feather from "react-native-vector-icons/Feather";
import FocusStatusBar from "../component/FocusStatusBar";
import {
  CheckField,
  DateField,
  ErrorText,
  Field,
  PrimaryButton,
  SelectField,
  formStyles,
} from "../component/RegistrationFields";
import { Colors } from "../component/Colors";
import { useMatches } from "../state/MatchContext";
import { getProfileCompletion } from "../data/profileCompletion";
import {
  educationLevels,
  employmentStatuses,
  genders,
  housingStatuses,
  maritalStatuses,
  parseBirthDate,
  religions,
  validateNikFormat,
} from "../data/registration";

const groups = [
  {
    title: "Tentang kamu",
    fields: [
      {
        key: "bio",
        label: "Tentang aku",
        icon: "align-left",
        multiline: true,
        maxLength: 250,
      },
      {
        key: "fullName",
        label: "Nama lengkap sesuai KTP",
        icon: "user",
        maxLength: 100,
      },
      { key: "name", label: "Nama panggilan", icon: "smile", maxLength: 40 },
      {
        key: "gender",
        label: "Jenis kelamin",
        icon: "users",
        options: genders,
      },
      {
        key: "birthDate",
        label: "Tanggal lahir",
        icon: "calendar",
        type: "date",
      },
      { key: "religion", label: "Agama", icon: "sun", options: religions },
      {
        key: "city",
        label: "Tempat tinggal (kota / area)",
        icon: "map-pin",
        maxLength: 80,
      },
    ],
  },
  {
    title: "Pendidikan",
    fields: [
      {
        key: "educationLevel",
        label: "Pendidikan terakhir",
        icon: "book-open",
        options: educationLevels,
      },
      {
        key: "educationStatus",
        label: "Status pendidikan",
        icon: "check-circle",
        options: ["Lulus", "Tidak lulus"],
      },
      { key: "institution", label: "Nama institusi", icon: "home" },
      { key: "major", label: "Jurusan", icon: "book" },
    ],
  },
  {
    title: "Pekerjaan",
    fields: [
      {
        key: "employmentStatus",
        label: "Status pekerjaan",
        icon: "briefcase",
        options: employmentStatuses,
      },
      { key: "employmentField", label: "Bidang pekerjaan", icon: "grid" },
      { key: "jobTitle", label: "Jabatan", icon: "award" },
    ],
  },
  {
    title: "Keluarga",
    fields: [
      {
        key: "maritalStatus",
        label: "Status perkawinan",
        icon: "heart",
        options: maritalStatuses,
      },
      {
        key: "childrenStatus",
        label: "Apakah memiliki anak?",
        icon: "users",
        options: ["Tidak memiliki anak", "Memiliki anak"],
      },
    ],
  },
  {
    title: "Data verifikasi pribadi",
    private: true,
    fields: [
      {
        key: "nik",
        label: "NIK",
        icon: "credit-card",
        maxLength: 16,
        keyboardType: "number-pad",
      },
      { key: "province", label: "Provinsi sesuai KTP", icon: "map" },
      { key: "ktpCity", label: "Kota sesuai KTP", icon: "map-pin" },
      { key: "district", label: "Kecamatan sesuai KTP", icon: "navigation" },
      {
        key: "ktpAddress",
        label: "Alamat sesuai KTP",
        icon: "home",
        multiline: true,
        maxLength: 300,
      },
      {
        key: "sameAddress",
        label: "Alamat KTP sama dengan domisili",
        icon: "copy",
        type: "checkbox",
      },
      {
        key: "domicileAddress",
        label: "Alamat domisili saat ini",
        icon: "map-pin",
        multiline: true,
        maxLength: 300,
      },
      {
        key: "housingStatus",
        label: "Status tempat tinggal",
        icon: "key",
        options: housingStatuses,
      },
    ],
  },
];

export default function EditProfileScreen({ navigation }) {
  const { ownProfile, privateProfile, saveEditedProfile } = useMatches();
  const [draft, setDraft] = useState({ ...ownProfile });
  const [verification, setVerification] = useState({ ...privateProfile });
  const [activeField, setActiveField] = useState(null);
  const [errors, setErrors] = useState({});
  const [nikResult, setNikResult] = useState("");
  const scrollRef = useRef(null);
  const fieldPositions = useRef({});
  const pendingScroll = useRef(null);
  const completion = getProfileCompletion(draft, verification);
  const scrollToField = (key) => {
    const position = fieldPositions.current[key];
    if (!position) return;
    scrollRef.current?.scrollTo({
      y: Math.max(
        0,
        (fieldPositions.current[position.group] || 0) + position.offset - 12
      ),
      animated: true,
    });
  };
  const update = (key, value, sensitive = false) => {
    (sensitive ? setVerification : setDraft)((previous) => ({
      ...previous,
      [key]: value,
    }));
    setErrors((previous) => ({ ...previous, [key]: undefined }));
    if (key === "nik") setNikResult("");
  };
  const save = () => {
    Keyboard.dismiss();
    const result = saveEditedProfile(draft, verification);
    if (result.errors) {
      setErrors(result.errors);
      const key = Object.keys(result.errors)[0];
      const target = key === "maritalConsent" ? "maritalStatus" : key;
      pendingScroll.current = target;
      setActiveField(target);
      scrollToField(target);
      return;
    }
    navigation.goBack();
  };
  const summary = (field, value) => {
    if (field.type === "checkbox")
      return value === true ? "Ya" : value === false ? "Tidak" : "Tambah";
    if (!value?.trim()) return "Tambah";
    if (field.key === "nik") return `************${value.slice(-4)}`;
    if (field.type === "date")
      return (
        parseBirthDate(value)?.toLocaleDateString("id-ID", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }) || "Tambah"
      );
    return value;
  };
  const editor = (field, sensitive) => {
    const value = (sensitive ? verification : draft)[field.key];
    const common = { label: field.label, error: errors[field.key] };
    return (
      <View style={styles.editor}>
        {field.type === "date" ? (
          <DateField
            value={value}
            error={errors[field.key]}
            onChange={(next) => update(field.key, next)}
          />
        ) : field.type === "checkbox" ? (
          <CheckField
            {...common}
            checked={value}
            onChange={(next) => update(field.key, next, sensitive)}
          />
        ) : field.options ? (
          <SelectField
            {...common}
            value={value}
            options={field.options}
            onChange={(next) => update(field.key, next, sensitive)}
          />
        ) : (
          <Field
            {...common}
            value={value || ""}
            onChangeText={(next) => update(field.key, next, sensitive)}
            maxLength={field.maxLength || 120}
            multiline={field.multiline}
            keyboardType={field.keyboardType || "default"}
          />
        )}
        {field.key === "nik" && (
          <>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Cek format NIK"
              style={styles.checkNik}
              onPress={() =>
                setNikResult(
                  validateNikFormat(verification.nik || "")
                    ? "Format 16 digit sesuai. Keaslian NIK belum diverifikasi."
                    : "NIK harus berisi tepat 16 digit angka."
                )
              }
            >
              <Text style={styles.checkNikText}>Cek format NIK</Text>
            </Pressable>
            {!!nikResult && (
              <Text accessibilityLiveRegion="polite" style={formStyles.note}>
                {nikResult}
              </Text>
            )}
          </>
        )}
        {field.key === "maritalStatus" &&
          draft.maritalStatus === "Belum pernah menikah" && (
            <CheckField
              label="Saya menyatakan belum pernah menikah dan menyetujui pemeriksaan yang sah"
              checked={verification.maritalConsent}
              onChange={(value) => update("maritalConsent", value, true)}
              error={errors.maritalConsent}
            />
          )}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Selesai edit ${field.label}`}
          onPress={() => {
            Keyboard.dismiss();
            setActiveField(null);
          }}
          style={styles.done}
        >
          <Text style={styles.doneText}>Selesai</Text>
        </Pressable>
      </View>
    );
  };
  return (
    <SafeAreaView
      style={styles.container}
      edges={["top", "bottom", "left", "right"]}
    >
      <FocusStatusBar />
      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Kembali"
          onPress={() => navigation.goBack()}
          style={styles.back}
        >
          <Feather name="arrow-left" size={23} color={Colors.text} />
        </Pressable>
        <Text accessibilityRole="header" style={styles.title}>
          Edit profil
        </Text>
        <View style={styles.headerSpacer} />
      </View>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          ref={scrollRef}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.content}
          onContentSizeChange={() => {
            if (!pendingScroll.current) return;
            scrollToField(pendingScroll.current);
            pendingScroll.current = null;
          }}
        >
          <View style={styles.inner}>
            <View style={styles.progressSection}>
              <View style={styles.progressHeading}>
                <Text style={styles.sectionTitle}>Kelengkapan profil</Text>
                <Text style={styles.percentage}>{completion.percentage}%</Text>
              </View>
              <View
                accessibilityRole="progressbar"
                accessibilityLabel="Kelengkapan profil"
                accessibilityValue={{
                  min: 0,
                  max: 100,
                  now: completion.percentage,
                }}
                style={styles.track}
              >
                <View
                  style={[
                    styles.progress,
                    { width: `${completion.percentage}%` },
                  ]}
                />
              </View>
              <Text style={styles.caption}>
                {completion.completed} dari {completion.total} data lengkap
              </Text>
            </View>
            {groups.map((group) => (
              <View
                key={group.title}
                onLayout={(event) => {
                  fieldPositions.current[group.title] =
                    event.nativeEvent.layout.y;
                }}
                style={styles.section}
              >
                <View style={styles.sectionHeading}>
                  <Text accessibilityRole="header" style={styles.sectionTitle}>
                    {group.title}
                  </Text>
                  {group.private && (
                    <Feather name="lock" size={16} color={Colors.grey} />
                  )}
                </View>
                {group.private && (
                  <Text style={styles.privateNote}>
                    NIK dan alamat lengkap tidak tampil di profil publik. Data
                    demo disimpan sementara, belum dikirim ke tim verifikasi.
                  </Text>
                )}
                {group.fields
                  .filter(
                    (field) =>
                      field.key !== "domicileAddress" ||
                      !verification.sameAddress
                  )
                  .map((field) => {
                    const value = (group.private ? verification : draft)[
                      field.key
                    ];
                    const expanded = activeField === field.key;
                    const preview = summary(field, value);
                    return (
                      <View
                        key={field.key}
                        onLayout={(event) => {
                          fieldPositions.current[field.key] = {
                            group: group.title,
                            offset: event.nativeEvent.layout.y,
                          };
                        }}
                        style={styles.fieldRow}
                      >
                        <Pressable
                          accessibilityRole="button"
                          accessibilityLabel={`Edit ${field.label}`}
                          accessibilityState={{ expanded }}
                          onPress={() => {
                            Keyboard.dismiss();
                            setActiveField(expanded ? null : field.key);
                          }}
                          style={styles.row}
                        >
                          <Feather
                            name={field.icon}
                            size={18}
                            color={Colors.grey}
                          />
                          <View style={styles.rowContent}>
                            <Text style={styles.rowLabel}>{field.label}</Text>
                            <Text
                              numberOfLines={field.key === "bio" ? 3 : 1}
                              style={[
                                styles.value,
                                preview === "Tambah" && styles.emptyValue,
                              ]}
                            >
                              {preview}
                            </Text>
                          </View>
                          <Feather
                            name={
                              expanded
                                ? "minus"
                                : preview === "Tambah"
                                ? "plus"
                                : "edit-2"
                            }
                            size={16}
                            color={expanded ? Colors.main : Colors.grey}
                          />
                        </Pressable>
                        {expanded ? (
                          editor(field, Boolean(group.private))
                        ) : (
                          <ErrorText>
                            {errors[field.key] ||
                              (field.key === "maritalStatus" &&
                                errors.maritalConsent)}
                          </ErrorText>
                        )}
                      </View>
                    );
                  })}
              </View>
            ))}
            {Object.values(errors).some(Boolean) && (
              <ErrorText>Periksa kembali kolom yang ditandai.</ErrorText>
            )}
          </View>
        </ScrollView>
        <View style={styles.footer}>
          <View style={styles.inner}>
            <PrimaryButton label="Simpan profil" onPress={save} />
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  flex: { flex: 1 },
  header: {
    minHeight: 60,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderColor: Colors.border,
  },
  back: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  headerSpacer: { width: 44 },
  title: {
    flex: 1,
    textAlign: "center",
    color: Colors.text,
    fontSize: 18,
    fontWeight: "700",
  },
  content: { paddingHorizontal: 24, paddingBottom: 24 },
  inner: { width: "100%", maxWidth: 480, alignSelf: "center" },
  progressSection: { paddingTop: 24, paddingBottom: 8 },
  progressHeading: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  percentage: { fontSize: 15, color: Colors.main, fontWeight: "700" },
  track: {
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.border,
    marginTop: 14,
    overflow: "hidden",
  },
  progress: { height: "100%", backgroundColor: Colors.main },
  caption: { fontSize: 12, color: Colors.grey, marginTop: 8 },
  section: { marginTop: 28 },
  sectionHeading: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.text,
    flexShrink: 1,
  },
  privateNote: {
    fontSize: 12,
    lineHeight: 19,
    color: Colors.grey,
    marginBottom: 12,
  },
  fieldRow: { borderBottomWidth: 1, borderColor: Colors.border },
  row: {
    minHeight: 68,
    paddingVertical: 14,
    flexDirection: "row",
    gap: 14,
    alignItems: "center",
  },
  rowContent: { flex: 1, gap: 4 },
  rowLabel: {
    fontSize: 13,
    lineHeight: 19,
    color: Colors.text,
    fontWeight: "500",
  },
  value: { fontSize: 13, lineHeight: 19, color: Colors.grey },
  emptyValue: { color: Colors.main },
  editor: { paddingTop: 8, paddingBottom: 16 },
  done: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 44,
    backgroundColor: Colors.light,
    borderRadius: 8,
  },
  doneText: {
    textAlign: "center",
    color: Colors.text,
    fontSize: 13,
    fontWeight: "600",
  },
  checkNik: {
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
  },
  checkNikText: {
    color: Colors.text,
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 12,
    borderTopWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
  },
});
