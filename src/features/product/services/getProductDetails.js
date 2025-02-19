import api from '../../../services/api'; // Usa la instancia de Axios configurada

// Método para obtener los detalles de un producto específico
export const getProductDetails = async (productId) => {
    try {
      const response = await api.get(`/inventory/products/${productId}/`); // El token se agrega automáticamente
      return response.data; // Devuelve los detalles del producto
    } catch (error) {
      console.error(`Error al obtener detalles del producto ${productId}:`, error.response?.data || error.message);
      throw error; // Lanzamos el error para manejarlo en el componente
    }
  };

// Exportamos todo el servicio para facilitar la importación en otros archivos
export default {
  getProductDetails
};