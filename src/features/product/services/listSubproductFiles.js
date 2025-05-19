import { djangoApi } from "@/services/clients";

/**
 * 📥 Lista los archivos multimedia de un subproducto.
 * @param {string|number} productId
 * @param {string|number} subproductId
 * @returns {Promise<Array>} Lista de archivos vinculados al subproducto
 */
export const listSubproductFiles = async (productId, subproductId) => {
  const url = `/inventory/products/${productId}/subproducts/${subproductId}/files/`;

  try {
    const res = await djangoApi.get(url);
    return res.data.files || [];
  } catch (err) {
    const status = err.response?.status || "???";
    const message = err.response?.data?.detail || "Error desconocido al listar archivos.";
    console.error(`❌ (${status}) listSubproductFiles:`, message);
    throw new Error(message);
  }
};
