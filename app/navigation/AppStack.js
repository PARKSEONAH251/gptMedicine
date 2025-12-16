// app/navigation/AppStack.js
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import MainScreen from "../screens/MainScreen";
import MyPageScreen from "../screens/MyPageScreen";
import CalendarScreen from "../screens/CalendarScreen";
import ScheduleAddScreen from "../screens/ScheduleAddScreen";
import GptResultScreen from "../screens/GptResultScreen";
import FavoriteScreen from "../screens/FavoriteScreen";
import FavoriteDetailScreen from "../screens/FavoriteDetailScreen";

const Stack = createNativeStackNavigator();

export default function AppStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
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
