import axios from "axios";

const API_URL = "http://localhost:8080/api/menu";

export const getMenuItems = (params) =>{
  
  return axios.get(`${API_URL}/all`, { params }).then((res) => res.data);
}

export const getMenuItemBySlug = (slug) =>
  axios.get(`${API_URL}/item/${slug}`).then((res) => res.data);


export const createMenuItem = (data) =>{
  console.log("data",data);
  
  axios.post(API_URL, data).then((res) => res.data);
}

export const updateMenuItem = (id, data) =>
  axios.put(`${API_URL}/update/${id}`, data).then((res) => res.data);

export const deleteMenuItem = (id) =>
  axios.delete(`${API_URL}/delete/${id}`).then((res) => res.data);

export const bulkDeleteMenuItems = (ids) =>
  axios.post(`${API_URL}/bulk-delete`, { ids }).then((res) => res.data);

export const bulkUpdateAvailability = (ids, isAvailable) =>
  axios.post(`${API_URL}/bulk-update-availability`, { ids, isAvailable }).then((res) => res.data);

export const getMenuGroupedByCategory = () =>
  axios.get(`${API_URL}/grouped`).then((res) => res.data);

export const searchMenu = async (query) => {
  const res = await fetch(`${API_URL}/search?q=${encodeURIComponent(query)}`);
  if (!res.ok) throw new Error("Search failed");
  return await res.json();
};
