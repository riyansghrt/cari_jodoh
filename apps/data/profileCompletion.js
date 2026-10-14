import {
  ageFromBirthDate,
  educationLevels,
  employmentStatuses,
  genders,
  housingStatuses,
  maritalStatuses,
  religions,
  validateNikFormat,
} from "./registration";

const filled = (value) => typeof value === "string" && value.trim().length > 0;

export function getProfileCompletion(
  profile = {},
  verification = {},
  today = new Date()
) {
  const age = ageFromBirthDate(profile.birthDate, today);
  const checks = [
    filled(profile.fullName),
    filled(profile.name),
    genders.includes(profile.gender),
    religions.includes(profile.religion),
    age !== null && age >= 19,
    filled(profile.city),
    validateNikFormat(verification.nik || ""),
    filled(verification.province),
    filled(verification.ktpCity),
    filled(verification.district),
    filled(verification.ktpAddress),
    verification.sameAddress === true
      ? filled(verification.ktpAddress)
      : verification.sameAddress === false &&
        filled(verification.domicileAddress),
    housingStatuses.includes(verification.housingStatus),
    educationLevels.includes(profile.educationLevel),
    ["Lulus", "Tidak lulus"].includes(profile.educationStatus),
    filled(profile.institution),
    filled(profile.major),
    employmentStatuses.includes(profile.employmentStatus),
    maritalStatuses.includes(profile.maritalStatus),
    ["Tidak memiliki anak", "Memiliki anak"].includes(profile.childrenStatus),
  ];
  if (
    !["Mahasiswa", "IRT", "Tidak bekerja"].includes(profile.employmentStatus)
  ) {
    checks.push(filled(profile.employmentField), filled(profile.jobTitle));
  }
  if (profile.maritalStatus === "Belum pernah menikah")
    checks.push(verification.maritalConsent === true);
  const completed = checks.filter(Boolean).length;
  const total = checks.length;
  return {
    completed,
    total,
    percentage:
      completed === total ? 100 : Math.floor((completed / total) * 100),
  };
}
