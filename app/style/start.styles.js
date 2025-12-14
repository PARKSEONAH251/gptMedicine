import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "space-between",
  },

  /* 패턴 */
  topPattern: {
    width: "100%",
    height: 140,
  },
  bottomPattern: {
    width: "100%",
    height: 160,
  },

  /* 중앙 */
  centerContent: {
    alignItems: "center",
    marginTop: -40,
  },
  logo: {
    width: width * 0.65,
    height: width * 0.65,
    marginBottom: 20,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#555",
  },

  /* 버튼 */
  buttonArea: {
    paddingHorizontal: 24,
    marginBottom: 30,
  },
  primaryButton: {
    backgroundColor: "#000",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 14,
    elevation: 4,
  },
  primaryButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  outlineButton: {
    borderWidth: 1.5,
    borderColor: "#000",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
  },
  outlineButtonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
  },
});
