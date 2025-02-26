import { axiosInstance } from '../../../services/api'; // Asegúrate de que esta es tu instancia configurada de Axios

// Servicio para actualizar una categoría
export const updateCategory = async (categoryId, updatedData) => {
  try {
    // Enviar solicitud PUT para actualizar la categoría por ID
    const response = await axiosInstance.put(`/inventory/categories/${categoryId}/`, updatedData);
    return response.data; // Devuelve los datos actualizados de la categoría
  } catch (error) {
    console.error('Error al actualizar la categoría:', error.response?.data || error.message);
    
    // Manejo de errores específicos:
    if (error.response && error.response.data) {
      const errorDetail = error.response.data.detail || 'Error al actualizar la categoría.';
      throw new Error(errorDetail);
    } else {
      throw new Error('Error en la conexión o en el servidor.');
    }
  }
};

export default updateCategory;
