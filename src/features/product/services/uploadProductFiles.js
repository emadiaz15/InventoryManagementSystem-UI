import { axiosInstance } from '../../../services/api';

/**
 * 📤 Sube uno o más archivos multimedia (imagen o video) al producto.
 * Maneja errores por archivo individual.
 * @param {string} productId
 * @param {File|File[]} files - Un solo archivo o un array de archivos
 * @returns {Promise<{ success: Array, failed: Array }>}
 */
export const uploadProductFiles = async (productId, files) => {
  const fileList = Array.isArray(files) ? files : [files];
  const success = [];
  const failed = [];

  for (const file of fileList) {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const { data } = await axiosInstance.post(
        `/inventory/products/${productId}/files/upload/`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );

      success.push({ file, data });
    } catch (err) {
      console.error(`❌ Falló ${file.name}:`, err.response?.data || err.message);
      failed.push({ file, error: err.response?.data?.detail || err.message });
    }
  }

  return { success, failed };
};
