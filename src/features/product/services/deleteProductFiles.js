import { axiosInstance } from '../../../services/api';

/**
 * 🗑️ Elimina un archivo multimedia de un producto.
 * @param {string} productId 
 * @param {string} fileId 
 */
export const deleteProductFile = async (productId, fileId) => {
  try {
    const response = await axiosInstance.delete(`/inventory/products/${productId}/files/${fileId}/delete/`);
    // Elimina el archivo del estado global
    return response.data;
  } catch (error) {
    console.error('❌ Error al eliminar archivo:', error.response?.data || error.message);
    throw new Error(error.response?.data?.detail || 'No se pudo eliminar el archivo.');
  }
};