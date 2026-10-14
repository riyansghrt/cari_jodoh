import React, { useRef, useState } from "react";
import {
  Keyboard,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Feather from "react-native-vector-icons/Feather";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  CheckField,
  ErrorText,
  Field,
  FormPage,
  PrimaryButton,
  formStyles,
} from "../component/RegistrationFields";
import FocusStatusBar from "../component/FocusStatusBar";
import { Colors } from "../component/Colors";
import { useMatches } from "../state/MatchContext";
import { normalizeContact } from "../data/registration";
import { termsSections } from "../data/terms";

export default function LoginScreen({ navigation }) {
  const { requestOtp } = useMatches();
  const [contact, setContact] = useState("");
  const [pendingContact, setPendingContact] = useState(null);
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");
  const [consentError, setConsentError] = useState("");
  const submitting = useRef(false);
  const submit = () => {
    Keyboard.dismiss();
    const normalized = normalizeContact(contact);
    if (!normalized) {
      setError("Masukkan nomor HP Indonesia atau email yang valid.");
      return;
    }
    setError("");
    setConsentError("");
    setAgreed(false);
    submitting.current = false;
    setPendingContact(normalized);
  };
  const close = () => {
    setPendingContact(null);
    setAgreed(false);
    setConsentError("");
  };
  const accept = () => {
    if (!pendingContact || submitting.current) return;
    if (!agreed) {
      setConsentError("Setujui syarat layanan dan kebijakan privasi.");
      return;
    }
    submitting.current = true;
    const result = requestOtp(pendingContact, {
      terms: agreed,
      privacy: agreed,
    });
    if (result.error) {
      submitting.current = false;
      setConsentError(result.error);
      return;
    }
    close();
    navigation.navigate("OtpScreen");
  };
  return (
    <>
      <FormPage
        title="Awal dari cerita baru"
        subtitle="Masuk atau daftar dengan nomor HP atau email."
      >
        <Field
          label="Nomor HP / email"
          placeholder="08xxxxxxxxxx atau nama@email.com"
          value={contact}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          maxLength={254}
          onChangeText={(value) => {
            setContact(value);
            setError("");
          }}
        />
        <ErrorText>{error}</ErrorText>
        <PrimaryButton label="Kirim OTP" onPress={submit} />
        <Text style={formStyles.note}>
          Akun demo. OTP belum terhubung ke layanan SMS atau email.
        </Text>
      </FormPage>
      {pendingContact !== null && (
        <Modal visible animationType="slide" onRequestClose={close}>
          <SafeAreaView
            style={styles.document}
            edges={["top", "bottom", "left", "right"]}
          >
            <FocusStatusBar />
            <View style={styles.documentHeading}>
              <Text accessibilityRole="header" style={styles.documentTitle}>
                Syarat dan ketentuan
              </Text>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Tutup syarat dan ketentuan"
                onPress={close}
                style={styles.close}
              >
                <Feather name="x" size={24} color={Colors.text} />
              </Pressable>
            </View>
            <ScrollView
              style={styles.scroll}
              contentContainerStyle={styles.documentContent}
            >
              <View style={styles.inner}>
                <Text style={styles.draft}>DRAF DEMO</Text>
                <Text style={styles.intro}>
                  Ketentuan layanan dan privasi Cari Jodoh
                </Text>
                <Text style={styles.body}>
                  Dokumen ini masih berupa draf untuk pengujian. Dokumen resmi
                  perlu ditinjau sebelum layanan diluncurkan.
                </Text>
                {termsSections.map((section) => (
                  <View key={section.title}>
                    <Text
                      accessibilityRole="header"
                      style={styles.sectionTitle}
                    >
                      {section.title}
                    </Text>
                    <Text style={styles.body}>{section.body}</Text>
                  </View>
                ))}
                <View style={styles.consents}>
                  <Text style={styles.sectionTitle}>Persetujuan kamu</Text>
                  <CheckField
                    label="Saya menyetujui syarat layanan dan kebijakan privasi"
                    checked={agreed}
                    onChange={(value) => {
                      setAgreed(value);
                      setConsentError("");
                    }}
                  />
                  <ErrorText>{consentError}</ErrorText>
                  <PrimaryButton
                    label="Setuju dan kirim OTP"
                    disabled={!agreed}
                    onPress={accept}
                  />
                </View>
              </View>
            </ScrollView>
          </SafeAreaView>
        </Modal>
      )}
    </>
  );
}
const styles = StyleSheet.create({
  document: { flex: 1, backgroundColor: Colors.white },
  documentHeading: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: Colors.border,
  },
  documentTitle: {
    fontSize: 20,
    color: Colors.text,
    fontWeight: "700",
    flex: 1,
  },
  close: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  scroll: { flex: 1 },
  documentContent: { padding: 24, paddingBottom: 36 },
  inner: { width: "100%", maxWidth: 560, alignSelf: "center" },
  draft: {
    fontSize: 11,
    fontWeight: "700",
    color: Colors.main,
    marginBottom: 12,
  },
  intro: {
    fontSize: 22,
    lineHeight: 30,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 15,
    lineHeight: 23,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 10,
  },
  body: { fontSize: 14, lineHeight: 24, color: Colors.grey, marginBottom: 24 },
  consents: { borderTopWidth: 1, borderColor: Colors.border, paddingTop: 24 },
});
