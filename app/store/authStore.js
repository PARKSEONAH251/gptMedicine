import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const useAuthStore = create((set) => ({
  token: null,
  user: null,
  loading: true,

  setAuth: async (user, token) => {
    await AsyncStorage.setItem("token", token);
    await AsyncStorage.setItem("user", JSON.stringify(user));
    set({ user, token });
  },

  loadAuth: async () => {
    const token = await AsyncStorage.getItem("token");
    const user = await AsyncStorage.getItem("user");

    if (token && user) {
      set({ token, user: JSON.parse(user), loading: false });
    } else {
      set({ token: null, user: null, loading: false });
    }
  },

  logout: async () => {
    await AsyncStorage.clear();
    set({ token: null, user: null });
  }
}));
