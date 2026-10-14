import React, { createContext, useContext, useRef, useState } from "react";
import { profiles } from "../data/profiles";
import {
  DEMO_OTP,
  normalizeContact,
  normalizePhone,
  validateBasicProfile,
  validateAdditionalProfile,
} from "../data/registration";

const MatchContext = createContext(null);
const initialOwnProfile = {
  name: "Admin",
  fullName: "Admin Demo",
  gender: "Pria",
  birthDate: "1995-01-01",
  city: "Jakarta",
  bio: "Mencari seseorang untuk berbagi cerita dan tumbuh bersama.",
  interests: ["Kopi", "Traveling", "Musik"],
  religion: "Islam",
  relationshipIntent: "marriage",
};

export function MatchProvider({ children }) {
  const [likedIds, setLikedIds] = useState([]);
  const [messages, setMessages] = useState({});
  const [ownProfile, setOwnProfile] = useState({ ...initialOwnProfile });
  const [subscription, setSubscription] = useState(null);
  // Demo accounts live only in memory; private verification fields never enter public profiles.
  const accounts = useRef({});
  const challengeRef = useRef(null);
  const verifiedAccount = useRef(null);
  const [otpChallenge, setOtpChallenge] = useState(null);
  const [privateProfile, setPrivateProfile] = useState({ sameAddress: true });
  const [registrationPhone, setRegistrationPhone] = useState("");
  const requestOtp = (value, consents, now = Date.now()) => {
    const contact = normalizeContact(value);
    if (!contact)
      return { error: "Masukkan nomor HP Indonesia atau email yang valid." };
    if (consents?.terms !== true || consents?.privacy !== true)
      return { error: "Setujui syarat layanan dan kebijakan privasi." };
    if (
      challengeRef.current?.contact === contact &&
      now < challengeRef.current.resendAt
    )
      return { error: "Tunggu sebelum mengirim ulang OTP." };
    const next = {
      contact,
      expiresAt: now + 300000,
      resendAt: now + 30000,
      attempts: 0,
      consents: {
        ...consents,
        version: "demo-v1",
        acceptedAt: consents.acceptedAt || new Date(now).toISOString(),
      },
    };
    challengeRef.current = next;
    verifiedAccount.current = null;
    setPrivateProfile({ sameAddress: true });
    setOtpChallenge(next);
    return { contact };
  };
  const verifyOtp = (code, now = Date.now()) => {
    const challenge = challengeRef.current;
    if (!challenge)
      return { error: "Minta OTP dari halaman masuk terlebih dahulu." };
    if (now >= challenge.expiresAt)
      return { error: "OTP kedaluwarsa. Kirim ulang untuk melanjutkan." };
    if (challenge.attempts >= 5)
      return { error: "Batas percobaan tercapai. Kirim ulang OTP." };
    if (code !== DEMO_OTP) {
      const next = { ...challenge, attempts: challenge.attempts + 1 };
      challengeRef.current = next;
      setOtpChallenge(next);
      return { error: "OTP salah. Periksa kembali enam digit kode kamu." };
    }
    const existing = accounts.current[challenge.contact];
    verifiedAccount.current = {
      contact: challenge.contact,
      consents: challenge.consents,
    };
    setOwnProfile(
      existing?.profile || {
        ...initialOwnProfile,
        name: "",
        fullName: "",
        city: "",
        gender: "",
        religion: "",
        birthDate: "",
        bio: "",
      }
    );
    setRegistrationPhone(
      existing?.phone || normalizePhone(challenge.contact) || ""
    );
    setPrivateProfile({ sameAddress: true });
    setLikedIds([]);
    setMessages({});
    setSubscription(null);
    challengeRef.current = null;
    setOtpChallenge(null);
    return {
      needsRegistration:
        !existing ||
        Object.keys(validateBasicProfile(existing.profile)).length > 0,
    };
  };
  const finishRegistration = (draft, phone) => {
    if (!verifiedAccount.current)
      return { error: "Verifikasi OTP terlebih dahulu." };
    const errors = validateBasicProfile(draft);
    const normalized = normalizePhone(phone);
    if (!normalized) errors.phone = "Isi nomor HP Indonesia yang valid.";
    const verifiedPhone = normalizePhone(verifiedAccount.current.contact);
    if (normalized && verifiedPhone && normalized !== verifiedPhone)
      errors.phone = "Nomor HP harus sama dengan nomor yang diverifikasi.";
    if (Object.keys(errors).length) return { errors };
    const profile = {
      ...initialOwnProfile,
      fullName: draft.fullName.trim(),
      name: draft.name.trim(),
      gender: draft.gender,
      religion: draft.religion,
      birthDate: draft.birthDate,
      city: draft.city.trim(),
      bio: "",
    };
    accounts.current[verifiedAccount.current.contact] = {
      profile,
      phone: normalized,
      consents: verifiedAccount.current.consents,
    };
    setOwnProfile(profile);
    setRegistrationPhone(normalized);
    return { ok: true };
  };
  const saveEditedProfile = (draft, verification = { sameAddress: true }) => {
    const errors = {
      ...validateBasicProfile(draft),
      ...validateAdditionalProfile(draft, verification),
    };
    if (Object.keys(errors).length) return { errors };
    // Explicitly select public fields so NIK and exact addresses cannot leak via object spreads.
    const publicFields = [
      "name",
      "fullName",
      "gender",
      "religion",
      "birthDate",
      "city",
      "bio",
      "interests",
      "relationshipIntent",
      "educationLevel",
      "educationStatus",
      "institution",
      "major",
      "employmentStatus",
      "employmentField",
      "jobTitle",
      "maritalStatus",
      "childrenStatus",
    ];
    const profile = Object.fromEntries(
      publicFields
        .filter((key) => draft[key] !== undefined)
        .map((key) => [
          key,
          typeof draft[key] === "string" ? draft[key].trim() : draft[key],
        ])
    );
    setOwnProfile(profile);
    setPrivateProfile({
      ...verification,
      domicileAddress: verification.sameAddress
        ? verification.ktpAddress || ""
        : verification.domicileAddress || "",
    });
    if (
      verifiedAccount.current &&
      accounts.current[verifiedAccount.current.contact]
    )
      accounts.current[verifiedAccount.current.contact].profile = profile;
    return { ok: true };
  };
  const isMatched = (id) =>
    likedIds.includes(id) &&
    profiles.some((profile) => profile.id === id && profile.likesYou);
  const toggleLike = (id) => {
    if (!profiles.some((profile) => profile.id === id)) return;
    setLikedIds((previous) =>
      previous.includes(id)
        ? previous.filter((value) => value !== id)
        : [...previous, id]
    );
  };
  const sendMessage = (id, text) => {
    const content = text.trim();
    if (!isMatched(id) || !content || content.length > 1000) return false;
    setMessages((previous) => ({
      ...previous,
      [id]: [
        ...(previous[id] || []),
        {
          id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
          text: content,
        },
      ],
    }));
    return true;
  };
  const resetSession = () => {
    setLikedIds([]);
    setMessages({});
    setOwnProfile({ ...initialOwnProfile });
    setSubscription(null);
    verifiedAccount.current = null;
    challengeRef.current = null;
    setOtpChallenge(null);
    setPrivateProfile({ sameAddress: true });
    setRegistrationPhone("");
  };
  return (
    <MatchContext.Provider
      value={{
        likedIds,
        toggleLike,
        isMatched,
        messages,
        sendMessage,
        resetSession,
        ownProfile,
        setOwnProfile,
        subscription,
        setSubscription,
        otpChallenge,
        requestOtp,
        verifyOtp,
        finishRegistration,
        registrationPhone,
        privateProfile,
        saveEditedProfile,
        isAccountVerified: Boolean(verifiedAccount.current),
      }}
    >
      {children}
    </MatchContext.Provider>
  );
}

export function useMatches() {
  const context = useContext(MatchContext);
  if (!context) throw new Error("useMatches must be used inside MatchProvider");
  return context;
}
