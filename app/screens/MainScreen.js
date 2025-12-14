// screens/MainScreen.js
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  Image,
} from "react-native";

import styles from "../style/main.styles";
import useMainScreenLogic from "./scripts/MainScreenScript";

export default function MainScreen({ navigation }) {
  const {
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
    onPickImage,
    onSendChat,
  } = useMainScreenLogic(navigation);

  if (!user) return null;

  const displayName = user.name || user.userID;

  return (
    <View style={styles.container}>
      {/* 상단 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate("MyPage")}>
          <Text style={styles.headerButton}>마이페이지</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.favoriteNavButton}
          onPress={() => navigation.navigate("Favorite")}
        >
          <Text style={styles.favoriteNavText}>⭐ 즐겨찾기</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.userGreeting}>{displayName}님 환영합니다!</Text>
      <Text style={styles.todayMessage}>{todayMessage}</Text>

      <TextInput
        style={styles.inputBox}
        placeholder="약물 정보를 물어보세요 (준비 중)"
        value={inputText}
        onChangeText={setInputText}
      />

      {attachedImage && (
        <View style={styles.imagePreviewBox}>
          <Image
            source={{ uri: attachedImage.uri }}
            style={styles.imagePreview}
          />
          <TouchableOpacity onPress={() => setAttachedImage(null)}>
            <Text style={styles.removeImage}>삭제</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.photoButton} onPress={onPickImage}>
          <Text>
            {attachedImage ? "✅ 이미지 로드 완료!" : "📷 사진 첨부"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.sendButton} onPress={onSendChat}>
          <Text style={styles.sendText}>전송</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.calendarButton}
        onPress={() => navigation.navigate("Calendar")}
      >
        <Text style={styles.calendarButtonText}>📅 캘린더 보기</Text>
      </TouchableOpacity>

      {/* 초대 모달 */}
      <Modal transparent visible={showInviteModal} animationType="fade">
        <View style={styles.modalBackground}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>그룹 초대</Text>

            {invites.map((inv) => (
              <View key={inv.family_id} style={{ marginBottom: 10 }}>
                <Text>그룹명: {inv.name}</Text>

                <View style={{ flexDirection: "row", marginTop: 8 }}>
                  <TouchableOpacity
                    style={styles.acceptButton}
                    onPress={() => acceptInvite(inv.family_id)}
                  >
                    <Text style={styles.acceptText}>수락</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.declineButton}
                    onPress={() => rejectInvite(inv.family_id)}
                  >
                    <Text style={styles.declineText}>거절</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowInviteModal(false)}
            >
              <Text style={styles.closeText}>닫기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
