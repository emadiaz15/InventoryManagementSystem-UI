import axios from "axios";

// URL base desde variable de entorno Vite
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1";


// Instancia principal de Axios
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

// ----------------------------
// Tokens en sessionStorage
// ----------------------------
const getAccessToken = () => sessionStorage.getItem("accessToken");
const getRefreshToken = () => sessionStorage.getItem("refreshToken");
const getFastapiToken = () => sessionStorage.getItem("fastapiToken");

const clearTokens = () => {
  sessionStorage.removeItem("accessToken");
  sessionStorage.removeItem("refreshToken");
  sessionStorage.removeItem("fastapiToken");
};

// ----------------------------
// Interceptor de REQUEST
// ----------------------------
axiosInstance.interceptors.request.use((config) => {
  const accessToken = getAccessToken();
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// ----------------------------
// Interceptor de RESPONSE
// ----------------------------
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

// ----------------------------
// Exportaciones
// ----------------------------
export default axiosInstance;
export {
  axiosInstance,
  getAccessToken,
  getRefreshToken,
  getFastapiToken,
  clearTokens,
};
