import { axiosInstance } from '../../../services/api';

/**
 * 📥 Lista los archivos multimedia de un producto.
 * @param {string} productId 
 */
export const listProductFiles = async (productId) => {
    try {
      const response = await axiosInstance.get(`/inventory/products/${productId}/files/`);
      return response.data.files; // Array de archivos
    } catch (error) {
      console.error('❌ Error al listar archivos:', error.response?.data || error.message);
      throw new Error(error.response?.data?.detail || 'No se pudo listar los archivos.');
    }
  };
  