// screens/scripts/CalendarScript.js
import { useEffect, useState } from "react";
import ApiService from "../../api/apiService";
import { useAuthStore } from "../../store/authStore";
import { Alert } from "react-native";

export default function useCalendarLogic() {
  const { user } = useAuthStore();
  const { token } = useAuthStore.getState();

  const today = new Date().toISOString().slice(0, 10);

  /* ======================
     캘린더/로그
  ====================== */
  const [loading, setLoading] = useState(false);

  /* ======================
     잠금(UX)
     - 서버 lock은 delete에서 강제됨
     - UI는 추가로 비활성화
  ====================== */
  const [isLocked, setIsLocked] = useState(false);

  /* ======================
     스케줄 입력 상태 (추가/수정 공용)
  ====================== */
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingScheduleId, setEditingScheduleId] = useState(null);

  const [medicineName, setMedicineName] = useState("");
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);

  const [cycle, setCycle] = useState("daily"); // daily | weekly
  const [weekdays, setWeekdays] = useState([]); // [0..6]
  const [method, setMethod] = useState("oral");

  const [perDay, setPerDay] = useState(1);
  const [times, setTimes] = useState(["08:00"]);

  const [selectedDate, setSelectedDate] = useState(today);
  const [logs, setLogs] = useState([]);

  /* ======================
     Picker 상태
  ====================== */
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [timePickerIndex, setTimePickerIndex] = useState(null);

  /* ======================
     (선택) 잠금상태 로드
     - Family 라우트가 /api/family/me 로 locked 배열을 준다는 전제
     - 없으면 그냥 false 유지
  ====================== */
  const loadLock = async () => {
    try {
      const res = await ApiService.get("/api/family/me", token);
      const group = res?.groups?.[0];
      const members = group?.members || [];

      // members: [{ userID, name, locked }]
      const me = members.find((m) => m.userID === user.userID);
      setIsLocked(!!me?.locked);
    } catch {
      setIsLocked(false);
    }
  };

  /* ======================
     로그 조회
  ====================== */
  const fetchLogs = async (date) => {
    setLoading(true);
    try {
      const url = isGuardianView
        ? `/api/schedule/logs?date=${date}&targetUser=${targetUser}`
        : `/api/schedule/logs?date=${date}`;

      const data = await ApiService.get(url, token);
      setLogs(Array.isArray(data) ? data : []);
    } catch {
      setLogs([]);
    }
    setLoading(false);
  };

