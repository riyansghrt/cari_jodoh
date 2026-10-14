import React from "react";
import TestRenderer, { act } from "react-test-renderer";
import { FlatList, Pressable, TextInput } from "react-native";
import { MatchProvider, useMatches } from "../apps/state/MatchContext";
import ProfileDetailScreen from "../apps/screen/ProfileDetailScreen";
import ChatScreen from "../apps/screen/ChatScreen";

jest.mock("@react-navigation/native", () => ({ useFocusEffect: jest.fn() }));
jest.mock("react-native-vector-icons/Feather", () => "Icon");
jest.mock("react-native-vector-icons/FontAwesome5", () => "CrownIcon");
jest.mock("react-native-safe-area-context", () => ({
  SafeAreaView: "SafeAreaView",
}));

let state;
let tree;
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
const button = (label) =>
  tree.root
    .findAllByType(Pressable)
    .find((node) => node.props.accessibilityLabel === label);
afterEach(() => act(() => tree?.unmount()));

test("reciprocal love unlocks chat and cancelling love locks it again", () => {
  const navigation = { navigate: jest.fn() };
  mount(
    <ProfileDetailScreen
      route={{ params: { profileId: "alyssa" } }}
      navigation={navigation}
    />
  );
  expect(button("Chat terkunci").props.disabled).toBe(true);
  act(() => button("Love Alyssa").props.onPress());
  expect(state.isMatched("alyssa")).toBe(true);
  act(() => button("Mulai chat dengan Alyssa").props.onPress());
  expect(navigation.navigate).toHaveBeenCalledWith("ChatScreen", {
    profileId: "alyssa",
  });
  act(() => button("Batal love Alyssa").props.onPress());
  expect(button("Chat terkunci").props.disabled).toBe(true);
  expect(state.isMatched("alyssa")).toBe(false);
});

test("one-sided love cannot open chat or send messages", () => {
  mount(
    <ProfileDetailScreen
      route={{ params: { profileId: "nadia" } }}
      navigation={{}}
    />
  );
  act(() => button("Love Nadia").props.onPress());
  expect(state.likedIds).toContain("nadia");
  expect(button("Chat terkunci").props.disabled).toBe(true);
  expect(state.sendMessage("nadia", "Halo")).toBe(false);
  expect(state.messages).toEqual({});
});

test.each(["alyssa", "missing"])(
  "direct chat route for %s is locked before match",
  (id) => {
    mount(<ChatScreen route={{ params: { profileId: id } }} navigation={{}} />);
    expect(tree.root.findAllByType(TextInput)).toHaveLength(0);
    expect(JSON.stringify(tree.toJSON())).toContain("Chat belum tersedia");
    expect(state.sendMessage(id, "Halo")).toBe(false);
  }
);

test("matched chat sends local messages, rejects blank input, and hides composer after unlike", () => {
  mount(
    <ChatScreen route={{ params: { profileId: "alyssa" } }} navigation={{}} />
  );
  act(() => state.toggleLike("alyssa"));
  expect(button("Kirim pesan").props.disabled).toBe(true);
  act(() =>
    tree.root.findByType(TextInput).props.onChangeText("  Halo Alyssa  ")
  );
  act(() => button("Kirim pesan").props.onPress());
  expect(tree.root.findByType(FlatList).props.data[0].text).toBe("Halo Alyssa");
  expect(tree.root.findByType(TextInput).props.value).toBe("");
  expect(state.sendMessage("alyssa", "  ")).toBe(false);
  expect(state.sendMessage("alyssa", "a".repeat(1001))).toBe(false);
  act(() => state.toggleLike("alyssa"));
  expect(tree.root.findAllByType(TextInput)).toHaveLength(0);
  expect(state.sendMessage("alyssa", "Tidak terkirim")).toBe(false);
  expect(state.messages.alyssa).toHaveLength(1);
});

test("shared session changes update detail and reset removes likes and messages", () => {
  mount(
    <ProfileDetailScreen
      route={{ params: { profileId: "kiara" } }}
      navigation={{}}
    />
  );
  act(() => state.toggleLike("kiara"));
  expect(button("Batal love Kiara")).toBeDefined();
  expect(button("Mulai chat dengan Kiara").props.disabled).toBe(false);
  act(() => state.sendMessage("kiara", "Halo"));
  act(() => state.resetSession());
  expect(state.likedIds).toEqual([]);
  expect(state.messages).toEqual({});
  expect(button("Chat terkunci").props.disabled).toBe(true);
});
