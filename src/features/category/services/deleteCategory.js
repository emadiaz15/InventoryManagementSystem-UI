import { axiosInstance } from '../../../services/api'; // Asegúrate de que esta es tu instancia configurada de Axios

// Servicio para eliminar (soft delete) una categoría
export const deleteCategory = async (categoryId) => {
  try {
    // Se envía una solicitud DELETE, la cual en el backend marca la categoría como inactiva (soft delete)
    const response = await axiosInstance.delete(`/inventory/categories/${categoryId}/`);
    return response.data; // Devuelve los datos de respuesta si es necesario
  } catch (error) {
    console.error('Error al eliminar la categoría:', error.response?.data || error.message);
    
    // Manejo de errores específicos
    if (error.response && error.response.data) {
      throw new Error(error.response.data.detail || 'Error al eliminar la categoría.');
    } else {
      throw new Error('Error en la conexión o en el servidor.');
    }
  }
};

export default deleteCategory;
