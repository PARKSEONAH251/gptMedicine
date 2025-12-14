// app/api/authApi.js
import ApiService from "./apiService";

export default {
  checkId: async (userID) => {
    return ApiService.get(`/api/auth/check-id?userID=${userID}`);
  },

  signup: async (payload) => {
    return ApiService.post("/api/auth/signup", payload);
  }
};
