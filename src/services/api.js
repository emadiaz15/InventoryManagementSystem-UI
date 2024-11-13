import axios from 'axios';

// Crear una instancia de Axios
const api = axios.create({
  baseURL: 'http://localhost:8000/api/v1/', // Base URL del backend (ajusta según tu backend)
  timeout: 10000,  // Aumentar tiempo límite de las solicitudes a 10 segundos
});

// Interceptor de solicitudes: Adjunta el token JWT si está disponible
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token'); // Recuperar token del local storage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Agregar el token al header de la solicitud
    }
    return config;
  },
  (error) => {
    // Aquí puedes manejar errores de configuración
    return Promise.reject(error);
  }
);

// Interceptor de respuestas: Manejar la renovación del token JWT
api.interceptors.response.use(
  (response) => {
    // Si la respuesta es correcta, la retornamos
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Si el token de acceso ha expirado, intentar renovarlo
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;  // Evitar un bucle infinito de reintentos
      const refreshToken = localStorage.getItem('refresh_token');
      
      if (refreshToken) {
        try {
          // Intentar renovar el token de acceso usando el refresh token
          const { data } = await axios.post('http://localhost:8000/api/v1/users/refresh/', {
            refresh: refreshToken,
          });
          
          // Guardar el nuevo token de acceso en localStorage
          localStorage.setItem('access_token', data.access);
          
          // Actualizar el header de autorización en la solicitud original
          originalRequest.headers.Authorization = `Bearer ${data.access}`;
          
          // Reintentar la solicitud original con el nuevo token
          return api(originalRequest);
        } catch (refreshError) {
          console.log('El token de refresh ha expirado o es inválido. Redirigiendo al login.');
          
          // Eliminar los tokens si han expirado
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          
          // Opcional: Redirigir al usuario al login si el refresh token falla
          window.location.href = '/login';
        }
      } else {
        console.log('No se encontró el token de refresh. Redirigiendo al login.');
        window.location.href = '/login';
      }
    }

    // Manejar otros tipos de errores (500, 403, etc.)
    return Promise.reject(error);
  }
);

export default api;
