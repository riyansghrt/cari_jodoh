import React from "react";
import TestRenderer, { act } from "react-test-renderer";
import { Pressable, Text, TextInput } from "react-native";
import { MatchProvider, useMatches } from "../apps/state/MatchContext";
import OtpScreen from "../apps/screen/OtpScreen";
import StepRegister from "../apps/screen/stepregister";
import EditProfileScreen from "../apps/screen/EditProfileScreen";
import {
  ageFromBirthDate,
  normalizeContact,
  validateBasicProfile,
} from "../apps/data/registration";

jest.mock("@react-navigation/native", () => ({ useIsFocused: () => true }));
jest.mock("react-native-vector-icons/Feather", () => "Icon");
jest.mock("@react-native-community/datetimepicker", () => "DatePicker");
jest.mock("react-native-safe-area-context", () => ({
  SafeAreaView: "SafeAreaView",
}));
jest.mock("@react-native-picker/picker", () => {
  const Picker = ({ children, ...props }) =>
    require("react").createElement("Picker", props, children);
  Picker.Item = "PickerItem";
  return { Picker };
});
let tree;
let state;
function Probe() {
  state = useMatches();
  return null;
}
const show = (children) =>
  act(() =>
    tree.update(
      <MatchProvider>
        <Probe />
        {children}
      </MatchProvider>
    )
  );
const button = (label) =>
  tree.root
    .findAllByType(Pressable)
    .find((node) => node.props.accessibilityLabel === label);
const input = (label) =>
  tree.root
    .findAllByType(TextInput)
    .find((node) => node.props.accessibilityLabel === label);
const select = (label, value) =>
  act(() =>
    tree.root
      .findAllByType("Picker")
      .find((node) => node.props.accessibilityLabel === label)
      .props.onValueChange(value)
  );
const texts = () =>
  tree.root.findAllByType(Text).map((node) => node.props.children);
const consents = { terms: true, privacy: true };
const basic = {
  fullName: "Riyan Pratama",
  name: "Riyan",
  gender: "Pria",
  religion: "Islam",
  birthDate: "2000-10-13",
  city: "Bandung",
};
beforeEach(() => {
  jest.useFakeTimers();
  jest.setSystemTime(new Date("2026-10-13T05:00:00Z"));
  act(() => {
    tree = TestRenderer.create(
      <MatchProvider>
        <Probe />
      </MatchProvider>
    );
  });
});
afterEach(() => {
  act(() => tree.unmount());
  jest.useRealTimers();
});

test.each([
  ["081234567890", "+6281234567890"],
  ["+62 812-3456-7890", "+6281234567890"],
  [" User@Example.com ", "user@example.com"],
  ["admin", null],
  ["1234", null],
  ["x@y", null],
])("normalizes contact %s", (value, expected) =>
  expect(normalizeContact(value)).toBe(expected)
);

test("registration cannot bypass OTP and both consents are required", () => {
  expect(state.finishRegistration(basic, "081234567890").error).toContain(
    "OTP"
  );
  expect(
    state.requestOtp("081234567890", { terms: true, privacy: false }).error
  ).toContain("Setujui");
  expect(state.verifyOtp("123456").error).toContain("Minta OTP");
});

test("OTP expires, limits wrong attempts, and enforces resend cooldown", () => {
  const now = Date.now();
  act(() => state.requestOtp("081234567890", consents, now));
  expect(
    state.requestOtp("081234567890", consents, now + 1000).error
  ).toContain("Tunggu");
  for (let index = 0; index < 5; index++)
    act(() => state.verifyOtp("000000", now + 2000));
  expect(state.verifyOtp("123456", now + 3000).error).toContain("Batas");
  act(() => state.requestOtp("081234567890", consents, now + 31000));
  expect(state.otpChallenge.attempts).toBe(0);
  expect(state.verifyOtp("123456", now + 331000).error).toContain(
    "kedaluwarsa"
  );
});

test("new verified user goes to registration; returning completed user skips it", () => {
  act(() => state.requestOtp("user@example.com", consents));
  let result;
  act(() => {
    result = state.verifyOtp("123456");
  });
  expect(result.needsRegistration).toBe(true);
  expect(state.finishRegistration(basic, "bad").errors.phone).toBeDefined();
  act(() => {
    result = state.finishRegistration(basic, "081234567890");
  });
  expect(result.ok).toBe(true);
  act(() => state.resetSession());
  act(() => state.requestOtp("USER@example.com", consents));
  act(() => {
    result = state.verifyOtp("123456");
  });
  expect(result.needsRegistration).toBe(false);
  expect(state.ownProfile.name).toBe("Riyan");
  act(() => state.resetSession());
  act(() => state.requestOtp("other@example.com", consents));
  act(() => {
    result = state.verifyOtp("123456");
  });
  expect(result.needsRegistration).toBe(true);
  expect(state.ownProfile.city).toBe("");
});

