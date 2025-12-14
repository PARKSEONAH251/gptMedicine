import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#ffffff",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
  },
  infoBox: {
    padding: 15,
    backgroundColor: "#f4f4f4",
    borderRadius: 10,
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  noGroup: {
    color: "#888",
  },
  groupBox: {
    padding: 15,
    backgroundColor: "#f1f9ff",
    borderRadius: 10,
  },
  manager: {
    fontWeight: "bold",
    marginBottom: 10,
  },
  memberCard: {
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 10,
  },
  memberName: {
    fontSize: 16,
    marginBottom: 5,
  },
  memberButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  lockButton: {
    padding: 6,
    backgroundColor: "#4a90e2",
    borderRadius: 8,
  },
  lockText: {
    color: "#fff",
  },
  kickButton: {
    padding: 6,
    backgroundColor: "#e53935",
    borderRadius: 8,
  },
  kickText: {
    color: "#fff",
  },
  leaveButton: {
    marginTop: 10,
    padding: 6,
    backgroundColor: "#e53935",
    borderRadius: 8,
  },
  leaveText: {
    color: "#fff",
    textAlign: "center",
  },
  logoutButton: {
    marginTop: 30,
    padding: 12,
    backgroundColor: "#333",
    borderRadius: 10,
    alignItems: "center",
  },
  logoutText: {
    color: "#fff",
    fontWeight: "bold",
  },

  modalBackground: {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "rgba(0,0,0,0.5)",
  },

  modalBox: {
    backgroundColor: "#fff",
    padding: 20,
    width: "80%",
    borderRadius: 12,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },

  input: {
    borderWidth: 1,
    borderColor: "#aaa",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },

  modalButtonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },

  saveButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginRight: 5,
  },

  cancelButton: {
    backgroundColor: "#f44336",
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginLeft: 5,
  },

  inviteButton: {
  backgroundColor: "#eef",
  padding: 8,
  borderRadius: 6,
  marginTop: 10,
  },
  
  inviteText: {
    color: "#336",
    fontWeight: "bold",
  },


  saveText: { textAlign: "center", color: "#fff", fontWeight: "bold" },
  cancelText: { textAlign: "center", color: "#fff", fontWeight: "bold" },

});
