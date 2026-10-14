import React from "react";
import NativeRenderer, { act } from "react-test-renderer";
import { MatchProvider, useMatches } from "../apps/state/MatchContext";
const TestRenderer = {
  create: (element) =>
    NativeRenderer.create(<MatchProvider>{element}</MatchProvider>),
};
import { Image, Modal, StyleSheet, Text, TextInput } from "react-native";
import { PrimaryButton } from "../apps/component/RegistrationFields";
import BrandLogo from "../apps/component/BrandLogo";
import LoginScreen from "../apps/screen/LoginScreen";
import SplashScreen from "../apps/resource/SplashScreen";

jest.mock("react-native-vector-icons/Feather", () => "Icon");
jest.mock("@react-navigation/native", () => ({ useIsFocused: () => true }));
jest.mock("@react-native-community/datetimepicker", () => "DatePicker");
jest.mock("@react-native-picker/picker", () => {
  const Picker = ({ children, ...props }) =>
    require("react").createElement("Picker", props, children);
  Picker.Item = "PickerItem";
  return { Picker };
});
jest.mock("react-native-safe-area-context", () => ({
  SafeAreaView: "SafeAreaView",
}));

const findByLabel = (tree, label) =>
  tree.root.findAll(
    (node) =>
      node.props.accessibilityLabel === label && typeof node.type !== "string"
  )[0];

test("brand logo uses the provided asset without stretching it", () => {
  let tree;
  act(() => {
    tree = TestRenderer.create(<BrandLogo size={144} />);
  });
  const logo = tree.root.findByType(Image);
  expect(logo.props.source).toBe(require("../assets/icon/logocarijodoh.png"));
  expect(logo.props.resizeMode).toBe("contain");
  expect(logo.props.style).toEqual({ width: 144, height: 144 });
  act(() => tree.unmount());
});

test("action buttons center their labels without a trailing arrow", () => {
  const onPress = jest.fn();
  let tree;
  act(() => {
    tree = TestRenderer.create(
      <PrimaryButton label="Lanjutkan" onPress={onPress} />
    );
  });
  const button = findByLabel(tree, "Lanjutkan");
  expect(StyleSheet.flatten(button.props.style)).toMatchObject({
    alignItems: "center",
    justifyContent: "center",
  });
  expect(
    StyleSheet.flatten(tree.root.findByType(Text).props.style).textAlign
  ).toBe("center");
  expect(tree.root.findAllByType("Icon")).toHaveLength(0);
  act(() => button.props.onPress());
  expect(onPress).toHaveBeenCalledTimes(1);
  act(() => tree.unmount());
});

test("login requests OTP only after the single combined consent", () => {
  let tree;
  let session;
  function Probe() {
    session = useMatches();
    return null;
  }
  const navigation = { navigate: jest.fn() };
  act(() => {
    tree = TestRenderer.create(
      <>
        <Probe />
        <LoginScreen navigation={navigation} />
      </>
    );
  });
  expect(
    findByLabel(tree, "Saya menyetujui syarat layanan dan kebijakan privasi")
  ).toBeUndefined();
  expect(tree.root.findAllByType(Modal)).toHaveLength(0);
  act(() => findByLabel(tree, "Kirim OTP").props.onPress());
  expect(JSON.stringify(tree.toJSON())).toContain(
    "Masukkan nomor HP Indonesia atau email yang valid."
  );
  expect(tree.root.findAllByType(Modal)).toHaveLength(0);
  act(() =>
    tree.root.findByType(TextInput).props.onChangeText(" User@Example.com ")
  );
  act(() => findByLabel(tree, "Kirim OTP").props.onPress());
  expect(tree.root.findAllByType(Modal)).toHaveLength(1);
  expect(session.otpChallenge).toBeNull();
  expect(navigation.navigate).not.toHaveBeenCalled();
  expect(findByLabel(tree, "Setuju dan kirim OTP").props.disabled).toBe(true);
  expect(
    tree.root.findAllByType(
      require("../apps/component/RegistrationFields").CheckField
    )
  ).toHaveLength(1);
  act(() => findByLabel(tree, "Setuju dan kirim OTP").props.onPress());
  expect(navigation.navigate).not.toHaveBeenCalled();
  expect(session.otpChallenge).toBeNull();
  act(() =>
    findByLabel(
      tree,
      "Saya menyetujui syarat layanan dan kebijakan privasi"
    ).props.onPress()
  );
  expect(findByLabel(tree, "Setuju dan kirim OTP").props.disabled).toBe(false);
  act(() => findByLabel(tree, "Setuju dan kirim OTP").props.onPress());
  expect(navigation.navigate).toHaveBeenCalledWith("OtpScreen");
  expect(session.otpChallenge.contact).toBe("user@example.com");
  expect(session.otpChallenge.consents).toMatchObject({
    terms: true,
    privacy: true,
  });
  expect(tree.root.findAllByType(Modal)).toHaveLength(0);
  expect(tree.root.findAllByType(TextInput)).toHaveLength(1);
  act(() => tree.unmount());
});

test("closing terms keeps the contact and resets consent on reopening", () => {
  const navigation = { navigate: jest.fn() };
  let tree;
  act(() => {
    tree = TestRenderer.create(<LoginScreen navigation={navigation} />);
  });
  act(() => tree.root.findByType(TextInput).props.onChangeText("081234567890"));
  act(() => findByLabel(tree, "Kirim OTP").props.onPress());
  act(() =>
    findByLabel(
      tree,
      "Saya menyetujui syarat layanan dan kebijakan privasi"
    ).props.onPress()
  );
  act(() => tree.root.findByType(Modal).props.onRequestClose());
  expect(tree.root.findAllByType(Modal)).toHaveLength(0);
  expect(tree.root.findByType(TextInput).props.value).toBe("081234567890");
  expect(navigation.navigate).not.toHaveBeenCalled();
  act(() => findByLabel(tree, "Kirim OTP").props.onPress());
  expect(
    findByLabel(tree, "Saya menyetujui syarat layanan dan kebijakan privasi")
      .props.accessibilityState.checked
  ).toBe(false);
  act(() => findByLabel(tree, "Tutup syarat dan ketentuan").props.onPress());
  expect(tree.root.findAllByType(Modal)).toHaveLength(0);
  act(() => tree.unmount());
});

test("splash moves to login and clears its timer when unmounted", () => {
  jest.useFakeTimers();
  const navigation = { replace: jest.fn() };
  let tree;
  act(() => {
    tree = TestRenderer.create(<SplashScreen navigation={navigation} />);
  });
  act(() => {
    jest.advanceTimersByTime(1600);
  });
  expect(navigation.replace).toHaveBeenCalledWith("LoginScreen");
  act(() => tree.unmount());

  navigation.replace.mockClear();
  act(() => {
    tree = TestRenderer.create(<SplashScreen navigation={navigation} />);
  });
  act(() => tree.unmount());
  act(() => {
    jest.advanceTimersByTime(1600);
  });
  expect(navigation.replace).not.toHaveBeenCalled();
  jest.useRealTimers();
});
