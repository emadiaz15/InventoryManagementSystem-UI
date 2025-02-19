// src/services/products/listProducts.js
import api from '../../../services/api'; // Importa la instancia de Axios configurada

// Método para listar todos los productos
const listProducts = async (url = '/inventory/products/') => {
  try {
    const response = await api.get(url);
    console.log('Respuesta de los productos:', response.data); // Depurar la respuesta
    return response.data;
  } catch (error) {
    // Manejo de errores
    if (error.response) {
      console.error('Error al listar los productos:', error.response.data);
      throw new Error(error.response.data?.detail || 'Error desconocido');
    } else if (error.request) {
      console.error('No se recibió respuesta del servidor:', error.request);
      throw new Error('No se recibió respuesta del servidor');
    } else {
      console.error('Error al configurar la solicitud:', error.message);
      throw new Error(error.message);
    }
  }
};

// Exporta el servicio directamente
export default listProducts;
