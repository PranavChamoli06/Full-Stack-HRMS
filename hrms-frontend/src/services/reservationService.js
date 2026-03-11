import api from "../api/axios";

export const getReservations = async (page = 0, size = 10) => {
  const response = await api.get(`/v1/reservations?page=${page}&size=${size}`);
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