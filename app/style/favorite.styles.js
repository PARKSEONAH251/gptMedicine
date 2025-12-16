// style/favorite.styles.js
import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    padding: 20,
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  header: {
    fontSize: 22,
    fontWeight: "700",
  },

  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F4F4F4",
    justifyContent: "center",
    alignItems: "center",
  },

  addText: {
    fontSize: 22,
    fontWeight: "700",
  },

  box: {
    padding: 18,
    borderRadius: 16,
    backgroundColor: "#F4F4F4",
    marginBottom: 12,
  },

  title: {
    fontSize: 16,
    fontWeight: "600",
  },

  emptyContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },

  emptyWrap: {
    alignItems: "center",
  },

  emptyIconBox: {
    width: 72,
    height: 72,
    borderRadius: 18,
    backgroundColor: "#CFE3FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },

  emptyIconText: {
    fontSize: 36,
    fontWeight: "800",
    color: "#4A7DFF",
  },

  emptyText: {
    textAlign: "center",
    fontSize: 15,
    color: "#555",
    lineHeight: 22,
  },
});
