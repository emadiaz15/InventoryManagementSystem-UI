// src/services/products/listProducts.js
import api from '../../../../services/api'; // Importa la instancia de Axios configurada

// Método para listar todos los productos
export const listProducts = async (url = '/inventory/products/') => {
  try {
    // Usa la URL proporcionada o la URL predeterminada
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    // Manejo de errores detallado
    if (error.response) {
      console.error('Error al listar los productos:', error.response.data);
    } else if (error.request) {
      console.error('No se recibió respuesta del servidor:', error.request);
    } else {
      console.error('Error al configurar la solicitud:', error.message);
    }
    throw error;
  }
};

// Exporta el servicio para facilitar la importación en otros archivos
export default {
  listProducts,
};
