import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api/v1",
});

// REQUEST INTERCEPTOR
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  // ✅ Only attach token for NON-public APIs
  if (token && !config.url.includes("/public")) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// RESPONSE INTERCEPTOR
api.interceptors.response.use(
  (response) => response,
  (error) => {

    if (error.response) {

      const isPublicApi = error.config.url.includes("/public");

      // ✅ Only handle auth errors for PRIVATE APIs
      if (error.response.status === 401 && !isPublicApi) {
        alert("Session expired. Please login again.");
        localStorage.removeItem("token");
        window.location.href = "/";
      }

      if (error.response.status === 403 && !isPublicApi) {
        alert("Access denied");
      }

    } else {
      alert("Server not reachable");
    }

    return Promise.reject(error);
  }
);

export default api;