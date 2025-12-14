// style/gptResult.styles.js
import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#FFFFFF",
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#666",
  },

  questionBox: {
    padding: 12,
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
    marginBottom: 12,
  },

  questionLabel: {
    fontSize: 12,
    color: "#888",
    marginBottom: 4,
  },

  questionText: {
    fontSize: 15,
    color: "#111",
  },

  badgeBox: {
    marginBottom: 8,
  },

  badge: {
    alignSelf: "flex-start",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    fontSize: 12,
    overflow: "hidden",
  },

  dbBadge: {
    backgroundColor: "#E0F2FE",
    color: "#0369A1",
  },

  guessBadge: {
    backgroundColor: "#FEF3C7",
    color: "#92400E",
  },

  drugNameText: {
    marginBottom: 10,
    fontSize: 14,
    fontWeight: "600",
  },

  resultBox: {
    padding: 14,
    backgroundColor: "#FAFAFA",
    borderRadius: 8,
  },

  resultText: {
    fontSize: 15,
    lineHeight: 22,
    color: "#111",
  },
});
