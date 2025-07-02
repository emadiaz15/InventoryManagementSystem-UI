import axios from "axios";

// ─────────────────────────────────────────────────────────────
// 🌐 Base URL de API (Django)
// ─────────────────────────────────────────────────────────────
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1";

// ─────────────────────────────────────────────────────────────
// 🧠 Helpers para tokens
// ─────────────────────────────────────────────────────────────
const getAccessToken = () => sessionStorage.getItem("accessToken");
const getRefreshToken = () => sessionStorage.getItem("refreshToken");

const clearTokens = () => {
  sessionStorage.removeItem("accessToken");
  sessionStorage.removeItem("refreshToken");
  window.dispatchEvent(new Event("sessionExpired"));
};

// ─────────────────────────────────────────────────────────────
// 🔧 Factory de clientes con configuración fija (Django)
// ─────────────────────────────────────────────────────────────
const createApiClient = () => {
  const instance = axios.create({ baseURL: API_BASE_URL });

  instance.interceptors.request.use((config) => {
    const token = getAccessToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  instance.interceptors.response.use(
    (res) => res,
    (err) => {
      if (err.response?.status === 401) clearTokens();
      return Promise.reject(err);
    }
  );

  return instance;
};

// ─────────────────────────────────────────────────────────────
// 🎯 Cliente principal para Django
// ─────────────────────────────────────────────────────────────
export const djangoApi = createApiClient();

// ─────────────────────────────────────────────────────────────
// 📤 Exportación utilitaria
// ─────────────────────────────────────────────────────────────
export {
  djangoApi as axiosInstance,
  getAccessToken,
  getRefreshToken,
  clearTokens,
};
