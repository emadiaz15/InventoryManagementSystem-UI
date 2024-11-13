import api from '../../../../services/api'; // Importa la instancia de Axios configurada

// Método para obtener el perfil del usuario logueado
export const getUserProfileLogged = async () => {
  try {
    const response = await api.get('users/profile/');
    return response.data;
  } catch (error) {
    console.error('Error al obtener el perfil del usuario:', error);
    throw error; // Lanzamos el error para manejarlo en el componente
  }
};


export default {
    getUserProfileLogged
  };