import api from "../api/axios";

export const getReservations = async (page = 0, size = 10) => {
  const response = await api.get(`/reservations?page=${page}&size=${size}`);
  return response.data;
};

export const createReservation = async (reservationData) => {
  const response = await api.post("/reservations", reservationData);
  return response.data;
};

export const updateReservation = async (id, reservationData) => {
  const response = await api.put(`/reservations/${id}`, reservationData);
  return response.data;
};

export const cancelReservation = async (id) => {
  const response = await api.patch(`/reservations/${id}/status?status=CANCELLED`);
  return response.data;
};

// PRICE PREVIEW
export const previewPrice = async (data) => {
  return api.get("/reservations/preview-price", {
    params: {
      roomNumber: data.roomNumber,
      checkInDate: data.checkInDate,
      checkOutDate: data.checkOutDate
    }
  });
};

// AVAILABILITY CHECK
export const checkAvailability = async (data) => {
  return api.get("/reservations/availability", {
    params: {
      roomNumber: data.roomNumber,
      checkInDate: data.checkInDate,
      checkOutDate: data.checkOutDate
    }
  });
};