import axios from "axios";

const API_URL = "http://localhost:8080/api/hotels";

export const getAllHotels = async () => {
  const response = await axios.get(`${API_URL}/getall`);
  return response.data;
};

export const getHotelById = async (id) => {
  const response = await axios.get(`${API_URL}/id/${id}`);
  return response.data;
};
export const getHotelBySlug = async (slug) => {
  const response = await axios.get(`${API_URL}/${slug}`);
  return response.data;
};