test("verified phone cannot be replaced and starting another login revokes registration access", () => {
  act(() => state.requestOtp("081234567890", consents));
  act(() => state.verifyOtp("123456"));
  expect(
    state.finishRegistration(basic, "089876543210").errors.phone
  ).toContain("sama");
  act(() => state.requestOtp("new@example.com", consents));
  expect(state.finishRegistration(basic, "081234567890").error).toContain(
    "OTP"
  );
});

test.each([
  ["2007-10-13", 19, false],
  ["2007-10-14", 18, true],
  ["2026-12-01", null, true],
  ["2000-02-30", null, true],
])(
  "age limit rejects invalid or under-19 birth date %s",
  (birthDate, age, rejected) => {
    const today = new Date(2026, 9, 13);
    expect(ageFromBirthDate(birthDate, today)).toBe(age);
    expect(
      Boolean(validateBasicProfile({ ...basic, birthDate }, today).birthDate)
    ).toBe(rejected);
  }
);

test("OTP screen handles wrong code and routes new user without opening home", () => {
  act(() => state.requestOtp("081234567890", consents));
  const navigation = { reset: jest.fn() };
  show(<OtpScreen navigation={navigation} />);
  expect(button("Kirim ulang OTP").props.disabled).toBe(true);
  act(() => input("Kode OTP").props.onChangeText("000000"));
  act(() => button("Verifikasi OTP").props.onPress());
  expect(navigation.reset).not.toHaveBeenCalled();
  expect(texts()).toContain("OTP salah. Periksa kembali enam digit kode kamu.");
  act(() => input("Kode OTP").props.onChangeText("123456"));
  act(() => button("Verifikasi OTP").props.onPress());
  expect(navigation.reset).toHaveBeenCalledWith({
    index: 0,
    routes: [{ name: "StepRegister" }],
  });
});

test("OTP screen sends a previously completed account directly to home", () => {
  act(() => state.requestOtp("081234567890", consents));
  act(() => state.verifyOtp("123456"));
  act(() => state.finishRegistration(basic, "081234567890"));
  act(() => state.resetSession());
  act(() => state.requestOtp("081234567890", consents));
  const navigation = { reset: jest.fn() };
  show(<OtpScreen navigation={navigation} />);
  act(() => input("Kode OTP").props.onChangeText("123456"));
  act(() => button("Verifikasi OTP").props.onPress());
  expect(navigation.reset).toHaveBeenCalledWith({
    index: 0,
    routes: [{ name: "MainTabs" }],
  });
});

test("two-step signup needs only basic data, rejects underage, and opens home", () => {
  act(() => state.requestOtp("081234567890", consents));
  act(() => state.verifyOtp("123456"));
  const navigation = { reset: jest.fn() };
  show(<StepRegister navigation={navigation} />);
  expect(input("Nomor HP").props.value).toBe("+6281234567890");
  act(() =>
    input("Nama lengkap sesuai KTP").props.onChangeText(basic.fullName)
  );
  act(() => input("Nama panggilan").props.onChangeText(basic.name));
  select("Jenis kelamin", "Pria");
  act(() => button("Lanjutkan").props.onPress());
  select("Agama", "Islam");
  act(() =>
    input("Tempat tinggal (kota / area)").props.onChangeText("Bandung")
  );
  const chooseDate = (date) => {
    act(() => button("Tanggal lahir").props.onPress());
    act(() =>
      tree.root.findByType("DatePicker").props.onChange({ type: "set" }, date)
    );
  };
  chooseDate(new Date(2010, 9, 13));
  act(() => button("Selesai dan masuk").props.onPress());
  expect(navigation.reset).not.toHaveBeenCalled();
  expect(texts()).toContain("Pendaftaran ditolak. Usia minimal 19 tahun.");
  chooseDate(new Date(2000, 9, 13));
  act(() => button("Selesai dan masuk").props.onPress());
  expect(navigation.reset).toHaveBeenCalledWith({
    index: 0,
    routes: [{ name: "MainTabs" }],
  });
  expect(state.ownProfile.name).toBe("Riyan");
  expect(state.ownProfile).not.toHaveProperty("nik");
  expect(state.ownProfile).not.toHaveProperty("educationLevel");
});

test("edit profile shows a list and opens only the selected field without losing drafts", () => {
  show(<EditProfileScreen navigation={{ goBack: jest.fn() }} />);
  expect(tree.root.findAllByType(TextInput)).toHaveLength(0);
  expect(tree.root.findAllByType("Picker")).toHaveLength(0);
  expect(
    tree.root.findAll((node) => node.props.accessibilityRole === "tab")
  ).toHaveLength(0);
  act(() => button("Edit Nama panggilan").props.onPress());
  expect(tree.root.findAllByType(TextInput)).toHaveLength(1);
  act(() => input("Nama panggilan").props.onChangeText("Nama baru"));
  act(() => button("Edit Agama").props.onPress());
  expect(input("Nama panggilan")).toBeUndefined();
  select("Agama", "Hindu");
  act(() => button("Selesai edit Agama").props.onPress());
  expect(tree.root.findAllByType("Picker")).toHaveLength(0);
  act(() => button("Edit Nama panggilan").props.onPress());
  expect(input("Nama panggilan").props.value).toBe("Nama baru");
  expect(state.ownProfile.name).not.toBe("Nama baru");
  act(() => button("Simpan profil").props.onPress());
  expect(state.ownProfile.name).toBe("Nama baru");
  expect(state.ownProfile.religion).toBe("Hindu");
});

