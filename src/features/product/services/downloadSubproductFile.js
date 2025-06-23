import { fetchProtectedFile } from "@/services/files/downloadService";

/**
 * 📥 Descarga un archivo multimedia de un subproducto desde Django.
 * Devuelve una URL de blob para su previsualización.
 *
 * @param {string|number} productId
 * @param {string|number} subproductId
 * @param {string} fileId
 * @param {AbortSignal|null} signal
 * @returns {Promise<string|null>} URL del blob o null si falla
 */
export const downloadSubproductFile = async (
  productId,
  subproductId,
  fileId,
  signal = null
) => {
  if (!productId || !subproductId || !fileId) {
    console.warn("⚠️ Faltan parámetros para descargar archivo de subproducto.");
    return null;
  }

  try {
    return await fetchProtectedFile(productId, fileId, subproductId, signal);
  } catch (error) {
    console.error(
      `❌ Error al descargar archivo ${fileId} del subproducto ${subproductId}:`,
      error
    );
    return null;
  }
};

export default {
  downloadSubproductFile,
};
