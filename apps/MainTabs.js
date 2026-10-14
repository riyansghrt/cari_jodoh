import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Feather from "react-native-vector-icons/Feather";
import HomeScreen from "./screen/HomeScreen";
import DiscoverScreen from "./screen/DiscoverScreen";
import LikedYouScreen from "./screen/LikedYouScreen";
import ChatsScreen from "./screen/ChatsScreen";
import AccountScreen from "./screen/AccountScreen";
import { Colors } from "./component/Colors";
import { useMatches } from "./state/MatchContext";
import { profiles } from "./data/profiles";

const Tab = createBottomTabNavigator();
const icons = {
  HomeScreen: "users",
  DiscoverScreen: "compass",
  LikedYouScreen: "heart",
  ChatsScreen: "message-circle",
  AccountScreen: "user",
};

export default function MainTabs() {
  const { isMatched } = useMatches();
  const incoming = profiles.filter(
    (profile) => profile.likesYou && !isMatched(profile.id)
  ).length;
  return (
    <Tab.Navigator
      initialRouteName="HomeScreen"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.grey,
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          backgroundColor: Colors.white,
          borderTopColor: Colors.border,
        },
        tabBarLabelStyle: { fontSize: 10, fontWeight: "600" },
        tabBarBadgeStyle: {
          backgroundColor: Colors.main,
          color: Colors.white,
          fontSize: 10,
        },
        tabBarIcon: ({ color, size }) => (
          <Feather name={icons[route.name]} size={size} color={color} />
        ),
      })}
    >
      <Tab.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{ title: "People", tabBarAccessibilityLabel: "Tab People" }}
      />
      <Tab.Screen
        name="DiscoverScreen"
        component={DiscoverScreen}
        options={{
          title: "Discover",
          tabBarAccessibilityLabel: "Tab Discover",
        }}
      />
      <Tab.Screen
        name="LikedYouScreen"
        component={LikedYouScreen}
        options={{
          title: "Menyukai",
          tabBarAccessibilityLabel: "Tab Menyukai",
          tabBarBadge: incoming || undefined,
        }}
      />
      <Tab.Screen
        name="ChatsScreen"
        component={ChatsScreen}
        options={{ title: "Chat", tabBarAccessibilityLabel: "Tab Chat" }}
      />
      <Tab.Screen
        name="AccountScreen"
        component={AccountScreen}
        options={{ title: "Profil", tabBarAccessibilityLabel: "Tab Profil" }}
      />
    </Tab.Navigator>
  );
}
