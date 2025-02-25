import { axiosInstance } from '../../../services/api'; // Asegúrate de que esta es tu instancia configurada de Axios

// Servicio para eliminar una categoría
export const deleteCategory = async (categoryId) => {
  try {
    // Enviar solicitud DELETE para eliminar la categoría con el ID proporcionado
    const response = await axiosInstance.delete(`/inventory/categories/${categoryId}/`);
    return response.data; // Devuelve los datos de respuesta si es necesario
  } catch (error) {
    console.error('Error al eliminar la categoría:', error.response?.data || error.message);
    
    // Manejar errores específicos
    if (error.response && error.response.data) {
      throw new Error(error.response.data.detail || 'Error al eliminar la categoría.');
    } else {
      throw new Error('Error en la conexión o en el servidor.');
    }
  }
};

export default deleteCategory;
