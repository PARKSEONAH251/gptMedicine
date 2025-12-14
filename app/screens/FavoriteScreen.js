// screens/FavoriteScreen.js
import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import ApiService from "../api/apiService";
import { useAuthStore } from "../store/authStore";
import styles from "../style/favorite.styles";

export default function FavoriteScreen({ navigation, route }) {
  const { token } = useAuthStore();
  const [list, setList] = useState([]);

  const loadFavorites = async () => {
    const res = await ApiService.get("/api/favorite", token);
    setList(res);
  };

  // ✅ 화면에 들어오거나 돌아올 때마다 목록 갱신
  useFocusEffect(
    useCallback(() => {
      loadFavorites();

      // refresh 플래그 정리
      if (route.params?.refresh) {
        navigation.setParams({ refresh: false });
      }
    }, [route?.params])
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.box}
      onPress={() =>
        navigation.navigate("FavoriteDetail", { id: item._id })
      }
    >
      <Text style={styles.title}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>⭐ 즐겨찾기</Text>

      <FlatList
        data={list}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={styles.empty}>저장된 즐겨찾기가 없습니다.</Text>
        }
      />
    </View>
  );
}
