import api from '../../../services/api'; // Usa la instancia de Axios configurada

// Método para crear un nuevo producto
export const createProduct = async (productData) => {
    try {
      const response = await api.post('/inventory/products/', productData); // El token se agrega automáticamente por Axios
      return response.data; // Devuelve los datos del producto creado
    } catch (error) {
      console.error('Error al crear el producto:', error.response?.data || error.message);
      throw error; // Lanzamos el error para manejarlo en el componente
    }
  };

// Exportamos todo el servicio para facilitar la importación en otros archivos
export default {
  createProduct
};