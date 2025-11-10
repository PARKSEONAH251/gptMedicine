import React from "react";
import { SafeAreaView, View, Text, TouchableOpacity, Image } from "react-native";
import styles from "./LgoinJoinscreen.styles";

export default function LoginJoinScreen() {
  console.log("✅ LoginJoinScreen 렌더링됨");

  return (
    <SafeAreaView style={styles.container}>
      {/* 상단 블랙 영역 */}
      <View style={styles.topWave} />

      {/* 메인 콘텐츠 */}
      <View style={styles.content}>
        <Text style={styles.title}>약챗GO</Text>

        {/* 중앙 이미지 */}
        <Image
          source={require("../assets/pattern.png")}
          style={styles.image}
          resizeMode="contain"
        />

        {/* 버튼 2개 */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.loginButton}>
            <Text style={styles.loginText}>로그인</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.signupButton}>
            <Text style={styles.signupText}>회원가입</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
