import { axiosInstance } from '../../../services/api'; // Asegúrate de que esta es tu instancia configurada de Axios

// Servicio para crear una nueva categoría
export const createCategory = async (categoryData) => {
  try {
    // Enviar solicitud POST para crear una nueva categoría
    const response = await axiosInstance.post('/inventory/categories/', categoryData);
    return response.data; // Devuelve los datos de la categoría creada
  } catch (error) {
    console.error('Error al crear la categoría:', error.response?.data || error.message);
    
    // Manejar errores específicos
    if (error.response && error.response.data) {
      throw new Error(error.response.data.detail || 'Error al crear la categoría.');
    } else {
      throw new Error('Error en la conexión o en el servidor.');
    }
  }
};

export default createCategory;