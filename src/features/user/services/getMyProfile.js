import api from '../../../services/api'; // Usa la instancia de Axios configurada

// Método para obtener el perfil del usuario autenticado
export const getMyProfile = async () => {
  try {
    const response = await api.get('users/profile/');
    return response.data; // Devuelve los datos del perfil
  } catch (error) {
    console.error('Error al obtener el perfil del usuario:', error.response?.data || error.message);
    throw new Error(error.response?.data?.detail || 'Error al obtener el perfil del usuario');
  }
};

export default {
    getMyProfile
  };
  