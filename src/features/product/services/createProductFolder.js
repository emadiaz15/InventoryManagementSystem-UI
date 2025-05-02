import { axiosInstance } from '../../../services/api';

/**
 * Crea la carpeta de imágenes de producto en Google Drive (vía FastAPI).
 * @param {string} productId 
 */
export const createProductFolder = async (productId) => {
  try {
    const response = await axiosInstance.post(`/product/${productId}/create-folder`);
    return response.data; // { folder_id: ... }
  } catch (error) {
    console.error('❌ Error al crear la carpeta de producto:', error.response?.data || error.message);
    throw new Error(
      error.response?.data?.detail || 'No se pudo crear la carpeta de imágenes.'
    );
  }
};

export default {
  createProductFolder,
};
