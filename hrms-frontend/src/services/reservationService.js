import api from "../api/axios";

export const getReservations = async () => {
  const response = await api.get("/v1/reservations");
  return response.data;
};

export const createReservation = async (reservationData) => {
  const response = await api.post("/v1/reservations", reservationData);
  return response.data;
};

export const updateReservation = async (id, reservationData) => {
  const response = await api.put(`/v1/reservations/${id}`, reservationData);
  return response.data;
};

export const cancelReservation = async (id) => {
  const response = await api.patch(`/v1/reservations/${id}/status?status=CANCELLED`);
  return response.data;
};