const loadSchedules = async () => {
  try {
    const data = await ApiService.get("/api/schedule/all", token);
    setScheduleList(Array.isArray(data) ? data : []);
    setShowScheduleList(true);
  } catch {
    setScheduleList([]);
    setShowScheduleList(true);
  }
};

  
  const openEditSchedule = async (scheduleId) => {
    const id = pickScheduleId(scheduleId);

    if (!isValidObjectId(id)) {
      Alert.alert("오류", "잘못된 스케줄 ID");
      return;
    }

    try {
      const schedule = await ApiService.get(
        `/api/schedule/${id}`,
        token
      );

      setEditingScheduleId(schedule._id);
      setMedicineName(schedule.medicine_name || "");
      setStartDate(schedule.start_date || today);
      setEndDate(schedule.end_date || today);
      setTimes(schedule.times || ["08:00"]);
      setPerDay(schedule.times?.length || 1);
      setCycle(schedule.cycle || "daily");
      setWeekdays(schedule.weekdays || []);
      setMethod(schedule.method || "oral");

      setShowEditModal(true);
    } catch {
      Alert.alert("오류", "스케줄 불러오기 실패");
    }
  };

  /* ======================
     복용 토글 (UX: Alert 포함)
     - 서버는 status: null/0/1 중 1<->0 로 토글됨(현재 라우트 기준)
  ====================== */
  const confirmToggleLog = (log) => {
    // 잠금은 “삭제/수정” 제한이고, 복용 체크까지 잠그려면 여기서 막으면 됨.
    // 지금 요구사항은 "보호자 잠금 시 버튼 비활성화"가 주로 삭제/수정이라 판단 → 체크는 허용.
    const isDone = log.status === 1;

    Alert.alert(
      isDone ? "복용 취소" : "복용 확인",
      isDone ? "복용이 취소 되었어요.\n(상태를 미복용으로 되돌릴까요?)" : "약을 드셨나요?",
      [
        { text: "아니오", style: "cancel" },
        {
          text: "예",
          onPress: async () => {
            try {
              const updated = await ApiService.post(
                "/api/schedule/logs/toggle",
                { log_id: log._id },
                token
              );
              setLogs((prev) => prev.map((l) => (l._id === updated._id ? { ...l, ...updated } : l)));
            } catch {
              Alert.alert("오류", "복용 상태 변경 실패");
            }
          }
        }
      ]
    );
  };

  const toggleLog = async (logId) => {
    if (isGuardianView) return;

    const updated = await ApiService.post(
      "/api/schedule/logs/toggle",
      { log_id: logId },
      token
    );

    setLogs((prev) =>
      prev.map((l) => (l._id === updated._id ? updated : l))
    );
  };

  /* ======================
     perDay / time
  ====================== */
  const updatePerDay = (n) => {
    setPerDay(n);
    setTimes((prev) => {
      const copy = [...prev];
      if (copy.length === n) return copy;
      if (copy.length > n) return copy.slice(0, n);
      while (copy.length < n) copy.push("08:00");
      return copy;
    });
  };

  const updateTime = (idx, v) => {
    setTimes((prev) => {
      const copy = [...prev];
      copy[idx] = v;
      return copy;
    });
  };

  /* ======================
     모달 초기화
  ====================== */
  const resetForm = () => {
    setMedicineName("");
    setStartDate(today);
    setEndDate(today);
    setCycle("daily");
    setWeekdays([]);
    setMethod("oral");
    setPerDay(1);
    setTimes(["08:00"]);
    setEditingScheduleId(null);
  };

  const closeAllModals = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setShowStartPicker(false);
    setShowEndPicker(false);
    setTimePickerIndex(null);
    resetForm();
  };

  /* ======================
     스케줄 생성
  ====================== */
  const createSchedule = async () => {
    // 서버 필수: medicine_name/start_date/end_date/times
    if (!medicineName.trim()) return Alert.alert("알림", "약 이름을 입력하세요.");
    if (!startDate || !endDate) return Alert.alert("알림", "시작/종료 날짜를 선택하세요.");
    if (!Array.isArray(times) || times.length === 0) return Alert.alert("알림", "복용 시간을 1개 이상 지정하세요.");

    try {
      await ApiService.post(
        "/api/schedule/create",
        {
          medicine_name: medicineName.trim(),
          start_date: startDate,
          end_date: endDate,
          times,
          cycle,
          weekdays: cycle === "weekly" ? weekdays : [],
          method
        },
        token
      );

      setShowAddModal(false);
      resetForm();
      fetchLogs(selectedDate);
    } catch (e) {
      Alert.alert("오류", e?.message || "스케줄 생성 실패");
    }
  };

  /* ======================
    전체 스케줄 목록
  ====================== */
  const [showScheduleList, setShowScheduleList] = useState(false);
  const [scheduleList, setScheduleList] = useState([]);

  /* ======================
    보호자 전환 관련
  ====================== */
  const [members, setMembers] = useState([]);
  const [targetUser, setTargetUser] = useState(user.userID);
  const [showMemberModal, setShowMemberModal] = useState(false);

  const isGuardianView =
    user.role === "protector" && targetUser !== user.userID;

  const loadMembers = async () => {
    try {
      const res = await ApiService.get("/api/family/me", token);

      // 서버 응답: { groups: [ { members: [...] } ] }
      const group = res?.groups?.[0];
      const members = group?.members || [];

      setMembers(members);
      setShowMemberModal(true);
    } catch (e) {
      setMembers([]);
      setShowMemberModal(true);
    }
  };

  const exitGuardianView = () => {
    setTargetUser(user.userID);
  };

  /* ======================
     스케줄 수정 저장 (PUT /:id)
  ====================== */
  const saveEditSchedule = async () => {
    if (!editingScheduleId) return;
    if (isLocked) return Alert.alert("잠김", "이 스케줄은 보호자에 의해 잠겨 있습니다");

    if (!medicineName.trim()) return Alert.alert("알림", "약 이름을 입력하세요.");
    if (!startDate || !endDate) return Alert.alert("알림", "시작/종료 날짜를 선택하세요.");
    if (!Array.isArray(times) || times.length === 0) return Alert.alert("알림", "복용 시간을 1개 이상 지정하세요.");

    try {
      await ApiService.put(
        `/api/schedule/${editingScheduleId}`,
        {
          medicine_name: medicineName.trim(),
          start_date: startDate,
          end_date: endDate,
          times,
          cycle,
          weekdays: cycle === "weekly" ? weekdays : [],
          method
        },
        token
      );

      setShowEditModal(false);
      resetForm();
      fetchLogs(selectedDate);
    } catch (e) {
      Alert.alert("오류", e?.message || "스케줄 수정 실패");
    }
  };

  const isValidObjectId = (id) =>
    /^[0-9a-fA-F]{24}$/.test(String(id || ""));

  const pickScheduleId = (v) => {
    if (!v) return "";
    if (typeof v === "string") return v;
    if (typeof v === "object") return v._id || v.schedule_id || "";
    return "";
  };
  
  /* ======================
    스케줄 삭제 (DELETE /:id)
  ====================== */
  const deleteSchedule = async (itemOrId) => {
    const scheduleId = pickScheduleId(itemOrId);

    if (!isValidObjectId(scheduleId)) {
      return Alert.alert("오류", `잘못된 스케줄 ID: ${String(scheduleId)}`);
    }

    if (isLocked) {
      return Alert.alert("잠김", "이 계정은 보호자에 의해 잠겨 있습니다");
    }

    Alert.alert("삭제", "이 스케줄을 삭제할까요?", [
      { text: "취소", style: "cancel" },
      {
        text: "삭제",
        style: "destructive",
        onPress: async () => {
          try {
            await ApiService.delete(
              `/api/schedule/${scheduleId}`,
              token
            );
            fetchLogs(selectedDate);
            loadSchedules();
          } catch (e) {
            Alert.alert("오류", e?.message || "삭제 실패");
          }
        }
      }
    ]);
  };


  /* ======================
     초기/변경 시 로드
  ====================== */
  useEffect(() => {
    fetchLogs(selectedDate);
  }, [selectedDate]);

  useEffect(() => {
    fetchLogs(selectedDate);
  }, [targetUser]);

  useEffect(() => {
    loadLock();
  }, []);

  return {
    user,

    selectedDate,
    setSelectedDate,
    logs,
    loading,

    showScheduleList,
    setShowScheduleList,
    scheduleList,
    loadSchedules,

    isLocked,
    loadLock,

    showAddModal,
    setShowAddModal,
    showEditModal,
    setShowEditModal,
    closeAllModals,

    medicineName,
    setMedicineName,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    cycle,
    setCycle,
    weekdays,
    setWeekdays,
    method,
    setMethod,
    perDay,
    updatePerDay,
    times,
    updateTime,

    showStartPicker,
    setShowStartPicker,
    showEndPicker,
    setShowEndPicker,
    timePickerIndex,
    setTimePickerIndex,

    createSchedule,
    deleteSchedule,
    confirmToggleLog,

    members,
    loadMembers,
    showMemberModal,
    setShowMemberModal,
    targetUser,
    setTargetUser,
    isGuardianView,
    exitGuardianView,
  };

}
