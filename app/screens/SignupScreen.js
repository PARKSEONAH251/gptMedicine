import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import styles from "../style/signup.styles";
import authApi from "../api/authApi";
import { validatePassword } from "../utils/validators";

export default function SignupScreen({ navigation }) {
  const [form, setForm] = useState({
    name: "",
    userID: "",
    password: "",
    email: "",
  });

  const [idAvailable, setIdAvailable] = useState(null);
  const [loading, setLoading] = useState(false);

  const onChange = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const checkId = async () => {
    if (!form.userID) {
      Alert.alert("ID를 입력하세요");
      return;
    }
    const res = await authApi.checkId(form.userID);
    setIdAvailable(res.available);
  };

  const onSubmit = async () => {
    if (!validatePassword(form.password)) {
      Alert.alert("비밀번호 규칙 오류");
      return;
    }
    if (idAvailable !== true) {
      Alert.alert("ID 중복 체크 필요");
      return;
    }

    setLoading(true);
    await authApi.signup(form);
    setLoading(false);
    Alert.alert("회원가입 완료");
    navigation.replace("Login");
  };

  return (
    <View style={styles.container}>
      {/* 상단 패턴 */}
      <Image
        source={require("../../public/image/Primary_Pattern.png")}
        style={styles.topPattern}
        resizeMode="cover"
      />

      <Text style={styles.title}>회원가입</Text>

      <TextInput
        style={styles.input}
        placeholder="이름"
        value={form.name}
        onChangeText={v => onChange("name", v)}
      />

      {/* ID + 중복확인 */}
      <View style={styles.row}>
        <TextInput
          style={[styles.input, styles.flexInput]}
          placeholder="아이디"
          value={form.userID}
          onChangeText={v => onChange("userID", v)}
          autoCapitalize="none"
        />
        <TouchableOpacity style={styles.checkButton} onPress={checkId}>
          <Text style={styles.checkText}>중복확인</Text>
        </TouchableOpacity>
      </View>

      {idAvailable === true && (
        <Text style={styles.successText}>사용 가능한 아이디입니다</Text>
      )}
      {idAvailable === false && (
        <Text style={styles.errorText}>이미 존재하는 아이디입니다</Text>
      )}

      <TextInput
        style={styles.input}
        placeholder="비밀번호"
        secureTextEntry
        value={form.password}
        onChangeText={v => onChange("password", v)}
      />

      <TextInput
        style={styles.input}
        placeholder="이메일"
        value={form.email}
        onChangeText={v => onChange("email", v)}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TouchableOpacity
        style={styles.submitButton}
        onPress={onSubmit}
        disabled={loading}
      >
        <Text style={styles.submitText}>
          {loading ? "처리 중..." : "회원가입"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