test("date input opens on demand and completion updates with education edits", () => {
  show(<EditProfileScreen navigation={{ goBack: jest.fn() }} />);
  expect(button("Tanggal lahir")).toBeUndefined();
  act(() => button("Edit Tanggal lahir").props.onPress());
  expect(button("Tanggal lahir")).toBeDefined();
  act(() => button("Tanggal lahir").props.onPress());
  expect(tree.root.findAllByType("DatePicker")).toHaveLength(1);
  act(() => button("Edit Pendidikan terakhir").props.onPress());
  expect(tree.root.findAllByType("DatePicker")).toHaveLength(0);
  const progress = () =>
    tree.root
      .findAllByType(require("react-native").View)
      .find((node) => node.props.accessibilityRole === "progressbar").props
      .accessibilityValue.now;
  const before = progress();
  select("Pendidikan terakhir", "S3");
  expect(progress()).toBeGreaterThan(before);
});

test("private verification is isolated and NIK check never claims authenticity", () => {
  const navigation = { goBack: jest.fn() };
  show(<EditProfileScreen navigation={navigation} />);
  act(() => button("Edit NIK").props.onPress());
  act(() => input("NIK").props.onChangeText("1234567890123456"));
  act(() => button("Cek format NIK").props.onPress());
  expect(texts()).toContain(
    "Format 16 digit sesuai. Keaslian NIK belum diverifikasi."
  );
  act(() => button("Edit Provinsi sesuai KTP").props.onPress());
  expect(texts()).toContain("************3456");
  act(() => input("Provinsi sesuai KTP").props.onChangeText("Jawa Barat"));
  act(() => button("Edit Alamat sesuai KTP").props.onPress());
  act(() => input("Alamat sesuai KTP").props.onChangeText("Alamat contoh 1"));
  act(() => button("Edit Alamat KTP sama dengan domisili").props.onPress());
  act(() => button("Alamat KTP sama dengan domisili").props.onPress());
  act(() => button("Simpan profil").props.onPress());
  expect(navigation.goBack).not.toHaveBeenCalled();
  act(() =>
    input("Alamat domisili saat ini").props.onChangeText("Alamat contoh 2")
  );
  act(() => button("Simpan profil").props.onPress());
  expect(navigation.goBack).toHaveBeenCalledTimes(1);
  expect(state.privateProfile.nik).toBe("1234567890123456");
  expect(state.privateProfile.domicileAddress).toBe("Alamat contoh 2");
  expect(JSON.stringify(state.ownProfile)).not.toContain("1234567890123456");
  expect(JSON.stringify(state.ownProfile)).not.toContain("Alamat contoh");
  act(() => state.resetSession());
  expect(state.privateProfile.nik).toBeUndefined();
});

test("education, employment and family data are editable with single-status consent", () => {
  const navigation = { goBack: jest.fn() };
  show(<EditProfileScreen navigation={navigation} />);
  act(() => button("Edit Pendidikan terakhir").props.onPress());
  select("Pendidikan terakhir", "D4 - S1");
  act(() => button("Edit Status pendidikan").props.onPress());
  select("Status pendidikan", "Lulus");
  act(() => button("Edit Nama institusi").props.onPress());
  act(() => input("Nama institusi").props.onChangeText("Universitas Contoh"));
  act(() => button("Edit Jurusan").props.onPress());
  act(() => input("Jurusan").props.onChangeText("Informatika"));
  act(() => button("Edit Status pekerjaan").props.onPress());
  select("Status pekerjaan", "Karyawan swasta");
  act(() => button("Edit Bidang pekerjaan").props.onPress());
  act(() => input("Bidang pekerjaan").props.onChangeText("Teknologi"));
  act(() => button("Edit Jabatan").props.onPress());
  act(() => input("Jabatan").props.onChangeText("Engineer"));
  act(() => button("Edit Status perkawinan").props.onPress());
  select("Status perkawinan", "Belum pernah menikah");
  act(() => button("Edit Apakah memiliki anak?").props.onPress());
  select("Apakah memiliki anak?", "Tidak memiliki anak");
  act(() => button("Simpan profil").props.onPress());
  expect(navigation.goBack).not.toHaveBeenCalled();
  act(() =>
    button(
      "Saya menyatakan belum pernah menikah dan menyetujui pemeriksaan yang sah"
    ).props.onPress()
  );
  act(() => button("Simpan profil").props.onPress());
  expect(state.ownProfile.institution).toBe("Universitas Contoh");
  expect(state.ownProfile.jobTitle).toBe("Engineer");
  expect(state.ownProfile.childrenStatus).toBe("Tidak memiliki anak");
  expect(state.privateProfile.maritalConsent).toBe(true);
  expect(state.ownProfile.maritalConsent).toBeUndefined();
});
