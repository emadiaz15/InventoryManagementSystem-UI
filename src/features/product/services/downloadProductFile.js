import { fetchProtectedFile } from "@/services/files/downloadService";

/**
 * 🔽 Descarga archivo multimedia desde Django y retorna un blob URL.
 *
 * @param {string|number} productId - ID del producto
 * @param {string} fileId - ID del archivo
 * @returns {Promise<string|null>} - Blob URL o null si falla
 */
export const downloadProductFile = async (productId, fileId) => {
  if (!productId || !fileId) {
    console.warn("⚠️ Faltan parámetros para descargar archivo de producto.");
    return null;
  }

  try {
    return await fetchProtectedFile(productId, fileId);
  } catch (error) {
    console.error(`❌ Error al descargar archivo ${fileId} de producto ${productId}:`, error);
    return null;
  }
};

export default {
  downloadProductFile,
};
