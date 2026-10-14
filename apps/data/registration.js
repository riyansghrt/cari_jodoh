export const DEMO_OTP = "123456";
export const religions = ["Islam", "Hindu", "Katolik", "Kristen", "Buddha"];
export const genders = ["Pria", "Wanita"];
export const educationLevels = [
  "SMA",
  "SMK",
  "D1 - D3",
  "D4 - S1",
  "S2",
  "S3",
  "Lainnya",
];
export const employmentStatuses = [
  "Karyawan swasta",
  "PNS / ASN",
  "TNI / Polri",
  "Pengusaha",
  "Profesional / Freelancer",
  "Mahasiswa",
  "IRT",
  "Tidak bekerja",
  "Lainnya",
];
export const maritalStatuses = [
  "Belum pernah menikah",
  "Cerai hidup",
  "Cerai mati",
];
export const housingStatuses = [
  "Milik sendiri",
  "Orang tua / keluarga",
  "Sewa / kontrak",
  "Lainnya",
];

export function normalizePhone(value) {
  const phone = value.trim().replace(/[\s()-]/g, "");
  if (!/^(?:\+62|62|0)8\d{8,11}$/.test(phone)) return null;
  return phone.startsWith("+")
    ? phone
    : phone.startsWith("62")
    ? `+${phone}`
    : `+62${phone.slice(1)}`;
}
export function normalizeContact(value) {
  const contact = value.trim();
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact)) return contact.toLowerCase();
  return normalizePhone(contact);
}
export function parseBirthDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value || "")) return null;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
    ? date
    : null;
}
export function ageFromBirthDate(value, today = new Date()) {
  const date = parseBirthDate(value);
  if (!date || date > today) return null;
  const beforeBirthday =
    today.getMonth() < date.getMonth() ||
    (today.getMonth() === date.getMonth() && today.getDate() < date.getDate());
  return today.getFullYear() - date.getFullYear() - Number(beforeBirthday);
}
export function validateBasicProfile(profile, today = new Date()) {
  const errors = {};
  if (!profile.fullName?.trim())
    errors.fullName = "Isi nama lengkap sesuai KTP.";
  if (!profile.name?.trim()) errors.name = "Isi nama panggilan.";
  if (!genders.includes(profile.gender)) errors.gender = "Pilih jenis kelamin.";
  if (!religions.includes(profile.religion)) errors.religion = "Pilih agama.";
  const age = ageFromBirthDate(profile.birthDate, today);
  if (age === null) errors.birthDate = "Pilih tanggal lahir yang benar.";
  else if (age < 19)
    errors.birthDate = "Pendaftaran ditolak. Usia minimal 19 tahun.";
  if (!profile.city?.trim()) errors.city = "Isi kota / area tempat tinggal.";
  return errors;
}
export const validateNikFormat = (value) => /^\d{16}$/.test(value);
export function validateAdditionalProfile(profile, verification) {
  const errors = {};
  const choices = {
    educationLevel: educationLevels,
    educationStatus: ["Lulus", "Tidak lulus"],
    employmentStatus: employmentStatuses,
    maritalStatus: maritalStatuses,
    childrenStatus: ["Tidak memiliki anak", "Memiliki anak"],
  };
  Object.entries(choices).forEach(([key, values]) => {
    if (profile[key] && !values.includes(profile[key]))
      errors[key] = "Pilih salah satu opsi yang tersedia.";
  });
  if (
    verification.housingStatus &&
    !housingStatuses.includes(verification.housingStatus)
  )
    errors.housingStatus = "Pilih status tempat tinggal yang tersedia.";
  if (verification.nik && !validateNikFormat(verification.nik))
    errors.nik = "NIK harus berisi tepat 16 digit angka.";
  if (
    verification.ktpAddress &&
    !verification.sameAddress &&
    !verification.domicileAddress?.trim()
  )
    errors.domicileAddress = "Isi alamat domisili saat ini.";
  if (
    profile.maritalStatus === "Belum pernah menikah" &&
    !verification.maritalConsent
  )
    errors.maritalConsent =
      "Pernyataan dan persetujuan pemeriksaan wajib disetujui.";
  return errors;
}
