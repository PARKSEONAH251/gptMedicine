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

  useFocusEffect(
    useCallback(() => {
      loadFavorites();

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
      <View style={styles.headerRow}>
        <Text style={styles.header}>즐겨찾기</Text>
      </View>

      <FlatList
        data={list}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={
          list.length === 0 && styles.emptyContainer
        }
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <View style={styles.emptyIconBox}>
              <Text style={styles.emptyIconText}>!</Text>
            </View>
            <Text style={styles.emptyText}>
              즐겨찾기한 데이터가{"\n"}현재 없습니다.
            </Text>
          </View>
        }
      />
    </View>
  );
}
