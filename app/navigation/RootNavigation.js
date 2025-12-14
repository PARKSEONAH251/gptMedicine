//app/navigation/RootNavigation.js
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// 기본 화면들
import StartScreen from "../screens/StartScreen";
import LoginScreen from "../screens/LoginScreen";
import SignupScreen from "../screens/SignupScreen";
import MainScreen from "../screens/MainScreen";

// 추가 화면들
import MyPageScreen from "../screens/MyPageScreen";
import CalendarScreen from "../screens/CalendarScreen";
import GptResultScreen from "../screens/GptResultScreen";
import FavoriteScreen from "../screens/FavoriteScreen";
import FavoriteDetailScreen from "../screens/FavoriteDetailScreen";

const Stack = createNativeStackNavigator();

export default function RootNavigation() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* 첫 화면 */}
      <Stack.Screen name="Start" component={StartScreen} />

      {/* 인증 관련 */}
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />

      {/* 메인 */}
      <Stack.Screen name="Home" component={MainScreen} />

      {/* 기타 기능 화면 등록 */}
      <Stack.Screen name="MyPage" component={MyPageScreen} />
      <Stack.Screen name="Calendar" component={CalendarScreen} />
      <Stack.Screen name="ScheduleAdd" component={ScheduleAddScreen} />
      <Stack.Screen name="GptResult" component={GptResultScreen} />
      <Stack.Screen name="Favorite" component={FavoriteScreen} />
      <Stack.Screen name="FavoriteDetail" component={FavoriteDetailScreen} />
    </Stack.Navigator>
  );
}
