import React from "react";
import NativeRenderer, { act } from "react-test-renderer";
import { MatchProvider } from "../apps/state/MatchContext";
const TestRenderer = {
  create: (element) =>
    NativeRenderer.create(<MatchProvider>{element}</MatchProvider>),
};
import {
  FlatList,
  Pressable,
  ScrollView,
  Switch,
  Text,
  View,
} from "react-native";
import HomeScreen, { createProfilePages } from "../apps/screen/HomeScreen";
import AccountScreen from "../apps/screen/AccountScreen";
import PremiumBadge from "../apps/component/PremiumBadge";
import ProfileFilterModal from "../apps/component/ProfileFilterModal";
import NotificationScreen, {
  initialNotifications,
} from "../apps/screen/NotificationScreen";

jest.mock("@react-navigation/native", () => ({
  useFocusEffect: jest.fn(),
  useIsFocused: () => true,
}));
jest.mock("@ptomasroos/react-native-multi-slider", () => "MultiSlider");
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

const feed = (tree) => tree.root.findByType(FlatList).props.data.flat();
const button = (tree, label) =>
  tree.root
    .findAllByType(Pressable)
    .find((node) => node.props.accessibilityLabel === label);
test("home has no feed tabs and likes do not hide other profiles", () => {
  let tree;
  act(() => {
    tree = TestRenderer.create(
      <HomeScreen navigation={{ reset: jest.fn() }} />
    );
  });
  act(() => {
    tree.root
      .findAllByType(View)[0]
      .props.onLayout({ nativeEvent: { layout: { height: 800 } } });
  });
  expect(feed(tree)).toHaveLength(12);
  const profileLink = button(tree, "Lihat profil Alyssa");
  const love = button(tree, "Suka Alyssa");
  expect(profileLink.findByType(PremiumBadge).props.premium).toBe(true);
  expect(love.props.accessibilityState.selected).toBe(false);
  expect(button(tree, "Profil setelah Alyssa")).toBeUndefined();
  expect(button(tree, "Tentang Alyssa")).toBeUndefined();
  expect(button(tree, "Detail profil Alyssa")).toBeUndefined();
  const texts = tree.root
    .findAllByType(Text)
    .map((node) => node.props.children);
  expect(texts).not.toContain("Cerita berikutnya");
  expect(texts).not.toContain("Untukmu");
  expect(texts).not.toContain("Disukai");
  expect(
    tree.root
      .findAllByType(Pressable)
      .some((node) => node.props.accessibilityRole === "tab")
  ).toBe(false);
  expect(
    texts.some((text) => Array.isArray(text) && text.join("") === "01 / 04")
  ).toBe(false);
  act(() => button(tree, "Suka Alyssa").props.onPress());
  expect(
    button(tree, "Batal suka Alyssa").props.accessibilityState.selected
  ).toBe(true);
  expect(feed(tree)).toHaveLength(12);
  act(() => button(tree, "Batal suka Alyssa").props.onPress());
  expect(button(tree, "Suka Alyssa").props.accessibilityState.selected).toBe(
    false
  );
  expect(feed(tree)).toHaveLength(12);
  act(() => tree.unmount());
});

test("account logout resets navigation to login", () => {
  const parent = { reset: jest.fn() };
  const navigation = { getParent: () => parent };
  let tree;
  act(() => {
    tree = TestRenderer.create(<AccountScreen navigation={navigation} />);
  });
  const logout = tree.root
    .findAllByType(Pressable)
    .find((node) =>
      React.Children.toArray(node.props.children).some(
        (child) => child.props?.children === "Keluar akun"
      )
    );
  act(() => logout.props.onPress());
  expect(parent.reset).toHaveBeenCalledWith({
    index: 0,
    routes: [{ name: "LoginScreen" }],
  });
  act(() => tree.unmount());
});

