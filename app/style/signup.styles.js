import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    paddingHorizontal: 24,
  },

  topPattern: {
    width: "100%",
    height: 130,
    marginBottom: 30,
  },

  title: {
    fontSize: 26,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 30,
    color: "#000",
  },

  input: {
    backgroundColor: "#F4F4F4",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 10,
    fontSize: 15,
    marginBottom: 14,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
  },

  flexInput: {
    flex: 1,
  },

  checkButton: {
    marginLeft: 10,
    paddingVertical: 14,
    paddingHorizontal: 14,
    backgroundColor: "#000",
    borderRadius: 10,
  },

  checkText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "700",
  },

  successText: {
    color: "#1E8E3E",
    fontSize: 13,
    marginBottom: 10,
  },

  errorText: {
    color: "#D93025",
    fontSize: 13,
    marginBottom: 10,
  },

  submitButton: {
    marginTop: 20,
    paddingVertical: 16,
    backgroundColor: "#000",
    borderRadius: 14,
    alignItems: "center",
    elevation: 3,
  },

  submitText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "700",
  },
});
