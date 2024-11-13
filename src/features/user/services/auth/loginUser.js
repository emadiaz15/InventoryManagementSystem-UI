import api from '../../../../services/api'; // Importa la instancia de Axios configurada

// Método para el login de usuarios
export const loginUser = async (credentials) => {
  try {
    const response = await api.post('users/login/', credentials);
    
    // Almacenar los tokens en el localStorage
    if (response.data.access) {
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
    }

    return response.data; // Devolver la respuesta para manejarla en el frontend
  } catch (error) {
    console.error('Error en el login:', error);
    throw error; // Lanzamos el error para manejarlo en el componente
  }
};

export default {
  loginUser
};