test("slider gestures lock panel scrolling and keep native markers stable", () => {
  let tree;
  act(() => {
    tree = TestRenderer.create(<HomeScreen />);
  });
  act(() => button(tree, "Filter profil").props.onPress());
  const modal = () => tree.root.findByType(ProfileFilterModal);
  const slider = (id) =>
    modal()
      .findAllByType("MultiSlider")
      .find((node) => node.props.testID === id);
  expect(slider("distance-slider").props.allowOverlap).toBe(true);
  expect(modal().findByType(ScrollView).props.removeClippedSubviews).toBe(
    false
  );
  for (const id of ["distance-slider", "age-slider"]) {
    expect(slider(id).props.markerContainerStyle.zIndex).toBe(1);
    const marker = slider(id).props.customMarker({
      markerStyle: slider(id).props.markerStyle,
    });
    expect(marker.props.collapsable).toBe(false);
    act(() => slider(id).props.onValuesChangeStart());
    expect(modal().findByType(ScrollView).props.scrollEnabled).toBe(false);
    act(() =>
      slider(id).props.onValuesChange(id === "distance-slider" ? [6] : [25, 30])
    );
    act(() => slider(id).props.onValuesChangeFinish());
    expect(modal().findByType(ScrollView).props.scrollEnabled).toBe(true);
  }
  expect(slider("distance-slider").props.values).toEqual([6]);
  act(() => button(tree, "Reset filter").props.onPress());
  expect(slider("distance-slider").props.values).toEqual([100]);
  act(() => tree.unmount());
});

test("filters combine distance and age, cancel draft changes, and reset results", () => {
  let tree;
  act(() => {
    tree = TestRenderer.create(<HomeScreen />);
  });
  act(() =>
    tree.root
      .findAllByType(View)[0]
      .props.onLayout({ nativeEvent: { layout: { height: 800 } } })
  );
  act(() => button(tree, "Filter profil").props.onPress());
  const slider = (id) =>
    tree.root
      .findAllByType("MultiSlider")
      .find((node) => node.props.testID === id);
  act(() => slider("distance-slider").props.onValuesChange([8]));
  act(() => slider("age-slider").props.onValuesChange([27, 28]));
  act(() => button(tree, "Terapkan filter").props.onPress());
  expect(feed(tree).map((item) => item.id)).toEqual(["nadia"]);

  act(() => button(tree, "Filter profil").props.onPress());
  act(() => slider("distance-slider").props.onValuesChange([3]));
  act(() => button(tree, "Tutup filter").props.onPress());
  expect(feed(tree).map((item) => item.id)).toEqual(["nadia"]);

  act(() => button(tree, "Filter profil").props.onPress());
  act(() => slider("age-slider").props.onValuesChange([30, 40]));
  act(() => button(tree, "Terapkan filter").props.onPress());
  expect(feed(tree)).toHaveLength(0);

  act(() => button(tree, "Filter profil").props.onPress());
  act(() => button(tree, "Reset filter").props.onPress());
  act(() => button(tree, "Terapkan filter").props.onPress());
  expect(feed(tree)).toHaveLength(12);
  act(() => tree.unmount());
});

test("additional filter controls update results, persist when reopened, and reset", () => {
  let tree;
  act(() => {
    tree = TestRenderer.create(<HomeScreen />);
  });
  act(() =>
    tree.root
      .findAllByType(View)[0]
      .props.onLayout({ nativeEvent: { layout: { height: 800 } } })
  );
  const picker = (label) =>
    tree.root
      .findAllByType("Picker")
      .find((node) => node.props.accessibilityLabel === label);
  act(() => button(tree, "Filter profil").props.onPress());
  expect(
    tree.root
      .findAllByType("Picker")
      .some((node) => node.props.accessibilityLabel === "Kota pilihan")
  ).toBe(false);
  act(() => picker("Agama pilihan").props.onValueChange("Islam"));
  act(() => picker("Tujuan hubungan pilihan").props.onValueChange("marriage"));
  act(() => tree.root.findByType(Switch).props.onValueChange(true));
  expect(
    tree.root
      .findAllByType(Text)
      .find((node) => node.props.accessibilityLiveRegion === "polite").props
      .children
  ).toEqual([4, " profil sesuai preferensimu"]);
  act(() => button(tree, "Terapkan filter").props.onPress());
  expect(feed(tree).map((item) => item.id)).toEqual([
    "alyssa",
    "amelia",
    "citra",
    "salma",
  ]);
  act(() => button(tree, "Filter profil").props.onPress());
  expect(picker("Agama pilihan").props.selectedValue).toBe("Islam");
  expect(picker("Tujuan hubungan pilihan").props.selectedValue).toBe(
    "marriage"
  );
  expect(tree.root.findByType(Switch).props.value).toBe(true);
  act(() => button(tree, "Reset filter").props.onPress());
  expect(tree.root.findByType(Switch).props.value).toBe(false);
  act(() => button(tree, "Terapkan filter").props.onPress());
  expect(feed(tree)).toHaveLength(12);
  act(() => tree.unmount());
});

