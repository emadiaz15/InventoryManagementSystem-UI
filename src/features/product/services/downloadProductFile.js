import { fetchProtectedFile } from "../../../services/mediaService";

/**
 * 🔽 Descarga archivo multimedia desde FastAPI y retorna un blob URL.
 * @param {string} productId 
 * @param {string} fileId 
 * @returns {Promise<string|null>} Blob URL o null si falla
 */
export const downloadProductFile = async (productId, fileId) => {
  return await fetchProtectedFile(productId, fileId, 'django');
};
