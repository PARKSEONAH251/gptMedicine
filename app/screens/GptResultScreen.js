// screens/GptResultScreen.js
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
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        
        <View style={styles.card}>
          <Text style={styles.label}>질문</Text>
          <Text style={styles.questionText}>{question}</Text>
        </View>

        <View style={[styles.card, styles.answerCard]}>
          <Text style={styles.label}>GPT 답변</Text>
          <Text style={styles.answerText}>{answer}</Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={onSaveFavorite}
        >
          <Text style={styles.favoriteText}>즐겨찾기 저장</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
