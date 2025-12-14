// app/style/calendar.styles.js
import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    backgroundColor: "#fff"
  },

  /* ======================
     헤더
  ====================== */
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: "bold"
  },

  headerButtonGroup: {
    flexDirection: "row"
  },

  headerButton: {
    minWidth: 44,
    minHeight: 44,
    borderRadius: 10,
    backgroundColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8
  },

  headerButtonText: {
    fontSize: 20,
    fontWeight: "600"
  },

  /* ======================
     날짜 제목
  ====================== */
  dateTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 10
  },

  emptyText: {
    textAlign: "center",
    marginTop: 20,
    color: "#888"
  },

  /* ======================
     로그 (복용 할 일)
  ====================== */
  logItem: {
    padding: 12,
    borderRadius: 10,
    marginVertical: 6,
    backgroundColor: "#f2f2f2"
  },

  logDone: {
    backgroundColor: "#d4f8d4"
  },

  logCanceled: {
    backgroundColor: "#f8d4d4"
  },

  logRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },

  logTime: {
    fontSize: 15,
    fontWeight: "bold"
  },

  logStatus: {
    fontSize: 13,
    fontWeight: "600"
  },

  logSubText: {
    marginTop: 4,
    fontSize: 13,
    color: "#555"
  },

  logActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 8
  },

  manageBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: "#ddd"
  },

  manageBtnDisabled: {
    backgroundColor: "#ccc"
  },

  manageBtnText: {
    fontSize: 13
  },

  manageBtnTextDisabled: {
    color: "#888"
  },

  lockHintText: {
    marginTop: 6,
    fontSize: 12,
    color: "#b00020"
  },

  /* ======================
     모달
  ====================== */
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center"
  },

  modalBox: {
    width: "90%",
    maxHeight: "90%",
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12
  },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10
  },

  label: {
    fontSize: 13,
    fontWeight: "600",
    marginTop: 6,
    marginBottom: 4
  },

  dateBox: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#eee",
    marginBottom: 10
  },

  disabledBox: {
    backgroundColor: "#ddd"
  },

  /* ======================
     라디오
  ====================== */
  sectionTitle: {
    marginTop: 12,
    marginBottom: 6,
    fontSize: 14,
    fontWeight: "bold"
  },

  radioGroup: {
    flexDirection: "row",
    flexWrap: "wrap"
  },

  radioItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 12,
    marginBottom: 6
  },

  radioOuter: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: "#666",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 6
  },

  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#333"
  },

  radioLabel: {
    fontSize: 13
  },

  /* ======================
     요일 선택
  ====================== */
  weekdayRow: {
    flexDirection: "row",
    flexWrap: "wrap"
  },

  weekdayChip: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 14,
    backgroundColor: "#eee",
    marginRight: 6,
    marginBottom: 6
  },

  weekdayChipActive: {
    backgroundColor: "#cce4ff"
  },

  /* ======================
     시간 선택
  ====================== */
  timeBox: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#eee",
    marginBottom: 6
  },

  timeText: {
    fontSize: 14
  },

  /* ======================
     버튼
  ====================== */
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 14
  },

  cancelBtn: {
    padding: 10
  },

  addBtn: {
    padding: 10
  },

  deleteBtnBox: {
    padding: 10
  },

  deleteBtnText: {
    color: "#b00020"
  },

  lockHintText: {
  fontSize: 12,
  color: "#999",
  marginTop: 4
  },
  memberItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderColor: "#eee"
  },
  logDone: {
    backgroundColor: "#e6fffa"
  },
  logCanceled: {
    backgroundColor: "#ffecec"
  }
});
