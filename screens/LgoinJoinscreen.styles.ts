import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  topWave: {
    backgroundColor: "#000",
    height: "20%",
    borderBottomLeftRadius: 80,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 20,
  },
  image: {
    width: 250,
    height: 250,
    marginBottom: 50,
  },
  buttonContainer: {
    width: "80%",
    alignItems: "center",
  },
  loginButton: {
    backgroundColor: "#000",
    width: "100%",
    paddingVertical: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  loginText: {
    color: "#fff",
    fontSize: 18,
    textAlign: "center",
    fontWeight: "bold",
  },
  signupButton: {
    borderWidth: 2,
    borderColor: "#000",
    width: "100%",
    paddingVertical: 15,
    borderRadius: 10,
  },
  signupText: {
    color: "#000",
    fontSize: 18,
    textAlign: "center",
    fontWeight: "bold",
  },
});

export default styles;
