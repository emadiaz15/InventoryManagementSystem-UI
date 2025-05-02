import { axiosInstance } from '../../../services/api';

/**
 * Sube una imagen a la carpeta de producto en Google Drive (vía FastAPI).
 * @param {string} productId 
 * @param {File} imageFile 
 */
export const uploadProductImage = async (productId, imageFile) => {
  try {
    const formData = new FormData();
    formData.append('file', imageFile);

    const response = await axiosInstance.post(
      `/product/${productId}/upload`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data; // { message, file_id }
  } catch (error) {
    console.error('❌ Error al subir la imagen de producto:', error.response?.data || error.message);
    throw new Error(
      error.response?.data?.detail || 'No se pudo subir la imagen.'
    );
  }
};

export default {
  uploadProductImage,
};
