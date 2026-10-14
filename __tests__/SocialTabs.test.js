import React from "react";
import TestRenderer, { act } from "react-test-renderer";
import {
  Alert,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
} from "react-native";
import { MatchProvider, useMatches } from "../apps/state/MatchContext";
import MainTabs from "../apps/MainTabs";
import DiscoverScreen from "../apps/screen/DiscoverScreen";
import LikedYouScreen from "../apps/screen/LikedYouScreen";
import ChatsScreen from "../apps/screen/ChatsScreen";
import AccountScreen from "../apps/screen/AccountScreen";
import EditProfileScreen from "../apps/screen/EditProfileScreen";
import PremiumScreen from "../apps/screen/PremiumScreen";
import ProfileCard from "../apps/component/ProfileCard";
import ProfileProgressRing from "../apps/component/ProfileProgressRing";

jest.mock("@react-navigation/native", () => ({
  useFocusEffect: jest.fn(),
  useIsFocused: () => true,
}));
jest.mock("@react-navigation/bottom-tabs", () => ({
  createBottomTabNavigator: () => ({
    Navigator: "TabNavigator",
    Screen: "TabScreen",
  }),
}));
jest.mock("@ptomasroos/react-native-multi-slider", () => "MultiSlider");
jest.mock("@react-native-community/datetimepicker", () => "DatePicker");
jest.mock("@react-native-picker/picker", () => {
  const Picker = ({ children, ...props }) =>
    require("react").createElement("Picker", props, children);
  Picker.Item = "PickerItem";
  return { Picker };
});
jest.mock("react-native-vector-icons/Feather", () => "Icon");
jest.mock("react-native-vector-icons/FontAwesome5", () => "CrownIcon");
jest.mock("react-native-safe-area-context", () => ({
  SafeAreaView: "SafeAreaView",
  useSafeAreaInsets: () => ({ top: 24, bottom: 24, left: 0, right: 0 }),
}));
let tree;
let state;
function Probe() {
  state = useMatches();
  return null;
}
function mount(children) {
  act(() => {
    tree = TestRenderer.create(
      <MatchProvider>
        <Probe />
        {children}
      </MatchProvider>
    );
  });
}
const button = (label, root = tree.root) =>
  root
    .findAllByType(Pressable)
    .find((node) => node.props.accessibilityLabel === label);
const texts = () =>
  tree.root.findAllByType(Text).map((node) => node.props.children);
afterEach(() => {
  act(() => tree?.unmount());
  jest.restoreAllMocks();
});

test("five tabs follow reference order and incoming badge updates after match", () => {
  mount(<MainTabs />);
  const tabs = () => tree.root.findAllByType("TabScreen");
  expect(tabs().map((node) => node.props.options.title)).toEqual([
    "People",
    "Discover",
    "Menyukai",
    "Chat",
    "Profil",
  ]);
  expect(tree.root.findByType("TabNavigator").props.initialRouteName).toBe(
    "HomeScreen"
  );
  expect(tabs()[2].props.options.tabBarBadge).toBe(5);
  act(() => state.toggleLike("alyssa"));
  expect(tabs()[2].props.options.tabBarBadge).toBe(4);
});

test("discover renders four photo sections, opens correct detail, and shares likes", () => {
  const navigation = { navigate: jest.fn() };
  mount(<DiscoverScreen navigation={navigation} />);
  expect(texts()).toEqual(
    expect.arrayContaining([
      "Rekomendasi untukmu",
      "Minat yang sama",
      "Tujuan yang sejalan",
      "Komunitas yang sama",
    ])
  );
  const card = tree.root.findAllByType(ProfileCard)[0];
  const photoStyle = StyleSheet.flatten(card.findByType(Image).props.style);
  expect(photoStyle.width).toBe(card.props.width - 22);
  expect(photoStyle.height).toBeCloseTo(photoStyle.width / 0.77);
  act(() => button("Lihat profil Alyssa", card).props.onPress());
  expect(navigation.navigate).toHaveBeenCalledWith("ProfileDetailScreen", {
    profileId: "alyssa",
  });
  act(() => button("Suka Alyssa", card).props.onPress());
  expect(state.isMatched("alyssa")).toBe(true);
  expect(
    button("Batal suka Alyssa", card).props.accessibilityState.selected
  ).toBe(true);
});

