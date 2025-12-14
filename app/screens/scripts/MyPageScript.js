// scripts/MyPageScript.js
import { useEffect, useState } from "react";
import { Alert } from "react-native";
import ApiService from "../../api/apiService";
import { useAuthStore } from "../../store/authStore";

export default function useMyPageScript() {
  const { user, token, logout } = useAuthStore();

  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ======================
     비밀번호 변경
  ====================== */
  const [showPwModal, setShowPwModal] = useState(false);
  const [oldPw, setOldPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [newPw2, setNewPw2] = useState("");

  // 그룹 생성
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");

  // 초대
  // 초대 모달
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteTarget, setInviteTarget] = useState("");

  const changePassword = async () => {
    if (!oldPw || !newPw || !newPw2) {
      return Alert.alert("오류", "모든 칸을 입력하세요.");
    }
    if (newPw !== newPw2) {
      return Alert.alert("오류", "비밀번호가 일치하지 않습니다.");
    }

    try {
      await ApiService.post(
        "/api/auth/change-password",
        { oldPassword: oldPw, newPassword: newPw },
        token
      );

      Alert.alert("완료", "비밀번호가 변경되었습니다.");
      setShowPwModal(false);
      setOldPw("");
      setNewPw("");
      setNewPw2("");
    } catch {
      Alert.alert("오류", "비밀번호 변경 실패");
    }
  };

  /* ======================
     그룹 로드
  ====================== */
  const loadGroups = async () => {
    try {
      setLoading(true);
      const res = await ApiService.get("/api/family/me", token);

      if (res?.groups) setGroups(res.groups);
      else if (res?.family) setGroups([res.family]);
      else setGroups([]);
    } catch (e) {
      console.log("MyPage load error:", e);
    } finally {
      setLoading(false);
    }
  };

  /* ======================
     그룹 생성
  ====================== */
  const createGroup = async () => {
    if (!newGroupName.trim()) {
      return Alert.alert("오류", "그룹명을 입력하세요.");
    }

    try {
      await ApiService.post(
        "/api/family/create",
        { name: newGroupName },
        token
      );

      Alert.alert("완료", "그룹이 생성되었습니다.");
      setShowCreateModal(false);
      setNewGroupName("");
      loadGroups();
    } catch (e) {
      Alert.alert("오류", e?.message || "그룹 생성 실패");
    }
  };

  /* ======================
     구성원 초대
  ====================== */
  const inviteMember = async (family_id) => {
    if (!inviteTarget.trim()) {
      return Alert.alert("오류", "초대할 사용자 ID를 입력하세요.");
    }

    try {
      await ApiService.post(
        "/api/family/invite",
        { target_id: inviteTarget },
        token
      );

      Alert.alert("완료", "초대를 전송했습니다.");
      setInviteTarget("");
      setShowInviteModal(false);
    } catch (e) {
      const msg =
        e?.response?.data?.message ||
        e?.message ||
        "초대에 실패했습니다.";

      Alert.alert("오류", msg);
    }
  };

  /* ======================
     구성원 잠금
  ====================== */
  const toggleLock = async (family_id, target_id, locked) => {
    await ApiService.post(
      "/api/family/lock",
      { family_id, target_id, lock: !locked },
      token
    );
    loadGroups();
  };

  /* ======================
     구성원 삭제
  ====================== */
  const kickMember = async (family_id, member_id) => {
    await ApiService.post(
      "/api/family/kick",
      { family_id, member_id },
      token
    );
    loadGroups();
  };

  /* ======================
     그룹 삭제
  ====================== */
  const deleteGroup = async (family_id) => {
    await ApiService.delete(
      `/api/family/delete?family_id=${family_id}`,
      token
    );
    loadGroups();
  };

  /* ======================
     그룹 탈퇴
  ====================== */
  const leaveGroup = async (family_id) => {
    await ApiService.post("/api/family/leave", { family_id }, token);
    Alert.alert("완료", "그룹에서 탈퇴했습니다.");
    loadGroups();
  };

  const [inviteFamilyId, setInviteFamilyId] = useState(null);

  /* ======================
     로그아웃
  ====================== */
  const handleLogout = () => {
    Alert.alert("로그아웃", "정말 로그아웃 하시겠습니까?", [
      { text: "취소", style: "cancel" },
      { text: "확인", onPress: logout },
    ]);
  };

  useEffect(() => {
    if (user && token) loadGroups();
  }, [user, token]);

  return {
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
  };
}
