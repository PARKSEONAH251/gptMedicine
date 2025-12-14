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
      {/* 상단 패턴 (고정) */}
      <Image
        source={require("../../public/image/Primary_Pattern.png")}
        style={styles.topPattern}
        resizeMode="stretch"
      />

      {/* 실제 콘텐츠 영역 */}
      <View style={styles.content}>
        {/* 헤더 */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.myPageButton}
            onPress={() => navigation.navigate("MyPage")}
          >
            <Text style={styles.myPageText}>My Page</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.favoriteNavButton}
            onPress={() => navigation.navigate("Favorite")}
          >
            <Text style={styles.favoriteNavText}>즐겨찾기</Text>
          </TouchableOpacity>
        </View>

        {/* 인사 카드 */}
        <View style={styles.greetingCard}>
          <Text style={styles.userGreeting}>{displayName}님</Text>
          <Text style={styles.todayMessage}>{todayMessage}</Text>
        </View>

        {/* 입력 */}
        <TextInput
          style={styles.inputBox}
          placeholder="약물 정보를 물어보세요"
          value={inputText}
          onChangeText={setInputText}
        />

        {/* 이미지 미리보기 */}
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

        {/* 버튼 */}
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.photoButton} onPress={onPickImage}>
            <Image
              source={require("../../public/image/camera.png")}
              style={styles.buttonIcon}
            />
            <Text style={styles.photoText}>
              {attachedImage ? "이미지 선택됨" : "사진 첨부"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.sendButton} onPress={onSendChat}>
            <Text style={styles.sendText}>전송</Text>
          </TouchableOpacity>
        </View>

        {/* 캘린더 */}
        <TouchableOpacity
          style={styles.calendarButton}
          onPress={() => navigation.navigate("Calendar")}
        >
          <Image
            source={require("../../public/image/calendar.png")}
            style={styles.calendarIcon}
          />
          <Text style={styles.calendarButtonText}>복용 캘린더</Text>
        </TouchableOpacity>
      </View>

      {/* 하단 패턴 (고정) */}
      <Image
        source={require("../../public/image/pattern.png")}
        style={styles.bottomPattern}
        resizeMode="stretch"
      />

      {/* 초대 모달 */}
      <Modal transparent visible={showInviteModal} animationType="fade">
        <View style={styles.modalBackground}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>그룹 초대</Text>

            {invites.map(inv => (
              <View key={inv.family_id} style={styles.inviteBox}>
                <Text style={styles.inviteName}>{inv.name}</Text>

                <View style={styles.inviteButtonRow}>
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