test("notifications mark an item or all items as read", () => {
  const onRead = jest.fn();
  let tree;
  act(() => {
    tree = TestRenderer.create(
      <NotificationScreen
        notifications={initialNotifications}
        onRead={onRead}
      />
    );
  });
  act(() =>
    button(tree, "Ada yang tertarik denganmu, belum dibaca").props.onPress()
  );
  expect(onRead).toHaveBeenCalledWith("1");
  act(() => button(tree, "Tandai semua dibaca").props.onPress());
  expect(onRead).toHaveBeenCalledWith("all");
  act(() => tree.unmount());
});

test("profile names and detail buttons open the matching profile by ID", () => {
  const navigation = { navigate: jest.fn() };
  let tree;
  act(() => {
    tree = TestRenderer.create(<HomeScreen navigation={navigation} />);
  });
  act(() =>
    tree.root
      .findAllByType(View)[0]
      .props.onLayout({ nativeEvent: { layout: { height: 800 } } })
  );
  act(() => button(tree, "Lihat profil Alyssa").props.onPress());
  expect(navigation.navigate).toHaveBeenLastCalledWith("ProfileDetailScreen", {
    profileId: "alyssa",
  });
  act(() => button(tree, "Lihat profil Nadia").props.onPress());
  expect(navigation.navigate).toHaveBeenLastCalledWith("ProfileDetailScreen", {
    profileId: "nadia",
  });
  act(() => tree.unmount());
});

test("profiles are grouped into pages of four without losing the final partial page", () => {
  const items = Array.from({ length: 9 }, (_, id) => ({ id }));
  const pages = createProfilePages(items);
  expect(pages.map((page) => page.length)).toEqual([4, 4, 1]);
  expect(pages.flat()).toEqual(items);
  expect(createProfilePages([])).toEqual([]);
});

test("home fits four stable cards in one page and photo opens the correct detail", () => {
  const navigation = { navigate: jest.fn() };
  let tree;
  act(() => {
    tree = TestRenderer.create(<HomeScreen navigation={navigation} />);
  });
  act(() =>
    tree.root
      .findAllByType(View)[0]
      .props.onLayout({ nativeEvent: { layout: { height: 600 } } })
  );
  const list = tree.root.findByType(FlatList);
  expect(list.props.data).toHaveLength(3);
  expect(list.props.data.map((page) => page.length)).toEqual([4, 4, 4]);
  expect(list.props.data[0]).toHaveLength(4);
  const page = tree.root
    .findAllByType(View)
    .find((node) => node.props.testID === "profile-grid-page");
  const cards = page
    .findAllByType(View)
    .filter((node) => node.props.testID?.startsWith("profile-card-"));
  expect(cards).toHaveLength(4);
  const pageStyle = require("react-native").StyleSheet.flatten(
    page.props.style
  );
  const cardStyles = cards.map((node) =>
    require("react-native").StyleSheet.flatten(node.props.style)
  );
  expect(pageStyle.flexWrap).toBe("wrap");
  expect(
    cardStyles.every((style) => style.height * 2 + 36 === pageStyle.height)
  ).toBe(true);
  expect(list.props.snapToInterval).toBe(pageStyle.height);
  expect(list.props.getItemLayout(null, 2).offset).toBe(pageStyle.height * 2);
  act(() => button(tree, "Foto profil Amelia").props.onPress());
  expect(navigation.navigate).toHaveBeenCalledWith("ProfileDetailScreen", {
    profileId: "amelia",
  });
  act(() => tree.unmount());
});
