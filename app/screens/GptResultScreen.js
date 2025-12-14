import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import styles from "../style/gptResult.styles";
import useGptResultScreenLogic from "./scripts/GptResultScreenScript";

export default function GptResultScreen({ route, navigation }) {
  const {
    question,
    answer,
    onSaveFavorite,
  } = useGptResultScreenLogic(route, navigation);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.questionBox}>
        <Text style={styles.questionLabel}>질문</Text>
        <Text style={styles.questionText}>{question}</Text>
      </View>

      <View style={styles.answerBox}>
        <Text style={styles.answerLabel}>GPT 답변</Text>
        <Text style={styles.answerText}>{answer}</Text>
      </View>

      <TouchableOpacity onPress={onSaveFavorite}>
        <Text>즐겨찾기 저장</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
