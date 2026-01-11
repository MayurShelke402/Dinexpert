import axios from "axios";

const API_URL = "http://localhost:8080/api/tables";

export const getAllTables = () =>
  axios.get(API_URL).then((res) => res.data);

export const createTable = (data) =>
  axios.post(API_URL, data).then((res) => res.data);

export const updateTable = (id, data) =>
  axios.put(`${API_URL}/${id}`, data).then((res) => res.data);

export const deleteTable = (id) =>
  axios.delete(`${API_URL}/${id}`).then((res) => res.data);

export const getTableQRCode = (id) =>
  axios.get(`${API_URL}/${id}/qrcode`, { responseType: "blob" });

export const getTable = (id) =>
  axios.get(`${API_URL}/${id}`).then((res) => res.data);

export const startTableSession = (qrCodeValue) =>
  axios.post(`${API_URL}/tables/start-session`, { qrCodeValue })
    .then((res) => res.data);

// Gets table info by QR Code
export const getTableByQRCode = (code) =>
  axios.get(`${API_URL}/qrcode/${code}`)
    .then((res) => res.data);