import { StyleSheet } from "react-native";

export default StyleSheet.create({
  /* ======================
     기본 레이아웃 (신규 유지)
  ====================== */
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },

  topPattern: {
    width: "100%",
    height: 120,
  },

  bottomPattern: {
    width: "100%",
    height: 140,
  },

  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 12,
  },

  /* ======================
     헤더 (신규 유지)
  ====================== */
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },

  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
  },

  headerButtonGroup: {
    flexDirection: "row",
  },

  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#F4F4F4",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },

  headerButtonText: {
    fontSize: 20,
    fontWeight: "600",
  },

  /* ======================
     캘린더 / 리스트 (신규 유지)
  ====================== */
  calendarBox: {
    borderRadius: 16,
    marginBottom: 16,
  },

  dateTitle: {
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 10,
  },

  emptyText: {
    textAlign: "center",
    marginTop: 30,
    color: "#888",
    fontSize: 15,
  },

  logItem: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    backgroundColor: "#F4F4F4",
  },

  logDone: {
    backgroundColor: "#E6FFFA",
  },

  logCanceled: {
    backgroundColor: "#FFECEC",
  },

  logRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },

  logTime: {
    fontSize: 16,
    fontWeight: "700",
  },

  logStatus: {
    fontSize: 14,
    fontWeight: "600",
  },

  logSubText: {
    fontSize: 14,
    color: "#555",
  },

  lockHintText: {
    marginTop: 6,
    fontSize: 13,
    color: "#B00020",
  },

  /* ======================
     🔥 기존 스타일에서 복구된 영역 (겹치지 않음)
  ====================== */

  /* 모달 */
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalBox: {
    width: "90%",
    maxHeight: "90%",
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },

  /* 입력 */
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },

  label: {
    fontSize: 13,
    fontWeight: "600",
    marginTop: 6,
    marginBottom: 4,
  },

  dateBox: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#eee",
    marginBottom: 10,
  },

  disabledBox: {
    backgroundColor: "#ddd",
  },

  /* 라디오 */
  sectionTitle: {
    marginTop: 12,
    marginBottom: 6,
    fontSize: 14,
    fontWeight: "bold",
  },

  radioGroup: {
    flexDirection: "row",
    flexWrap: "wrap",
  },

  radioItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 12,
    marginBottom: 6,
  },

  radioOuter: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: "#666",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 6,
  },

  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#333",
  },

  radioLabel: {
    fontSize: 13,
  },

  /* 요일 */
  weekdayRow: {
    flexDirection: "row",
    flexWrap: "wrap",
  },

  weekdayChip: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 14,
    backgroundColor: "#eee",
    marginRight: 6,
    marginBottom: 6,
  },

  weekdayChipActive: {
    backgroundColor: "#cce4ff",
  },

  /* 시간 */
  timeBox: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#eee",
    marginBottom: 6,
  },

  timeText: {
    fontSize: 14,
  },

  /* 모달 버튼 */
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 14,
  },

  cancelBtn: {
    padding: 10,
  },

  addBtn: {
    padding: 10,
  },

  deleteBtnBox: {
    padding: 10,
  },

  deleteBtnText: {
    color: "#b00020",
  },

  memberItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
});
