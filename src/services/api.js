import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

// Lee el token de sessionStorage
const getAccessToken = () => sessionStorage.getItem("accessToken");

// Limpia el token si se desea (también se hace en logout)
const clearTokens = () => {
  sessionStorage.removeItem("accessToken");
};

// Interceptor REQUEST: inyecta el Bearer token, si existe
axiosInstance.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor RESPONSE: si hay un 401, limpia tokens y lanza evento
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearTokens();
      window.dispatchEvent(new Event("sessionExpired"));
    }
    return Promise.reject(error);
  }
);

export {
  axiosInstance,
  getAccessToken,
  clearTokens
};
