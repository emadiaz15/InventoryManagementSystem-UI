

// Método para verificar si el usuario está autenticado
export const isAuthenticated = () => {
    const token = localStorage.getItem('access_token');
    return !!token; // Devuelve true si hay un token, false si no
  };

  export default {
    isAuthenticated
  };