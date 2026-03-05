import api from "../api/axios";

export const login = async (username, password) => {
  const response = await api.post("/v1/auth/login", {
    username,
    password
  });

  return response.data;
};