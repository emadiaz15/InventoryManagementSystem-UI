import { axiosInstance } from '../../../services/api'; // Importa la instancia de Axios configurada

// Método para eliminar un usuario específico (solo accesible para admin)
export const deleteUser = async (userId) => {
  try {
    const response = await axiosInstance.delete(`users/${userId}/`);
    return response.data; // Devuelve los datos del usuario eliminado
  } catch (error) {
    console.error(`Error al eliminar el usuario ${userId}:`, error.response?.data || error.message);
    throw new Error(error.response?.data?.detail || `Error al eliminar el usuario ${userId}`);
  }
};

export default {
  deleteUser
};
