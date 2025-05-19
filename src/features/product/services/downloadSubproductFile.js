import { djangoApi } from "@/services/clients";

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
  const url = `/inventory/products/${productId}/subproducts/${subproductId}/files/${fileId}/download/`;

  try {
    const response = await djangoApi.get(url, {
      responseType: "blob",
      signal,
    });
    return URL.createObjectURL(response.data);
  } catch (err) {
    if (err.name === "AbortError") {
      console.warn(`🚫 Descarga cancelada manualmente: ${fileId}`);
      return null;
    }

    const status = err.response?.status || "???";
    console.error(`❌ (${status}) Error al descargar subproduct file ${fileId}:`, err);
    return null;
  }
};
