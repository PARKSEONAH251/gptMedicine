// screens/MyPageScreen.js
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Modal,
  TextInput
} from "react-native";

import styles from "../style/mypage.styles";
import useMyPageScript from "./scripts/MyPageScript";

export default function MyPageScreen() {
  const {
    user,
    groups,
    loading,

    // 비밀번호
    showPwModal,
    setShowPwModal,
    oldPw,
    setOldPw,
    newPw,
    setNewPw,
    newPw2,
    setNewPw2,
    changePassword,

    // 그룹 생성
    showCreateModal,
    setShowCreateModal,
    newGroupName,
    setNewGroupName,
    createGroup,

    // 초대
    inviteTarget,
    setInviteTarget,
    inviteMember,
    showInviteModal,
    setShowInviteModal,
    inviteFamilyId,
    setInviteFamilyId,


    // 그룹 관리
    toggleLock,
    kickMember,
    deleteGroup,
    leaveGroup,

    // 기타
    handleLogout,
  } = useMyPageScript();

  if (!user) {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* ======================
         내 정보
      ====================== */}
      <View style={styles.infoBox}>
        <Text style={styles.title}>내 정보</Text>
        <Text>ID: {user.userID}</Text>
        <Text>이름: {user.name}</Text>
        <Text>역할: {user.role}</Text>

        <TouchableOpacity
          style={styles.passwordButton}
          onPress={() => setShowPwModal(true)}
        >
          <Text style={styles.passwordText}>비밀번호 변경</Text>
        </TouchableOpacity>
      </View>

      {/* ======================
         비밀번호 변경 모달
      ====================== */}
      <Modal transparent visible={showPwModal} animationType="fade">
        <View style={styles.modalBackground}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>비밀번호 변경</Text>

            <TextInput
              placeholder="기존 비밀번호"
              secureTextEntry
              style={styles.input}
              value={oldPw}
              onChangeText={setOldPw}
            />

            <TextInput
              placeholder="신규 비밀번호"
              secureTextEntry
              style={styles.input}
              value={newPw}
              onChangeText={setNewPw}
            />

            <TextInput
              placeholder="신규 비밀번호 확인"
              secureTextEntry
              style={styles.input}
              value={newPw2}
              onChangeText={setNewPw2}
            />

            <View style={styles.modalButtonRow}>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={changePassword}
              >
                <Text style={styles.saveText}>저장</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowPwModal(false)}
              >
                <Text style={styles.cancelText}>취소</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ======================
        그룹 관리
      ====================== */}
      <Text style={styles.sectionTitle}>그룹 관리</Text>

      {loading ? (
        <ActivityIndicator />
      ) : groups.length === 0 ? (
        <Text style={styles.noGroupText}>소속된 그룹이 없습니다.</Text>
      ) : (
        groups.map((group) => (
          <View key={group.family_id} style={styles.groupBox}>
            <Text style={styles.groupName}>{group.name}</Text>
            <Text>관리자: {group.leader_id}</Text>

            {/* ======================
              구성원 목록
            ====================== */}
            {group.members?.map((m) => {
              const memberId = m.userID;
              const locked = m.locked;

              return (
                <View key={memberId} style={styles.memberRow}>
                  <Text style={styles.memberName}>
                    {m.name ?? memberId}
                    {locked && " 🔒"}
                  </Text>

                  {/* ======================
                    관리자 기능
                  ====================== */}
                  {user.userID === group.leader_id && (
                    <View style={styles.memberButtons}>
                      <TouchableOpacity
                        style={styles.lockButton}
                        onPress={() =>
                          toggleLock(group.family_id, memberId, locked)
                        }
                      >
                        <Text>{locked ? "잠금 해제" : "잠금"}</Text>
                      </TouchableOpacity>

                      {memberId !== group.leader_id && (
                        <TouchableOpacity
                          style={styles.kickButton}
                          onPress={() =>
                            kickMember(group.family_id, memberId)
                          }
                        >
                          <Text>강퇴</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  )}

                  {/* ======================
                    본인 탈퇴
                  ====================== */}
                  {memberId === user.userID &&
                    user.userID !== group.leader_id && (
                      <TouchableOpacity
                        style={styles.leaveButton}
                        onPress={() => leaveGroup(group.family_id)}
                      >
                        <Text>탈퇴</Text>
                      </TouchableOpacity>
                    )}
                </View>
              );
            })}

            {/* ======================
              초대 기능 (관리자만)
            ====================== */}
            {user.userID === group.leader_id && (
              <TouchableOpacity
                style={styles.inviteButton}
                onPress={() => {
                  setInviteFamilyId(group.family_id);
                  setShowInviteModal(true);
                }}
              >
                <Text style={styles.inviteText}>구성원 초대</Text>
              </TouchableOpacity>
            )}

            {/* ======================
              그룹 삭제 (관리자)
            ====================== */}
            {user.userID === group.leader_id && (
              <TouchableOpacity
                style={styles.groupDeleteButton}
                onPress={() => deleteGroup(group.family_id)}
              >
                <Text style={styles.groupDeleteText}>그룹 삭제</Text>
              </TouchableOpacity>
            )}
          </View>
        ))
      )}

      {/* ======================
        그룹 생성 버튼
      ====================== */}
      {groups.length === 0 && user.role === "self" && (
        <TouchableOpacity
          style={styles.addGroupButton}
          onPress={() => setShowCreateModal(true)}
        >
          <Text style={styles.addGroupText}>+ 새 그룹 만들기</Text>
        </TouchableOpacity>
      )}

      {/* ======================
        그룹 생성 모달
      ====================== */}
      <Modal transparent visible={showCreateModal} animationType="fade">
        <View style={styles.modalBackground}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>새 그룹 만들기</Text>

            <TextInput
              placeholder="그룹 이름"
              style={styles.input}
              value={newGroupName}
              onChangeText={setNewGroupName}
            />

            <View style={styles.modalButtonRow}>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={createGroup}
              >
                <Text style={styles.saveText}>생성</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowCreateModal(false)}
              >
                <Text style={styles.cancelText}>취소</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal transparent visible={showInviteModal} animationType="fade">
        <View style={styles.modalBackground}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>구성원 초대</Text>

            <TextInput
              placeholder="초대할 사용자 ID"
              style={styles.input}
              value={inviteTarget}
              onChangeText={setInviteTarget}
              autoCapitalize="none"
            />

            <View style={styles.modalButtonRow}>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={() => inviteMember(inviteFamilyId)}
              >
                <Text style={styles.saveText}>초대하기</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setInviteTarget("");
                  setShowInviteModal(false);
                }}
              >
                <Text style={styles.cancelText}>취소</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ======================
        로그아웃
      ====================== */}
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleLogout}
      >
        <Text style={styles.logoutText}>로그아웃</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
