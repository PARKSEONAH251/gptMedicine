import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import styles from "../style/start.styles";

export default function StartScreen({ navigation }) {
  return (
    <View style={styles.container}>
      {/* 상단 패턴 */}
      <Image
        source={require("../../public/image/Primary_Pattern.png")}
        style={styles.topPattern}
        resizeMode="cover"
      />

      {/* 중앙 콘텐츠 */}
      <View style={styles.centerContent}>
        <Image
          source={require("../../public/image/medicalsafe_logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.appTitle}>MEDICAL SAFE</Text>
        <Text style={styles.subtitle}>
          안전한 복약 관리를 시작하세요
        </Text>
      </View>

      {/* 버튼 영역 */}
      <View style={styles.buttonArea}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={styles.primaryButtonText}>로그인</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.outlineButton}
          onPress={() => navigation.navigate("Signup")}
        >
          <Text style={styles.outlineButtonText}>회원가입</Text>
        </TouchableOpacity>
      </View>

      {/* 하단 패턴 */}
      <Image
        source={require("../../public/image/pattern.png")}
        style={styles.bottomPattern}
        resizeMode="cover"
      />
    </View>
  );
}
