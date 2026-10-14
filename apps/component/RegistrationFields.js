import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import Feather from "react-native-vector-icons/Feather";
import { Colors } from "./Colors";
import FocusStatusBar from "./FocusStatusBar";
import BrandLogo from "./BrandLogo";
import { parseBirthDate } from "../data/registration";

export function ErrorText({ children }) {
  return children ? (
    <Text accessibilityLiveRegion="polite" style={formStyles.error}>
      {children}
    </Text>
  ) : null;
}
export function Field({ label, error, ...props }) {
  return (
    <View style={formStyles.field}>
      <Text style={formStyles.label}>{label}</Text>
      <TextInput
        accessibilityLabel={label}
        placeholderTextColor={Colors.grey}
        style={[
          formStyles.input,
          props.multiline && formStyles.multiline,
          error && formStyles.invalid,
        ]}
        {...props}
      />
      <ErrorText>{error}</ErrorText>
    </View>
  );
}
export function SelectField({ label, options, value, onChange, error }) {
  return (
    <View style={formStyles.field}>
      <Text style={formStyles.label}>{label}</Text>
      <View style={[formStyles.picker, error && formStyles.invalid]}>
        <Picker
          accessibilityLabel={label}
          selectedValue={value || ""}
          onValueChange={onChange}
          dropdownIconColor={Colors.text}
        >
          <Picker.Item label="Pilih..." value="" />
          {options.map((option) => (
            <Picker.Item key={option} label={option} value={option} />
          ))}
        </Picker>
      </View>
      <ErrorText>{error}</ErrorText>
    </View>
  );
}
export function CheckField({ label, checked, onChange, error }) {
  return (
    <View style={formStyles.field}>
      <Pressable
        accessibilityRole="checkbox"
        accessibilityLabel={label}
        accessibilityState={{ checked: Boolean(checked) }}
        onPress={() => onChange(!checked)}
        style={formStyles.checkRow}
      >
        <Feather
          name={checked ? "check-square" : "square"}
          size={23}
          color={Colors.text}
        />
        <Text style={formStyles.checkText}>{label}</Text>
      </Pressable>
      <ErrorText>{error}</ErrorText>
    </View>
  );
}
export function DateField({ value, onChange, error }) {
  const [open, setOpen] = useState(false);
  const parsed = parseBirthDate(value);
  return (
    <View style={formStyles.field}>
      <Text style={formStyles.label}>Tanggal lahir</Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Tanggal lahir"
        style={[formStyles.date, error && formStyles.invalid]}
        onPress={() => setOpen(true)}
      >
        <Text style={[formStyles.dateText, !parsed && { color: Colors.grey }]}>
          {parsed
            ? parsed.toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })
            : "Pilih tanggal lahir"}
        </Text>
        <Feather name="calendar" size={20} color={Colors.grey} />
      </Pressable>
      <ErrorText>{error}</ErrorText>
      {open && (
        <DateTimePicker
          value={parsed || new Date(new Date().getFullYear() - 25, 0, 1)}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          maximumDate={new Date()}
          minimumDate={new Date(1900, 0, 1)}
          onChange={(event, date) => {
            if (Platform.OS !== "ios") setOpen(false);
            if (event.type === "dismissed" || !date) return;
            onChange(
              `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
                2,
                "0"
              )}-${String(date.getDate()).padStart(2, "0")}`
            );
          }}
        />
      )}
      {open && Platform.OS === "ios" && (
        <Pressable
          accessibilityRole="button"
          onPress={() => setOpen(false)}
          style={formStyles.dateDone}
        >
          <Text>Selesai</Text>
        </Pressable>
      )}
    </View>
  );
}
export function PrimaryButton({ label, onPress, disabled = false }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={[formStyles.primary, disabled && { opacity: 0.4 }]}
    >
      <Text style={formStyles.primaryText}>{label}</Text>
    </Pressable>
  );
}
export function FormPage({ title, subtitle, onBack, children }) {
  return (
    <SafeAreaView
      style={formStyles.container}
      edges={["top", "bottom", "left", "right"]}
    >
      <FocusStatusBar />
      <KeyboardAvoidingView
        style={formStyles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={formStyles.content}
        >
          <View style={formStyles.inner}>
            <View style={formStyles.heading}>
              {onBack && (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Kembali"
                  onPress={onBack}
                  style={formStyles.back}
                >
                  <Feather name="arrow-left" size={23} color={Colors.text} />
                </Pressable>
              )}
              <BrandLogo />
              <Text style={formStyles.brand}>Cari Jodoh</Text>
            </View>
            <Text accessibilityRole="header" style={formStyles.title}>
              {title}
            </Text>
            {!!subtitle && <Text style={formStyles.subtitle}>{subtitle}</Text>}
            {children}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
export const formStyles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1, backgroundColor: Colors.white },
  content: { flexGrow: 1, padding: 24, paddingBottom: 36 },
  inner: { width: "100%", maxWidth: 480, alignSelf: "center" },
  heading: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 36,
  },
  brand: { fontSize: 20, fontWeight: "700", color: Colors.text, flexShrink: 1 },
  back: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: -12,
  },
  title: {
    fontSize: 28,
    lineHeight: 36,
    fontWeight: "700",
    color: Colors.text,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 23,
    color: Colors.grey,
    marginTop: 10,
    marginBottom: 28,
  },
  field: { marginBottom: 18 },
  label: {
    fontSize: 13,
    lineHeight: 20,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 8,
  },
  input: {
    minHeight: 50,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: Colors.text,
    backgroundColor: Colors.white,
  },
  multiline: { minHeight: 90, textAlignVertical: "top" },
  picker: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    overflow: "hidden",
  },
  invalid: { borderColor: "#B42336" },
  error: {
    color: "#B42336",
    fontSize: 12,
    lineHeight: 19,
    marginTop: 7,
    marginBottom: 10,
  },
  checkRow: {
    minHeight: 44,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  checkText: { flex: 1, color: Colors.text, fontSize: 13, lineHeight: 21 },
  date: {
    minHeight: 50,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    padding: 14,
    gap: 10,
  },
  dateText: { flex: 1, color: Colors.text, fontSize: 15 },
  dateDone: { minHeight: 44, alignItems: "flex-end", justifyContent: "center" },
  primary: {
    minHeight: 52,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    backgroundColor: Colors.primary,
    borderRadius: 8,
    marginTop: 12,
  },
  primaryText: {
    textAlign: "center",
    color: Colors.white,
    fontSize: 14,
    fontWeight: "700",
    flexShrink: 1,
  },
  note: {
    color: Colors.grey,
    fontSize: 12,
    lineHeight: 20,
    marginVertical: 16,
  },
  section: {
    fontSize: 19,
    lineHeight: 27,
    color: Colors.text,
    fontWeight: "700",
    marginTop: 24,
    marginBottom: 18,
  },
});
