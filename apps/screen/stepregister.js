import React, { useState } from "react";
import { Text, View, StyleSheet } from "react-native";
import {
  ErrorText,
  Field,
  SelectField,
  DateField,
  FormPage,
  PrimaryButton,
  formStyles,
} from "../component/RegistrationFields";
import {
  genders,
  religions,
  normalizePhone,
  validateBasicProfile,
} from "../data/registration";
import { useMatches } from "../state/MatchContext";
import { Colors } from "../component/Colors";

export default function StepRegister({ navigation }) {
  const {
    ownProfile,
    registrationPhone,
    finishRegistration,
    isAccountVerified,
  } = useMatches();
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState({
    ...ownProfile,
    phone: registrationPhone,
  });
  const [errors, setErrors] = useState({});
  const [error, setError] = useState("");
  const update = (key, value) => {
    setDraft((previous) => ({ ...previous, [key]: value }));
    setErrors((previous) => ({ ...previous, [key]: undefined }));
    setError("");
  };
  const back = () =>
    step
      ? setStep(0)
      : navigation.reset({ index: 0, routes: [{ name: "LoginScreen" }] });
  const next = () => {
    const all = validateBasicProfile(draft);
    if (!normalizePhone(draft.phone))
      all.phone = "Isi nomor HP Indonesia yang valid.";
    const keys =
      step === 0 ? ["phone", "fullName", "name", "gender"] : Object.keys(all);
    const selected = Object.fromEntries(
      Object.entries(all).filter(([key]) => keys.includes(key))
    );
    setErrors(selected);
    if (Object.keys(selected).length) return;
    if (!step) {
      setStep(1);
      return;
    }
    const result = finishRegistration(draft, draft.phone);
    if (result.errors) {
      setErrors(result.errors);
      if (
        ["phone", "fullName", "name", "gender"].some(
          (key) => result.errors[key]
        )
      )
        setStep(0);
    } else if (result.error) setError(result.error);
    else navigation.reset({ index: 0, routes: [{ name: "MainTabs" }] });
  };
  return (
    <FormPage
      title={step ? "Tempatmu memulai cerita" : "Kenalan dulu, yuk"}
      subtitle="Isi data utama terlebih dahulu. Data lainnya bisa dilengkapi nanti."
      onBack={back}
    >
      {!isAccountVerified ? (
        <PrimaryButton
          label="Verifikasi akun dahulu"
          onPress={() =>
            navigation.reset({ index: 0, routes: [{ name: "LoginScreen" }] })
          }
        />
      ) : (
        <>
          <View style={styles.progress}>
            <View style={styles.active} />
            <View style={[styles.bar, step === 1 && styles.active]} />
          </View>
          <Text style={formStyles.note}>Langkah {step + 1} dari 2</Text>
          {!step ? (
            <>
              <Field
                label="Nomor HP"
                value={draft.phone}
                onChangeText={(value) => update("phone", value)}
                keyboardType="phone-pad"
                maxLength={20}
                placeholder="08xxxxxxxxxx"
                error={errors.phone}
              />
              <Field
                label="Nama lengkap sesuai KTP"
                value={draft.fullName}
                onChangeText={(value) => update("fullName", value)}
                maxLength={100}
                error={errors.fullName}
              />
              <Field
                label="Nama panggilan"
                value={draft.name}
                onChangeText={(value) => update("name", value)}
                maxLength={40}
                error={errors.name}
              />
              <SelectField
                label="Jenis kelamin"
                options={genders}
                value={draft.gender}
                onChange={(value) => update("gender", value)}
                error={errors.gender}
              />
            </>
          ) : (
            <>
              <SelectField
                label="Agama"
                options={religions}
                value={draft.religion}
                onChange={(value) => update("religion", value)}
                error={errors.religion}
              />
              <DateField
                value={draft.birthDate}
                onChange={(value) => update("birthDate", value)}
                error={errors.birthDate}
              />
              <Text style={formStyles.note}>Usia minimal 19 tahun.</Text>
              <Field
                label="Tempat tinggal (kota / area)"
                value={draft.city}
                onChangeText={(value) => update("city", value)}
                maxLength={80}
                error={errors.city}
              />
            </>
          )}
          <ErrorText>{error}</ErrorText>
          <PrimaryButton
            label={step ? "Selesai dan masuk" : "Lanjutkan"}
            onPress={next}
          />
        </>
      )}
    </FormPage>
  );
}
const styles = StyleSheet.create({
  progress: { flexDirection: "row", gap: 8 },
  bar: { height: 3, flex: 1, backgroundColor: Colors.border },
  active: { height: 3, flex: 1, backgroundColor: Colors.primary },
});
