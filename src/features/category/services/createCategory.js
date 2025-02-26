import { axiosInstance } from '../../../services/api'; // Asegúrate de que esta es tu instancia configurada de Axios

// Servicio para crear una nueva categoría
export const createCategory = async (categoryData) => {
  try {
    // Enviar solicitud POST para crear una nueva categoría
    const response = await axiosInstance.post('/inventory/categories/', categoryData);
    return response.data; // Devuelve los datos de la categoría creada
  } catch (error) {
    console.error('Error al crear la categoría:', error.response?.data || error.message);
    
    // Manejar errores específicos y retornar un mensaje de error apropiado
    if (error.response && error.response.data) {
      const errorDetail = error.response.data.detail || 'Error al crear la categoría.';
      throw new Error(errorDetail); // Si existe un detalle en el error, lo usamos
    } else {
      throw new Error('Error en la conexión o en el servidor.'); // Error genérico si no hay respuesta
    }
  }
};

export default createCategory;
