import { StyleSheet } from "react-native";

export default StyleSheet.create({
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
    padding: 20,
    paddingBottom: 30,
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 10,
  },

  infoBox: {
    backgroundColor: "#F4F4F4",
    borderRadius: 18,
    padding: 20,
    marginBottom: 24,
  },

  infoText: {
    fontSize: 15,
    marginBottom: 4,
  },

  passwordButton: {
    marginTop: 14,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "#000",
    alignItems: "center",
  },

  passwordText: {
    color: "#FFF",
    fontWeight: "700",
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 12,
  },

  noGroupText: {
    color: "#888",
    fontSize: 15,
  },

  groupBox: {
    backgroundColor: "#F4F4F4",
    borderRadius: 18,
    padding: 16,
    marginBottom: 20,
  },

  groupName: {
    fontSize: 17,
    fontWeight: "700",
  },

  groupLeader: {
    fontSize: 13,
    color: "#555",
    marginBottom: 10,
  },

  memberRow: {
    marginBottom: 10,
  },

  memberName: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 6,
  },

  memberButtons: {
    flexDirection: "row",
    marginBottom: 6,
  },

  lockButton: {
    backgroundColor: "#ffffffff",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginRight: 8,
  },

  kickButton: {
    backgroundColor: "#D93025",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
  },

  leaveButton: {
    backgroundColor: "#D93025",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    alignSelf: "flex-start",
  },

  buttonText: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 13,
  },

  inviteButton: {
    marginTop: 10,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "#EDEDED",
    alignItems: "center",
  },

  inviteText: {
    fontWeight: "700",
  },

  groupDeleteButton: {
    marginTop: 8,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: "#FFECEC",
    alignItems: "center",
  },

  groupDeleteText: {
    color: "#B00020",
    fontWeight: "700",
  },

  logoutButton: {
    marginTop: 30,
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: "#000",
    alignItems: "center",
  },

  logoutText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "700",
  },

  /* ===== 기존 Modal 스타일은 그대로 사용 ===== */
});
