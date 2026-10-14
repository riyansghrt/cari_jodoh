import React from "react";
import NativeRenderer, { act } from "react-test-renderer";
import { MatchProvider } from "../apps/state/MatchContext";
const TestRenderer = {
  create: (element) =>
    NativeRenderer.create(<MatchProvider>{element}</MatchProvider>),
};
import { Image, Pressable, ScrollView, Text } from "react-native";
import ProfileDetailScreen from "../apps/screen/ProfileDetailScreen";
import { profiles } from "../apps/data/profiles";

jest.mock("@react-navigation/native", () => ({ useFocusEffect: jest.fn() }));
jest.mock("react-native-vector-icons/Feather", () => "Icon");
jest.mock("react-native-vector-icons/FontAwesome5", () => "CrownIcon");
jest.mock("react-native-safe-area-context", () => ({
  SafeAreaView: "SafeAreaView",
}));

test.each(profiles)(
  "detail for $name shows the correct biodata, education, and premium status",
  (profile) => {
    const navigation = { goBack: jest.fn() };
    let tree;
    act(() => {
      tree = TestRenderer.create(
        <ProfileDetailScreen
          route={{ params: { profileId: profile.id } }}
          navigation={navigation}
        />
      );
    });
    const texts = tree.root
      .findAllByType(Text)
      .map((node) => node.props.children);
    expect(texts).toContain(profile.fullName);
    expect(texts).toContain(profile.company);
    expect(texts).toContain("Riwayat pendidikan");
    expect(texts).not.toContain("Detail profil");
    const back = tree.root
      .findAllByType(Pressable)
      .find((node) => node.props.accessibilityLabel === "Kembali ke Home");
    expect(back.props.style).toMatchObject({
      position: "absolute",
      left: 16,
      top: 16,
    });
    expect(back.parent.findByType(Image).props.accessibilityLabel).toBe(
      `Foto ${profile.name}`
    );
    const scroll = tree.root.findByType(ScrollView);
    expect(
      scroll.props.children[1].props.children[0].props.accessibilityLabel
    ).toBe(`Love ${profile.name}`);
    profile.education.forEach((education) => {
      expect(texts).toContain(education.institution);
      expect(texts).toContain(education.major);
    });
    expect(texts.includes("Premium")).toBe(profile.isPremium);
    act(() =>
      tree.root
        .findAllByType(Pressable)
        .find((node) => node.props.accessibilityLabel === "Kembali ke Home")
        .props.onPress()
    );
    expect(navigation.goBack).toHaveBeenCalledTimes(1);
    act(() => tree.unmount());
  }
);

test("unknown profile has a safe empty state", () => {
  let tree;
  act(() => {
    tree = TestRenderer.create(
      <ProfileDetailScreen
        route={{ params: { profileId: "missing" } }}
        navigation={{ goBack: jest.fn() }}
      />
    );
  });
  expect(
    tree.root.findAllByType(Text).map((node) => node.props.children)
  ).toContain("Profil tidak ditemukan.");
  act(() => tree.unmount());
});
