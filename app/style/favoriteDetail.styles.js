// style/favorite.styles.js
import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },

  deleteButton: {
    position: "absolute",
    right: 12,
    top: 12,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#ff4d4f",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 20,
  },

  deleteText: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    lineHeight: 22,
  },

  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 56,
    marginBottom: 12,
  },

  content: {
    fontSize: 15,
    lineHeight: 22,
  },
});
