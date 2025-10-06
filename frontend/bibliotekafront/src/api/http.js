import axios from "axios";
import { jwtDecode } from "jwt-decode";

const http = axios.create({
  baseURL: "http://localhost:8080/api",
});

http.interceptors.request.use(config => {
  const token = localStorage.getItem("token");

  if (token) {
    try {
      const decoded = jwtDecode(token);
      const now = Date.now() / 1000;

      if (decoded.exp && decoded.exp < now) {
        localStorage.removeItem("token");
        localStorage.removeItem("me");
        window.location.reload();
        return config;
      }

      config.headers["Authorization"] = `Bearer ${token}`;
    } catch (e) {
      console.error("JWT decode error:", e);
      localStorage.removeItem("token");
      localStorage.removeItem("me");
      window.location.reload();
    }
  }
  return config;
});

export default http;
