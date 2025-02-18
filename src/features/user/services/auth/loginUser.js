import api from '../../../../services/api'; // Importa la instancia de Axios configurada

// Método para el login de usuarios
export const loginUser = async (credentials) => {
  try {
    const response = await api.post('/users/login/', credentials);
    console.log('Backend response:', response.data); // Debugging

    // Verificar que la respuesta contenga los tokens antes de almacenarlos
    if (response.data.access_token && response.data.refresh_token) {
      localStorage.setItem('access_token', response.data.access_token);
      localStorage.setItem('refresh_token', response.data.refresh_token);
      return response.data;
    } else {
      throw new Error('Invalid response from server.');
    }
  } catch (error) {
    console.error('Login error:', error.response?.data || error.message);
    throw error; // Lanzamos el error para manejarlo en el componente
  }
};

export default {
  loginUser
};