import { djangoApi } from "@/api/clients";

/**
 * 📄 Lista subproductos con soporte para paginación.
 *
 * @param {number|string} product_pk - ID del producto padre
 * @param {string} [url] - URL paginada (ignora product_pk si se pasa)
 * @returns {Promise<Object>} - Objeto con results, next, previous, etc.
 */
export const listSubproducts = async (product_pk, url = null) => {
  if (!url && !product_pk) {
    throw new Error("❌ Debes proporcionar product_pk o una URL de paginación.");
  }

  const endpoint = url || `/inventory/products/${product_pk}/subproducts/`;

  try {
    const response = await djangoApi.get(endpoint);
    return response.data;
  } catch (error) {
    const detail =
      error.response?.data?.detail ||
      error.message ||
      "Error al listar subproductos.";
    console.error("❌ listSubproducts:", detail);
    throw new Error(detail);
  }
};

export default {
  listSubproducts,
};
