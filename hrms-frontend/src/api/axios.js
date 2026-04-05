import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api/v1",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// RESPONSE INTERCEPTOR
api.interceptors.response.use(
  (response) => response,
  (error) => {

    if (error.response) {

      if (error.response.status === 401) {
        alert("Session expired. Please login again.");
        localStorage.removeItem("token");
        window.location.href = "/";
      }

      if (error.response.status === 403) {
        alert("Access denied");
      }

    } else {
      alert("Server not reachable");
    }

    return Promise.reject(error);
  }
);

export default api;