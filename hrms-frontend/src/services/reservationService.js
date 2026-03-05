import api from "../api/axios";

export const getReservations = async () => {
  const response = await api.get("/reservations");
  return response.data;
};