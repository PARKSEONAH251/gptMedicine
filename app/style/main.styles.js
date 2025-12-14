import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },

  /* 패턴 */
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

  /* 헤더 */
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

  /* 인사 카드 */
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

  /* 입력 */
  inputBox: {
    backgroundColor: "#F4F4F4",
    padding: 18,
    borderRadius: 16,
    fontSize: 16,
    marginBottom: 16,
  },

  /* 이미지 */
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

  /* 버튼 */
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

  /* 캘린더 */
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
});
