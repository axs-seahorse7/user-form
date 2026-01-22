import axios from "axios";

const url = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const api = axios.create({
  baseURL: `${url}`,
  withCredentials: true 
});

export default api;
