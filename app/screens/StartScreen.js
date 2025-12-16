import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import styles from "../style/start.styles";

export default function StartScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Image
        source={require("../../public/image/Primary_Pattern.png")}
        style={styles.topPattern}
        resizeMode="cover"
      />

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

      <Image
        source={require("../../public/image/pattern.png")}
        style={styles.bottomPattern}
        resizeMode="cover"
      />
    </View>
  );
}
