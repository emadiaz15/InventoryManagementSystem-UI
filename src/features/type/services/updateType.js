import { axiosInstance } from '../../../services/api'; // Asegúrate de usar tu instancia configurada de Axios

// Servicio para actualizar un tipo existente
export const updateType = async (typeId, updatedData) => {
  try {
    const response = await axiosInstance.put(`inventory/types/${typeId}/`, updatedData);
    return response.data; // Devuelve los datos del tipo actualizado
  } catch (error) {
    console.error('Error al actualizar el tipo:', error.response?.data || error.message);
    throw new Error(error.response?.data?.detail || 'Error al actualizar el tipo.');
  }
};

export default updateType;
