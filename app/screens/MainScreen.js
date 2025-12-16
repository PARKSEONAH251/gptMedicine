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
      <Image
        source={require("../../public/image/Primary_Pattern.png")}
        style={styles.topPattern}
        resizeMode="stretch"
      />

      <View style={styles.content}>
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

        <View style={styles.greetingCard}>
          <Text style={styles.userGreeting}>{displayName}님</Text>
          <Text style={styles.todayMessage}>{todayMessage}</Text>
        </View>

        <TextInput
          style={styles.inputBox}
          placeholder="약물 정보를 물어보세요"
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

      <Image
        source={require("../../public/image/pattern.png")}
        style={styles.bottomPattern}
        resizeMode="stretch"
      />

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
