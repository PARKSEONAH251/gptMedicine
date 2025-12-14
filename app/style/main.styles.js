import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  headerButton: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4a90e2",
  },
  userGreeting: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 5,
  },
  todayMessage: {
    fontSize: 16,
    marginBottom: 20,
  },
  inputBox: {
    borderWidth: 1,
    borderColor: "#bbb",
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  photoButton: {
    padding: 10,
    backgroundColor: "#eee",
    borderRadius: 8,
  },
  sendButton: {
    padding: 10,
    backgroundColor: "#4a90e2",
    borderRadius: 8,
  },
  sendText: {
    color: "#fff",
    fontWeight: "bold",
  },
  calendarButton: {
    marginTop: 20,
    padding: 12,
    backgroundColor: "#4a90e2",
    borderRadius: 10,
    alignItems: "center",
  },
  calendarButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  imagePreviewBox: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  imagePreview: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 10,
  },
  removeImage: {
    color: "red",
    fontWeight: "bold",
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  modalBox: {
    margin: 30,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 12,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalButtonRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 15,
  },
  acceptButton: {
    padding: 10,
    backgroundColor: "#4CAF50",
    borderRadius: 10,
  },
  declineButton: {
    padding: 10,
    backgroundColor: "#E53935",
    borderRadius: 10,
  },
  acceptText: {
    color: "#fff",
    fontWeight: "bold",
  },
  declineText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
