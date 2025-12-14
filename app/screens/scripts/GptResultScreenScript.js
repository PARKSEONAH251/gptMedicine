import { Alert } from "react-native";
import ApiService from "../../api/apiService";
import { useAuthStore } from "../../store/authStore";

export default function useGptResultScreenLogic(route, navigation) {
  const { token } = useAuthStore();

  const question = route?.params?.question || "";
  const answer = route?.params?.answer || "응답이 없습니다.";

  const onSaveFavorite = async () => {
    try {
      await ApiService.post(
        "/api/favorite",
        {
          title: question || "이미지 검색",
          content: answer,
        },
        token
      );

      Alert.alert("안내", "저장되었습니다.", [
        {
          text: "확인",
          onPress: () => navigation.navigate("Favorite"),
        },
      ]);
    } catch {
      Alert.alert("오류", "저장 실패");
    }
  };

  return {
    loading: false,
    question,
    answer,
    onSaveFavorite,
  };
}
