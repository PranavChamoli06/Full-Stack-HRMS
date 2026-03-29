import axios from "../api/axios";

const BASE_URL = "/admin/pricing";

export const getAllPricing = async () => {
  const res = await axios.get(BASE_URL);
  return res.data;
};

export const createPricing = async (data) => {
  const res = await axios.post(BASE_URL, data);
  return res.data;
};

export const deletePricing = async (id) => {
  await axios.delete(`${BASE_URL}/${id}`);
};