test("development unlock opens incoming profiles immediately without activating premium", () => {
  const navigation = { navigate: jest.fn() };
  mount(<LikedYouScreen navigation={navigation} />);
  expect(tree.root.findAllByType(ProfileCard)).toHaveLength(0);
  expect(button("Suka Alyssa")).toBeUndefined();
  expect(button("Lihat profil Alyssa")).toBeUndefined();
  expect(button("Filter yang menyukaimu")).toBeUndefined();
  act(() => button("Unlock dengan Premium").props.onPress());
  expect(navigation.navigate).not.toHaveBeenCalled();
  expect(state.subscription).toBeNull();
  expect(tree.root.findAllByType(ProfileCard)).toHaveLength(5);
  expect(button("Filter yang menyukaimu")).toBeDefined();
  act(() => button("Suka Alyssa").props.onPress());
  expect(state.isMatched("alyssa")).toBe(true);
});

test("release unlock still opens premium and keeps free profiles locked", () => {
  const previous = global.__DEV__;
  global.__DEV__ = false;
  try {
    const navigation = { navigate: jest.fn() };
    mount(<LikedYouScreen navigation={navigation} />);
    act(() => button("Unlock dengan Premium").props.onPress());
    expect(navigation.navigate).toHaveBeenCalledWith("PremiumScreen", {
      tier: "premium",
    });
    expect(state.subscription).toBeNull();
    expect(tree.root.findAllByType(ProfileCard)).toHaveLength(0);
  } finally {
    global.__DEV__ = previous;
  }
});

test.each(["premium", "plus"])(
  "%s unlocks incoming profiles and removing it relocks the page",
  (tier) => {
    mount(<LikedYouScreen navigation={{ navigate: jest.fn() }} />);
    act(() => state.setSubscription({ tier, period: "week" }));
    expect(tree.root.findAllByType(ProfileCard)).toHaveLength(5);
    expect(button("Filter yang menyukaimu")).toBeDefined();
    expect(button("Unlock dengan Premium")).toBeUndefined();
    act(() => state.setSubscription(null));
    expect(tree.root.findAllByType(ProfileCard)).toHaveLength(0);
    expect(button("Unlock dengan Premium")).toBeDefined();
  }
);

test("premium incoming love unlocks matched chat list and unlike removes its entry", () => {
  const navigation = { navigate: jest.fn() };
  mount(
    <>
      <LikedYouScreen navigation={navigation} />
      <ChatsScreen navigation={navigation} />
    </>
  );
  act(() => state.setSubscription({ tier: "premium", period: "week" }));
  expect(
    tree.root.findAllByType(ProfileCard).map((node) => node.props.profile.id)
  ).toEqual(["alyssa", "kiara", "citra", "farah", "salma"]);
  expect(button("Buka chat Alyssa")).toBeUndefined();
  act(() => button("Suka Alyssa").props.onPress());
  act(() => button("Buka chat Alyssa").props.onPress());
  expect(navigation.navigate).toHaveBeenLastCalledWith("ChatScreen", {
    profileId: "alyssa",
  });
  act(() => state.sendMessage("alyssa", "Halo!"));
  expect(texts()).toContain("Kamu: Halo!");
  act(() => button("Batal suka Alyssa").props.onPress());
  expect(button("Buka chat Alyssa")).toBeUndefined();
});

test("chat search filters matches and one-sided love never appears as a chat", () => {
  mount(<ChatsScreen navigation={{}} />);
  act(() => {
    state.toggleLike("alyssa");
    state.toggleLike("nadia");
  });
  expect(button("Buka chat Alyssa")).toBeDefined();
  expect(button("Buka chat Nadia")).toBeUndefined();
  act(() => tree.root.findByType(TextInput).props.onChangeText("nadia"));
  expect(button("Buka chat Alyssa")).toBeUndefined();
  expect(texts()).toContain("Tidak ada percakapan dengan nama itu.");
});

