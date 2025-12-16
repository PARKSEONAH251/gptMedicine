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
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 20,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  myPageButton: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: "#F4F4F4",
  },
  myPageText: {
    fontSize: 16,
    fontWeight: "700",
  },

  favoriteNavButton: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "#000",
  },
  favoriteNavText: {
    color: "#FFF",
    fontSize: 15,
    fontWeight: "700",
  },

  greetingCard: {
    backgroundColor: "#F4F4F4",
    borderRadius: 18,
    padding: 20,
    marginBottom: 24,
  },
  userGreeting: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 6,
  },
  todayMessage: {
    fontSize: 16,
    color: "#555",
  },

  inputBox: {
    backgroundColor: "#F4F4F4",
    padding: 18,
    borderRadius: 16,
    fontSize: 16,
    marginBottom: 16,
  },

  imagePreviewBox: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  imagePreview: {
    width: 70,
    height: 70,
    borderRadius: 12,
    marginRight: 12,
  },
  removeImage: {
    color: "#D93025",
    fontSize: 15,
    fontWeight: "700",
  },

  buttonRow: {
    flexDirection: "row",
    marginBottom: 24,
  },
  photoButton: {
    flex: 1,
    marginRight: 10,
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: "#EDEDED",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonIcon: {
    width: 26,
    height: 26,
    marginBottom: 6,
  },
  photoText: {
    fontSize: 15,
    fontWeight: "600",
  },
  sendButton: {
    flex: 1,
    marginLeft: 10,
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
  sendText: {
    color: "#FFF",
    fontSize: 15,
    fontWeight: "700",
  },

  calendarButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
    borderRadius: 18,
    backgroundColor: "#000",
  },
  calendarIcon: {
    width: 22,
    height: 22,
    marginRight: 8,
  },
  calendarButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "700",
  },

  modalBackground: {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0,0,0,0.45)",
  justifyContent: "center",
  alignItems: "center",
  },

  modalBox: {
    width: "90%",
    maxHeight: "85%",  
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    alignSelf: "center",
  },

  inviteBox: {
    backgroundColor: "#F4F4F4",
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginBottom: 12,
  },

  inviteName: {
    fontSize: 16,
    fontWeight: "800",
    color: "#111",
    marginBottom: 10,
  },

  inviteButtonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  acceptButton: {
    flex: 1,
    marginRight: 8,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },

  acceptText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "800",
  },

  declineButton: {
    flex: 1,
    marginLeft: 8,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "#E0E0E0",
    alignItems: "center",
    justifyContent: "center",
  },

  declineText: {
    color: "#111",
    fontSize: 14,
    fontWeight: "800",
  },

  closeButton: {
    marginTop: 10,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: "#EDEDED",
    alignItems: "center",
    justifyContent: "center",
  },

  closeText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#111",
  },
});
