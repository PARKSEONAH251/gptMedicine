// screens/LoginScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import styles from "../style/login.styles";
import ApiService from "../api/apiService";
import { useAuthStore } from "../store/authStore";

export default function LoginScreen({ navigation }) {
  const { setAuth } = useAuthStore();
  const [userID, setUserID] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    try {
      const res = await ApiService.post("/api/auth/login", {
        userID,
        password,
      });

      if (!res.token) {
        Alert.alert("오류", "서버 응답이 올바르지 않습니다.");
        return;
      }

      await setAuth(null, res.token);
      const me = await ApiService.get("/api/auth/me", res.token);
      await setAuth(me, res.token);

      navigation.replace("Home");
    } catch (err) {
      console.log("Login Error:", err);
      Alert.alert("로그인 실패", "아이디 또는 비밀번호 오류");
    }
  };

  return (
    <View style={styles.container}>
      {/* 상단 패턴 */}
      <Image
        source={require("../../public/image/Primary_Pattern.png")}
        style={styles.topPattern}
        resizeMode="cover"
      />

      {/* 타이틀 */}
      <Text style={styles.title}>로그인</Text>

      {/* 입력 */}
      <TextInput
        style={styles.input}
        placeholder="아이디"
        value={userID}
        onChangeText={setUserID}
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="비밀번호"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {/* 로그인 버튼 */}
      <TouchableOpacity style={styles.loginButton} onPress={login}>
        <Text style={styles.loginButtonText}>로그인</Text>
      </TouchableOpacity>

      {/* 카카오 로그인 */}
      <TouchableOpacity style={styles.kakaoButton}>
        <Image
          source={require("../../public/image/kakao.png")}
          style={styles.kakaoIcon}
        />
        <Text style={styles.kakaoButtonText}>카카오로 로그인</Text>
      </TouchableOpacity>

      {/* 회원가입 이동 */}
      <TouchableOpacity
        style={styles.linkButton}
        onPress={() => navigation.navigate("Signup")}
      >
        <Text style={styles.linkText}>회원가입</Text>
      </TouchableOpacity>
    </View>
  );
}
