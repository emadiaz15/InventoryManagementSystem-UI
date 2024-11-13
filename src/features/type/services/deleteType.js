// src/services/types/deleteType.js
import api from '../../../services/api'; // Asegúrate de usar tu instancia configurada de Axios

// Servicio para "eliminar" un tipo existente mediante un cambio en el estado `is_active`
export const deleteType = async (typeId, isActive) => {
  try {
    const response = await api.patch(`/inventory/types/${typeId}/`, { is_active: isActive });
    return response.data; // Devuelve los datos del tipo con el estado actualizado
  } catch (error) {
    console.error('Error al cambiar el estado del tipo:', error.response?.data || error.message);
    throw new Error(error.response?.data?.detail || 'Error al cambiar el estado del tipo.');
  }
};

export default deleteType;
