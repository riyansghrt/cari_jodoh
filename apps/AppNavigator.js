import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import SplashScreen from "./resource/SplashScreen";
import LoginScreen from "./screen/LoginScreen";
import OtpScreen from "./screen/OtpScreen";
import StepRegister from "./screen/stepregister";
import EditProfileScreen from "./screen/EditProfileScreen";
import MainTabs from "./MainTabs";
import ProfileDetailScreen from "./screen/ProfileDetailScreen";
import ChatScreen from "./screen/ChatScreen";
import PremiumScreen from "./screen/PremiumScreen";
import { MatchProvider } from "./state/MatchContext";
import SafeAreaWrapper from "./SafeAreaWrapper";
import { Colors } from "./component/Colors";

const Stack = createStackNavigator();

const Splash = (props) => (
  <SafeAreaWrapper backgroundColor={Colors.white}>
    <SplashScreen {...props} />
  </SafeAreaWrapper>
);

export default function AppNavigator() {
  return (
    <MatchProvider>
      <Stack.Navigator
        initialRouteName="SplashScreen"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="SplashScreen" component={Splash} />
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="OtpScreen" component={OtpScreen} />
        <Stack.Screen name="StepRegister" component={StepRegister} />
        <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} />
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen
          name="ProfileDetailScreen"
          component={ProfileDetailScreen}
        />
        <Stack.Screen name="ChatScreen" component={ChatScreen} />
        <Stack.Screen name="PremiumScreen" component={PremiumScreen} />
      </Stack.Navigator>
    </MatchProvider>
  );
}
