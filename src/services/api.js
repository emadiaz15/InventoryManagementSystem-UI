import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1";

// 🔁 Configuración dinámica: usar token de FastAPI si está seteado
const config = {
  useFastapi: false, // <- puedes activar esto desde otros lugares
};

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

// ─── TOKENS ─────────────────────────────────────
const getAccessToken = () => sessionStorage.getItem("accessToken");
const getRefreshToken = () => sessionStorage.getItem("refreshToken");
const getFastapiToken = () => sessionStorage.getItem("fastapiToken");

const getActiveToken = () =>
  config.useFastapi ? getFastapiToken() : getAccessToken();

const clearTokens = () => {
  sessionStorage.removeItem("accessToken");
  sessionStorage.removeItem("refreshToken");
  sessionStorage.removeItem("fastapiToken");
};

// ─── INTERCEPTORS ───────────────────────────────
axiosInstance.interceptors.request.use((request) => {
  const token = getActiveToken();
  if (token) {
    request.headers.Authorization = `Bearer ${token}`;
  }
  return request;
});

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

// ─── EXPORTS ─────────────────────────────────────
export default axiosInstance;
export {
  axiosInstance,
  getAccessToken,
  getFastapiToken,
  getRefreshToken,
  clearTokens,
  config as tokenConfig,
};
