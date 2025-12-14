import React, { useEffect, useRef } from "react";
import { View, Animated, Text } from "react-native";

export default function SplashScreen() {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.3, duration: 800, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <View style={{ flex:1, justifyContent:"center", alignItems:"center" }}>
      <Animated.Text style={{ opacity, fontSize:18 }}>
        앱 준비 중…
      </Animated.Text>
    </View>
  );
}
