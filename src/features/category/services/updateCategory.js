import api from '../../../services/api'; // Asegúrate de que esta es tu instancia configurada de Axios

// Servicio para actualizar una categoría
export const updateCategory = async (categoryId, updatedData) => {
  try {
    // Enviar solicitud PUT para actualizar la categoría por ID
    const response = await api.put(`/inventory/categories/${categoryId}/`, updatedData);
    return response.data; // Devuelve los datos actualizados de la categoría
  } catch (error) {
    console.error('Error al actualizar la categoría:', error.response?.data || error.message);
    
    // Manejar errores específicos
    if (error.response && error.response.data) {
      throw new Error(error.response.data.detail || 'Error al actualizar la categoría.');
    } else {
      throw new Error('Error en la conexión o en el servidor.');
    }
  }
};

export default updateCategory;
