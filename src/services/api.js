import axios from 'axios';

// Base URL configurable desde variables de entorno (Vite utiliza `import.meta.env`)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1/';

// Crear una instancia de Axios
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 segundos de límite para la solicitud
});

// Interceptor de solicitudes: Adjunta el token JWT si está disponible
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token'); // Recuperar token del local storage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Adjuntar token a las solicitudes
    }
    return config;
  },
  (error) => {
    console.error("Request configuration error:", error);
    return Promise.reject(error);
  }
);

// Variables para evitar múltiples renovaciones de token simultáneamente
let isRefreshing = false;
let subscribers = [];

// Función para notificar a las solicitudes en espera cuando se renueve el token
const onRefreshed = (token) => {
  subscribers.forEach((callback) => callback(token));
  subscribers = [];
};

// Función para agregar suscriptores a la cola de espera
const addSubscriber = (callback) => {
  subscribers.push(callback);
};

// Interceptor de respuestas: Manejar la renovación del token JWT
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Manejo de errores 401 por expiración del token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Evitar bucle infinito

      if (isRefreshing) {
        return new Promise((resolve) => {
          addSubscriber((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(api(originalRequest));
          });
        });
      }

      isRefreshing = true;
      const refreshToken = localStorage.getItem('refresh_token');

      if (refreshToken) {
        try {
          // Intentar renovar el token de acceso
          const { data } = await axios.post(`${API_BASE_URL}users/refresh/`, {
            refresh: refreshToken,
          });

          // Guardar el nuevo token de acceso
          localStorage.setItem('access_token', data.access);
          api.defaults.headers.Authorization = `Bearer ${data.access}`;
          
          // Notificar a las solicitudes en espera
          onRefreshed(data.access);
          isRefreshing = false;
          return api(originalRequest);
        } catch (refreshError) {
          console.warn("Refresh token invalid or expired:", refreshError);
          handleSessionExpiration();
          isRefreshing = false;
        }
      } else {
        console.warn("No refresh token found. Redirecting to login.");
        handleSessionExpiration();
      }
    }

    return Promise.reject(error); // Otros errores
  }
);

// Función para manejar expiración de sesión sin redirección forzada
const handleSessionExpiration = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  window.dispatchEvent(new Event('sessionExpired')); // Enviar un evento global
};

export default api;
