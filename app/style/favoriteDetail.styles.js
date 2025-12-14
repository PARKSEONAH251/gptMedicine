import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    padding: 20,
  },

  deleteButton: {
    alignSelf: "flex-end",
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FFECEC",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },

  deleteText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#B00020",
  },

  card: {
    backgroundColor: "#F4F4F4",
    borderRadius: 18,
    padding: 20,
  },

  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 14,
  },

  content: {
    fontSize: 15,
    lineHeight: 22,
    color: "#333",
  },
});
