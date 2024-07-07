import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "https://localhost:3500/api";

const axiosInstace = axios.create({
  baseURL: BASE_URL,
});

const privateAxios = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

export { axiosInstace, privateAxios };
