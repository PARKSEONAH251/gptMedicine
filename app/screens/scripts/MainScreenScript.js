// scripts/MainScreenScript.js
import { useEffect, useState } from "react";
import { Alert, Platform, PermissionsAndroid, } from "react-native";
import ApiService from "../../api/apiService";
import { useAuthStore } from "../../store/authStore";
import { launchImageLibrary } from "react-native-image-picker";

import RNBlobUtil from "react-native-blob-util";

export default function useMainScreenLogic(navigation) {
  const { token, logout } = useAuthStore();

  const [user, setUser] = useState(null);
  const [todayMessage, setTodayMessage] = useState(
    "오늘 복용 정보는 준비 중입니다."
  );

  const [inputText, setInputText] = useState("");
  const [attachedImage, setAttachedImage] = useState(null);

  const [showInviteModal, setShowInviteModal] = useState(false);
  const [invites, setInvites] = useState([]);

  const uploadImageAndText = async () => {
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const data = [];

  // 이미지 (있으면)
  if (attachedImage?.uri) {
    data.push({
      name: "image",
      filename: attachedImage.name || "image.jpg",
      type: attachedImage.type || "image/jpeg",
      data: RNBlobUtil.wrap(attachedImage.uri.replace("file://", "")),
    });
  }

  // 텍스트 (옵션)
  if (inputText.trim()) {
    data.push({
      name: "question",
      data: inputText.trim(),
    });
  }

  const res = await RNBlobUtil.fetch(
    "POST",
    "http://10.0.2.2:2803/api/gpt/medical",
    headers,
    data
  );

  return res.json();
};

  useEffect(() => {
    loadUser();
    loadInvites();
  }, []);

  const loadUser = async () => {
    try {
      const me = await ApiService.get("/api/auth/me", token);
      setUser(me);
    } catch (err) {
      console.log("유저 정보 로딩 실패:", err);
    }
  };

  const loadInvites = async () => {
    try {
      const inv = await ApiService.get("/api/family/invites", token);
      if (inv?.length > 0) {
        setInvites(inv);
        setShowInviteModal(true);
      } else {
        setInvites([]);
        setShowInviteModal(false);
      }
    } catch (err) {
      console.log("초대 조회 실패:", err);
    }
  };

  const onPickImage = async () => {
    const ok = await ensureImagePermission();
    if (!ok) {
      Alert.alert("권한 필요", "이미지 접근 권한이 필요합니다.");
      return;
    }
    if (attachedImage) {
      Alert.alert(
        "이미지 검색 취소",
        "이미지 검색을 취소하시겠습니까?",
        [
          { text: "아니오", style: "cancel" },
          {
            text: "예",
            style: "destructive",
            onPress: () => setAttachedImage(null),
          },
        ]
      );
      return;
    }

    launchImageLibrary(
      {
        mediaType: "photo",
        quality: 0.8,
        includeExtra: true,
      },
      (response) => {
        if (response.didCancel) return;
        if (response.errorCode) {
          Alert.alert("오류", "이미지 선택 실패");
          return;
        }

        const asset = response.assets?.[0];
        if (asset) {
          setAttachedImage({
            uri: asset.fileCopyUri || asset.uri,
            name: asset.fileName || "image.jpg",
            type: asset.type || "image/jpeg",
          });
        }
      }
    );
  };

  const acceptInvite = async (family_id) => {
    try {
      await ApiService.post(
        "/api/family/invite/accept",
        { family_id },
        token
      );
      Alert.alert("가입 완료", "그룹에 가입되었습니다.");

      setShowInviteModal(false);
      loadUser();
      loadInvites();
    } catch {
      Alert.alert("오류", "초대 수락 실패");
    }
  };

  const rejectInvite = async (family_id) => {
    try {
      await ApiService.post(
        "/api/family/invite/reject",
        { family_id },
        token
      );
      Alert.alert("거절 완료");
      loadInvites();
    } catch {
      Alert.alert("오류", "초대 거절 실패");
    }
  };

  const ensureImagePermission = async () => {
    if (Platform.OS !== "android") return true;

    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
    );

    return granted === PermissionsAndroid.RESULTS.GRANTED;
  };

  const onSendChat = async () => {
    if (!inputText.trim() && !attachedImage) {
      Alert.alert("안내", "질문을 입력하거나 이미지를 선택하세요.");
      return;
    }

    try {
      const res = await uploadImageAndText();

      console.log("📤 MAIN SEND OK:", {
        question: inputText,
        image: attachedImage?.uri,
      });

      navigation.navigate("GptResult", {
        question: inputText,
        answer: res.answer,
      });

      setInputText("");
      setAttachedImage(null);
    } catch (e) {
      console.error("GPT SEND ERROR:", e);
      Alert.alert("오류", "요청 처리 실패");
    }
  };

  return {
    user,
    todayMessage,
    inputText,
    attachedImage,
    invites,
    showInviteModal,

    setInputText,
    setAttachedImage,
    setShowInviteModal,

    acceptInvite,
    rejectInvite,

    logout,
    onPickImage,
    onSendChat,
  };
}
