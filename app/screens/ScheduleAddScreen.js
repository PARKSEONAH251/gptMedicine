import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";

import styles from "../style/scheduleAdd.styles";
import ApiService from "../api/apiService";
import { useAuthStore } from "../store/authStore";

export default function ScheduleAddScreen({ navigation }) {
  const { token } = useAuthStore();

  const [medicineName, setMedicineName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [timesPerDay, setTimesPerDay] = useState(1);
  const [method, setMethod] = useState("");
  const [cycle, setCycle] = useState(1); // n일마다

  const createSchedule = async () => {
    if (!medicineName || !startDate || !endDate) {
      Alert.alert("필수 정보 누락", "약 이름과 시작/종료일은 필수입니다.");
      return;
    }

    await ApiService.post(
      "/api/schedule/create",
      {
        medicineName,
        startDate,
        endDate,
        timesPerDay,
        cycle,
        method,
      },
      token
    );

    Alert.alert("완료", "스케줄이 추가되었습니다.");
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>일정 추가</Text>

      <TextInput
        style={styles.input}
        placeholder="약물 이름"
        value={medicineName}
        onChangeText={setMedicineName}
      />

      <TextInput
        style={styles.input}
        placeholder="복용 시작일 (YYYY-MM-DD)"
        value={startDate}
        onChangeText={setStartDate}
      />

      <TextInput
        style={styles.input}
        placeholder="복용 종료일 (YYYY-MM-DD)"
        value={endDate}
        onChangeText={setEndDate}
      />

      <TextInput
        style={styles.input}
        placeholder="복용 방법 (예: 식후 30분)"
        value={method}
        onChangeText={setMethod}
      />

      <TextInput
        style={styles.input}
        placeholder="하루 복용 횟수"
        keyboardType="numeric"
        value={String(timesPerDay)}
        onChangeText={(v) => setTimesPerDay(Number(v))}
      />

      <TextInput
        style={styles.input}
        placeholder="복용 주기 (예: 1 = 매일)"
        keyboardType="numeric"
        value={String(cycle)}
        onChangeText={(v) => setCycle(Number(v))}
      />

      <TouchableOpacity style={styles.submitButton} onPress={createSchedule}>
        <Text style={styles.submitText}>추가하기</Text>
      </TouchableOpacity>
    </View>
  );
}
