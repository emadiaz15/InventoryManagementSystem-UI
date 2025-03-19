import axios from "axios";

// Obtiene la URL base desde la variable de entorno de Vite
<<<<<<< HEAD
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
=======
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://inventoryapi.up.railway.app/api/v1";
>>>>>>> master

const axiosInstance = axios.create({
  baseURL: API_BASE_URL, // Esto asegura que todas las peticiones se envíen a https://inventoryapi.up.railway.app
});

// Lee el token de sessionStorage
const getAccessToken = () => sessionStorage.getItem("accessToken");

// Limpia el token (para logout)
const clearTokens = () => {
  sessionStorage.removeItem("accessToken");
};

// Interceptor REQUEST: inyecta el token Bearer si existe
axiosInstance.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor RESPONSE: si se recibe 401, limpia los tokens y lanza un evento
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

<<<<<<< HEAD
// Exportación por defecto (para `import api from '...'`)
export default axiosInstance;

// Exportaciones nombradas
=======
// Exportaciones
export default axiosInstance;
>>>>>>> master
export { axiosInstance, getAccessToken, clearTokens };
