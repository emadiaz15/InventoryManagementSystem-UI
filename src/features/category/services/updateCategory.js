import { axiosInstance } from '../../../services/api';

// Servicio para actualizar el status de una categoría
export const updateCategory = async (categoryId, updatedData) => {
  try {
    // Enviar solo el campo `status` (no `name`, `description`, etc.)
    const response = await axiosInstance.put(`/inventory/categories/${categoryId}/`, updatedData);
    return response.data; // Devuelve los datos actualizados de la categoría
  } catch (error) {
    console.error('Error al actualizar la categoría:', error.response?.data || error.message);
    
    // Manejo de errores específicos:
    if (error.response && error.response.data) {
      const errorDetail = error.response.data.detail || 'Error al actualizar la categoría.';
      throw new Error(errorDetail); // Si existe un detalle en el error, lo usamos
    } else {
      throw new Error('Error en la conexión o en el servidor.'); // Error genérico si no hay respuesta
    }
  }
};

export default updateCategory;
