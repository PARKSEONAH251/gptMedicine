import React from "react";
import { View } from "react-native";
import LoginJoinScreen from "./screens/LoginJoinScreen";

export default function App() {
  return (
    <View style={{ flex: 1 }}>
      <LoginJoinScreen />
    </View>
  );
}