import React from "react";
import TestRenderer, { act } from "react-test-renderer";
import { StyleSheet, View } from "react-native";
import { getProfileCompletion } from "../apps/data/profileCompletion";
import ProfileProgressRing from "../apps/component/ProfileProgressRing";
import { Colors } from "../apps/component/Colors";

const profile = {
  fullName: "Nama Contoh",
  name: "Contoh",
  gender: "Pria",
  religion: "Islam",
  birthDate: "2000-01-01",
  city: "Bandung",
  educationLevel: "D4 - S1",
  educationStatus: "Lulus",
  institution: "Universitas Contoh",
  major: "Informatika",
  employmentStatus: "Karyawan swasta",
  employmentField: "Teknologi",
  jobTitle: "Engineer",
  maritalStatus: "Belum pernah menikah",
  childrenStatus: "Tidak memiliki anak",
};
const verification = {
  nik: "1234567890123456",
  province: "Jawa Barat",
  ktpCity: "Bandung",
  district: "Area contoh",
  ktpAddress: "Alamat contoh",
  sameAddress: true,
  housingStatus: "Sewa / kontrak",
  maritalConsent: true,
};

test("empty profile is 0% and all applicable fields give exactly 100%", () => {
  expect(getProfileCompletion().percentage).toBe(0);
  const completion = getProfileCompletion(profile, verification);
  expect(completion.percentage).toBe(100);
  expect(completion.completed).toBe(completion.total);
});

test("basic signup remains partial and missing or invalid information prevents full progress", () => {
  const partial = {
    fullName: profile.fullName,
    name: profile.name,
    gender: profile.gender,
    religion: profile.religion,
    birthDate: profile.birthDate,
    city: profile.city,
  };
  expect(getProfileCompletion(partial).percentage).toBe(27);
  expect(
    getProfileCompletion(profile, { ...verification, nik: "123" }).percentage
  ).toBeLessThan(100);
  expect(
    getProfileCompletion(profile, { ...verification, maritalConsent: false })
      .percentage
  ).toBeLessThan(100);
  expect(
    getProfileCompletion({ ...profile, institution: "   " }, verification)
      .percentage
  ).toBeLessThan(100);
  expect(
    getProfileCompletion({ ...profile, birthDate: "2015-01-01" }, verification)
      .percentage
  ).toBeLessThan(100);
});

test("domicile and employment requirements follow applicable selections", () => {
  expect(
    getProfileCompletion(profile, { ...verification, sameAddress: false })
      .percentage
  ).toBeLessThan(100);
  expect(
    getProfileCompletion(profile, {
      ...verification,
      sameAddress: false,
      domicileAddress: "Domisili contoh",
    }).percentage
  ).toBe(100);
  expect(
    getProfileCompletion(
      {
        ...profile,
        employmentStatus: "Tidak bekerja",
        employmentField: "",
        jobTitle: "",
        maritalStatus: "Cerai hidup",
      },
      { ...verification, maritalConsent: false }
    ).percentage
  ).toBe(100);
});

test.each([0, 27, 50, 75, 100])(
  "ring renders the correct accessible progress and arc at %i%%",
  (percentage) => {
    let tree;
    act(() => {
      tree = TestRenderer.create(
        <ProfileProgressRing percentage={percentage}>
          <View />
        </ProfileProgressRing>
      );
    });
    const progress = tree.root
      .findAllByType(View)
      .find((node) => node.props.accessibilityRole === "progressbar");
    expect(progress.props.accessibilityValue.now).toBe(percentage);
    const segments = tree.root
      .findAllByType(View)
      .filter((node) => node.props.testID?.startsWith("progress-segment-"));
    expect(segments).toHaveLength(
      percentage > 0 && percentage < 100 ? Math.ceil(percentage * 3.6) : 0
    );
    segments.forEach((segment) => {
      const style = StyleSheet.flatten(segment.props.style);
      expect(style.backgroundColor).toBe(Colors.main);
      expect(style.left).toBeGreaterThanOrEqual(0);
      expect(style.top).toBeGreaterThanOrEqual(0);
    });
    if (percentage === 100) {
      expect(
        tree.root
          .findAllByType(View)
          .some(
            (node) =>
              StyleSheet.flatten(node.props.style)?.borderColor === Colors.main
          )
      ).toBe(true);
    }
    act(() => tree.unmount());
  }
);
