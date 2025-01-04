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
    console.error('Error en la configuración de la solicitud:', error);
    return Promise.reject(error);
  }
);

// Interceptor de respuestas: Manejar la renovación del token JWT
api.interceptors.response.use(
  (response) => {
    // Respuesta exitosa
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Manejo de errores 401 por expiración del token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Evitar bucle infinito
      const refreshToken = localStorage.getItem('refresh_token');

      if (refreshToken) {
        try {
          // Intentar renovar el token de acceso
          const { data } = await axios.post(`${API_BASE_URL}users/refresh/`, {
            refresh: refreshToken,
          });

          // Guardar el nuevo token de acceso
          localStorage.setItem('access_token', data.access);

          // Actualizar el header de autorización
          originalRequest.headers.Authorization = `Bearer ${data.access}`;

          // Reintentar la solicitud original
          return api(originalRequest);
        } catch (refreshError) {
          console.warn('Refresh token inválido o expirado:', refreshError);
          handleSessionExpiration();
        }
      } else {
        console.warn('No se encontró refresh token. Redirigiendo al login.');
        handleSessionExpiration();
      }
    }

    return Promise.reject(error); // Otros errores
  }
);

// Función para manejar expiración de sesión
const handleSessionExpiration = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  window.location.href = '/login'; // Redirigir al login
};

export default api;
