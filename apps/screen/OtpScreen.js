import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import {
  ErrorText,
  Field,
  FormPage,
  PrimaryButton,
  formStyles,
} from "../component/RegistrationFields";
import { useMatches } from "../state/MatchContext";
import { DEMO_OTP } from "../data/registration";
import { Colors } from "../component/Colors";

export default function OtpScreen({ navigation }) {
  const { otpChallenge, verifyOtp, requestOtp } = useMatches();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);
  const back = () =>
    navigation.reset({ index: 0, routes: [{ name: "LoginScreen" }] });
  const remaining = Math.max(
    0,
    Math.ceil(((otpChallenge?.resendAt || 0) - now) / 1000)
  );
  const verify = () => {
    if (!/^\d{6}$/.test(code)) {
      setError("Masukkan enam digit OTP.");
      return;
    }
    const result = verifyOtp(code);
    if (result.error) {
      setError(result.error);
      return;
    }
    navigation.reset({
      index: 0,
      routes: [
        { name: result.needsRegistration ? "StepRegister" : "MainTabs" },
      ],
    });
  };
  return (
    <FormPage
      title="Verifikasi akun"
      subtitle={
        otpChallenge
          ? `Kode untuk ${otpChallenge.contact}`
          : "Minta OTP terlebih dahulu."
      }
      onBack={back}
    >
      {otpChallenge ? (
        <>
          <Text style={styles.demo}>
            Mode demo: OTP {DEMO_OTP}. Tidak ada SMS atau email yang dikirim.
          </Text>
          <Field
            label="Kode OTP"
            placeholder="6 digit"
            value={code}
            keyboardType="number-pad"
            maxLength={6}
            textContentType="oneTimeCode"
            autoComplete="sms-otp"
            onChangeText={(value) => {
              setCode(value.replace(/\D/g, ""));
              setError("");
            }}
          />
          <ErrorText>{error}</ErrorText>
          <PrimaryButton label="Verifikasi OTP" onPress={verify} />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Kirim ulang OTP"
            disabled={remaining > 0}
            accessibilityState={{ disabled: remaining > 0 }}
            style={styles.resend}
            onPress={() => {
              const result = requestOtp(
                otpChallenge.contact,
                otpChallenge.consents
              );
              setError(result.error || "");
              if (!result.error) {
                setCode("");
                setNow(Date.now());
              }
            }}
          >
            <Text style={styles.resendText}>
              {remaining
                ? `Kirim ulang dalam ${remaining} detik`
                : "Kirim ulang OTP"}
            </Text>
          </Pressable>
          <Text style={formStyles.note}>
            Kode berlaku 5 menit, maksimal 5 percobaan.
          </Text>
        </>
      ) : (
        <PrimaryButton label="Kembali ke masuk" onPress={back} />
      )}
    </FormPage>
  );
}
const styles = StyleSheet.create({
  demo: {
    padding: 14,
    borderRadius: 8,
    backgroundColor: Colors.light,
    color: Colors.text,
    fontSize: 13,
    lineHeight: 22,
    marginBottom: 24,
  },
  resend: {
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 14,
  },
  resendText: { color: Colors.grey, fontSize: 13 },
});
