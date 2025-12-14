/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 */

import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import AuthStack from "./app/navigation/AuthStack";
import AppStack from "./app/navigation/AppStack";
import { useAuthStore } from "./app/store/authStore";

export default function App() {
  const { token, loading, loadAuth } = useAuthStore();

  useEffect(() => {
    loadAuth();
  }, []);

  if (loading) return null; // SplashScreen 연결 가능

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        {token ? <AppStack /> : <AuthStack />}
      </NavigationContainer>
    </SafeAreaProvider>
  );
}