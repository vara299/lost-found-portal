// services/api.js — Axios configuration

import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Attach token to every request automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// If token expired, log user out
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Auth
export const registerUser = (data) => API.post("/auth/register", data);
export const loginUser = (data) => API.post("/auth/login", data);
export const getUserProfile = () => API.get("/auth/profile");

// Lost Items
export const createLostItem = (data) => API.post("/lost", data);
export const getAllLostItems = (query = "") => API.get(`/lost${query}`);
export const getLostItemById = (id) => API.get(`/lost/${id}`);
export const deleteLostItem = (id) => API.delete(`/lost/${id}`);

// Found Items
export const createFoundItem = (data) => API.post("/found", data);
export const getAllFoundItems = (query = "") => API.get(`/found${query}`);
export const getFoundItemById = (id) => API.get(`/found/${id}`);
export const deleteFoundItem = (id) => API.delete(`/found/${id}`);

export default API;