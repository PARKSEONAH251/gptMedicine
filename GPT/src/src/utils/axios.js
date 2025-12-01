// /src/utils/axios.js
import axios from "axios";

const instance = axios.create({
    baseURL: "http://localhost:404",
});

// 요청 인터셉터: Authorization 자동 추가
instance.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers["Authorization"] = `Bearer ${token}`;
    return config;
});

export default instance;
