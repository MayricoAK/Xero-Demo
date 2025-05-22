import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3051";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // Handle authentication errors
    if (
      error.response?.status === 401 &&
      error.response?.data?.message === "Authentication expired"
    ) {
      window.location.href = "/login";
    }
    return Promise.reject(error.response?.data || error);
  }
);

export { API_BASE_URL };
export default api;
