import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080/api/user",
});

export const loginUser = (data) => API.post("/login", data);

export const registerUser = (data) => API.post("/register", data);
export const getProfile = (token) =>
  API.get("/getuser", {
    headers: { Authorization: `Bearer ${token}` },
  });
