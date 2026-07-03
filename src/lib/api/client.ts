import axios from "axios";

const API_BASE_URL = "https://api.yourdomain.com";

export const serverApi = axios.create({
  baseURL: API_BASE_URL,
  timeout: 95000,
  headers: {
    Accept: "application/json",
    "User-Agent": "AniHeist/2.0 (Server)",
  },
});

export const clientApi = axios.create({
  baseURL: "/api/proxy",
  timeout: 95000,
  withCredentials: true,
});

serverApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 429) {
      console.warn("[API] Rate limited");
    }
    return Promise.reject(error);
  }
);

clientApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 429) {
      console.warn("[API] Rate limited");
    }
    return Promise.reject(error);
  }
);
