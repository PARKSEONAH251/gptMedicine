// style/gptResult.styles.js
import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  content: {
    padding: 20,
    paddingBottom: 120,
  },
  
  card: {
    backgroundColor: "#F4F4F4",
    borderRadius: 18,
    padding: 20,
    marginBottom: 16,
  },

  answerCard: {
    backgroundColor: "#FAFAFA",
  },

  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#777",
    marginBottom: 8,
  },

  questionText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111",
  },

  answerText: {
    fontSize: 15,
    lineHeight: 24,
    color: "#222",
  },

  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: "#FFF",
    borderTopWidth: 1,
    borderColor: "#EEE",
  },

  favoriteButton: {
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: "#000",
    alignItems: "center",
  },

  favoriteText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "700",
  },
});
