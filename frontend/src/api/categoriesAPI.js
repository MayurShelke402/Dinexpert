import axios from "axios";

const API = "http://localhost:8080/api/categories"; // update to match backend

export const getAllCategories = async () => {
  const res = await axios.get(`${API}/getall`);
  return res.data;
};

export const createCategory = async ({ name, image }) => {
  const formData = new FormData();
  formData.append("name", name);
  if (image) formData.append("image", image);

  const res = await axios.post(API, formData);
  return res.data;
};

export const deleteCategory = async (id) => {
  const res = await axios.delete(`${API}/${id}`);
  return res.data;
};
