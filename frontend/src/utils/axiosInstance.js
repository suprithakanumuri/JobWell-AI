import axios from "axios";
import { BASE_URL } from "./apiPaths";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30000, // Reduced from 80s to 30s
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true // For cookies if using them
});

axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("token");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === "ECONNABORTED") {
      error.message = "Request timeout. Please check your connection.";
    } else if (!error.response) {
      error.message = "Network error. Please check your internet connection.";
    } else if (error.response.status === 401) {
      window.location.href = "/login";
    } else if (error.response.status === 500) {
      error.message = error.response.data.message || "Server error occurred";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;