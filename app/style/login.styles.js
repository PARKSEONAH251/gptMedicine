import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    alignItems: "center",
    paddingHorizontal: 24,
  },

  topPattern: {
    width: "100%",
    height: 140,
    marginBottom: 40,
  },

  title: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 30,
    color: "#000",
  },

  input: {
    width: "100%",
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: "#F4F4F4",
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 16,
  },

  loginButton: {
    width: "100%",
    paddingVertical: 16,
    backgroundColor: "#000",
    borderRadius: 14,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 16,
    elevation: 3,
  },

  loginButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "700",
  },

  kakaoButton: {
    width: "100%",
    paddingVertical: 14,
    backgroundColor: "#FEE500",
    borderRadius: 14,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },

  kakaoIcon: {
    width: 20,
    height: 20,
    marginRight: 8,
  },

  kakaoButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#3C1E1E",
  },

  linkButton: {
    marginTop: 10,
  },

  linkText: {
    fontSize: 15,
    color: "#555",
  },
});
