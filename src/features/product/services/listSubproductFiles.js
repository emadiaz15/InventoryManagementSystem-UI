import { djangoApi } from "@/api/clients";

/**
 * 📥 Lista los archivos multimedia de un subproducto.
 *
 * @param {string|number} productId - ID del producto padre
 * @param {string|number} subproductId - ID del subproducto
 * @returns {Promise<Array>} Lista de archivos vinculados al subproducto
 */
export const listSubproductFiles = async (productId, subproductId) => {
  if (!productId || !subproductId) {
    throw new Error("Faltan productId o subproductId para listar archivos del subproducto.");
  }

  const url = `/inventory/products/${productId}/subproducts/${subproductId}/files/`;

  try {
    const res = await djangoApi.get(url);
    return res.data?.files || [];
  } catch (err) {
    const status = err.response?.status || "???";
    const message = err.response?.data?.detail || "Error desconocido al listar archivos del subproducto.";
    console.error(`❌ (${status}) listSubproductFiles:`, message);
    throw new Error(message);
  }
};

export default {
  listSubproductFiles,
};
