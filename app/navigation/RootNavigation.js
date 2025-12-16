//app/navigation/RootNavigation.js
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import StartScreen from "../screens/StartScreen";
import LoginScreen from "../screens/LoginScreen";
import SignupScreen from "../screens/SignupScreen";
import MainScreen from "../screens/MainScreen";

import MyPageScreen from "../screens/MyPageScreen";
import CalendarScreen from "../screens/CalendarScreen";
import GptResultScreen from "../screens/GptResultScreen";
import FavoriteScreen from "../screens/FavoriteScreen";
import FavoriteDetailScreen from "../screens/FavoriteDetailScreen";

const Stack = createNativeStackNavigator();

export default function RootNavigation() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Start" component={StartScreen} />

      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />

      <Stack.Screen name="Home" component={MainScreen} />
      <Stack.Screen name="MyPage" component={MyPageScreen} />
      <Stack.Screen name="Calendar" component={CalendarScreen} />
      <Stack.Screen name="ScheduleAdd" component={ScheduleAddScreen} />
      <Stack.Screen name="GptResult" component={GptResultScreen} />
      <Stack.Screen name="Favorite" component={FavoriteScreen} />
      <Stack.Screen name="FavoriteDetail" component={FavoriteDetailScreen} />
    </Stack.Navigator>
  );
}
