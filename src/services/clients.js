import axios from "axios";

// ─────────────────────────────────────────────────────────────
// 🌐 Base URL de API (Django/FastAPI)
// ─────────────────────────────────────────────────────────────
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1";

// ─────────────────────────────────────────────────────────────
// 🧠 Helpers para tokens
// ─────────────────────────────────────────────────────────────
const getAccessToken = () => sessionStorage.getItem("accessToken");
const getRefreshToken = () => sessionStorage.getItem("refreshToken");
const getFastapiToken = () => sessionStorage.getItem("fastapiToken");

const clearTokens = () => {
  sessionStorage.removeItem("accessToken");
  sessionStorage.removeItem("refreshToken");
  sessionStorage.removeItem("fastapiToken");
  window.dispatchEvent(new Event("sessionExpired"));
};

// ─────────────────────────────────────────────────────────────
// 🧬 Config global para modo dinámico (opt-in desde app)
// ─────────────────────────────────────────────────────────────
export const tokenConfig = {
  useFastapi: false,
};

// Devuelve el token adecuado dinámicamente
const getActiveToken = () =>
  tokenConfig.useFastapi ? getFastapiToken() : getAccessToken();

// ─────────────────────────────────────────────────────────────
// 🔧 Factory de clientes con configuración dinámica
// ─────────────────────────────────────────────────────────────
const createApiClient = (getTokenFn) => {
  const instance = axios.create({ baseURL: API_BASE_URL });

  instance.interceptors.request.use((config) => {
    const token = getTokenFn();
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
// 🎯 Clientes especializados
// ─────────────────────────────────────────────────────────────
export const djangoApi = createApiClient(getAccessToken);
export const fastapiApi = createApiClient(getFastapiToken);

// Default: cliente genérico con comportamiento dinámico
export const axiosInstance = createApiClient(getActiveToken);

// ─────────────────────────────────────────────────────────────
// 📤 Exportación utilitaria
// ─────────────────────────────────────────────────────────────
export {
  getAccessToken,
  getFastapiToken,
  getRefreshToken,
  clearTokens,
};