test("profile editing validates input and keeps changes when switching profile sections", () => {
  const navigation = { navigate: jest.fn(), goBack: jest.fn() };
  mount(
    <>
      <AccountScreen navigation={navigation} />
      <EditProfileScreen navigation={navigation} />
    </>
  );
  act(() => button("Edit profil").props.onPress());
  expect(navigation.navigate).toHaveBeenCalledWith("EditProfileScreen");
  const field = (label) =>
    tree.root
      .findAllByType(TextInput)
      .find((node) => node.props.accessibilityLabel === label);
  expect(tree.root.findAllByType(TextInput)).toHaveLength(0);
  act(() => button("Edit Nama panggilan").props.onPress());
  act(() => field("Nama panggilan").props.onChangeText(" "));
  act(() => button("Simpan profil").props.onPress());
  expect(texts()).toContain("Isi nama panggilan.");
  act(() => field("Nama panggilan").props.onChangeText("Riyan"));
  act(() => button("Simpan profil").props.onPress());
  expect(state.ownProfile.name).toBe("Riyan");
  expect(state.ownProfile.interests).toContain("Kopi");
  act(() => button("Profil Keamanan").props.onPress());
  expect(texts()).toContain("Kenalan dengan nyaman");
  act(() => button("Profil Insight foto").props.onPress());
  expect(texts()).toContain("Belum ada insight foto untuk akunmu.");
});

test("premium selector changes price, confirms demo activation, and cannot bypass match", () => {
  const navigation = { goBack: jest.fn() };
  const alert = jest.spyOn(Alert, "alert").mockImplementation(() => {});
  mount(
    <PremiumScreen
      navigation={navigation}
      route={{ params: { tier: "premium" } }}
    />
  );
  act(() => button("Durasi 1 bulan").props.onPress());
  expect(texts()).toContain("Rp 92.400");
  act(() => button("Paket Premium+").props.onPress());
  expect(texts()).toContain("Rp 129.732");
  act(() => button("Lihat semua manfaat").props.onPress());
  expect(texts()).toContain("Insight foto profil");
  act(() => button("Aktifkan demo premium").props.onPress());
  expect(state.subscription).toBeNull();
  const actions = alert.mock.calls[0][2];
  act(() =>
    actions.find((action) => action.text === "Aktifkan demo").onPress()
  );
  expect(state.subscription).toEqual({ tier: "plus", period: "month" });
  expect(navigation.goBack).toHaveBeenCalledTimes(1);
  expect(state.sendMessage("nadia", "Halo")).toBe(false);
  act(() => state.resetSession());
  expect(state.subscription).toBeNull();
  expect(state.ownProfile.name).toBe("Admin");
});

test("avatar progress updates after saving public and private profile fields", () => {
  mount(<AccountScreen navigation={{}} />);
  expect(tree.root.findByType(ProfileProgressRing).props.percentage).toBe(27);
  const profile = {
    ...state.ownProfile,
    educationLevel: "SMA",
    educationStatus: "Lulus",
    institution: "Sekolah Contoh",
    major: "IPA",
    employmentStatus: "IRT",
    maritalStatus: "Cerai hidup",
    childrenStatus: "Memiliki anak",
  };
  const verification = {
    nik: "1234567890123456",
    province: "Jawa Barat",
    ktpCity: "Bandung",
    district: "Area contoh",
    ktpAddress: "Alamat contoh",
    sameAddress: true,
    housingStatus: "Milik sendiri",
  };
  act(() => state.saveEditedProfile(profile, verification));
  expect(tree.root.findByType(ProfileProgressRing).props.percentage).toBe(100);
  act(() => state.saveEditedProfile(profile, { ...verification, nik: "" }));
  expect(
    tree.root.findByType(ProfileProgressRing).props.percentage
  ).toBeLessThan(100);
});
