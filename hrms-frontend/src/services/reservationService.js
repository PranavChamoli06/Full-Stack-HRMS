import api from "../api/axios";

export const getReservations = async () => {
  const response = await api.get("/v1/reservations");
  return response.data;
};

export const createReservation = async (reservationData) => {
  const response = await api.post("/v1/reservations", reservationData);
  return response.data;
};