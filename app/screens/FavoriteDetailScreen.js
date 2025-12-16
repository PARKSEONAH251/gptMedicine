// screens/FavoriteDetailScreen.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import ApiService from "../api/apiService";
import { useAuthStore } from "../store/authStore";
import styles from "../style/favoriteDetail.styles";

export default function FavoriteDetailScreen({ route, navigation }) {
  const { id } = route.params;
  const { token } = useAuthStore();
  const [item, setItem] = useState(null);

  useEffect(() => {
    loadDetail();
  }, []);

  const loadDetail = async () => {
    const res = await ApiService.get(`/api/favorite/${id}`, token);
    setItem(res);
  };

  const onDelete = async () => {
    await ApiService.delete(`/api/favorite/${id}`, token);
    navigation.navigate("Favorite", { refresh: true });
  };

  if (!item) return null;

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
        <Text style={styles.deleteText}>✕</Text>
      </TouchableOpacity>

      <ScrollView>
        <View style={styles.card}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.content}>
            {item.content?.answer || ""}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
