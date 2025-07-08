import { djangoApi } from "@/api/clients";

/**
 * 📦 Lista eventos de stock asociados a un producto.
 * @param {string|number} productId - ID del producto
 * @param {string} query - Query string (ej: "?page=2&reason=ajuste")
 * @returns {Promise<Object>} - Objeto con eventos y metainformación
 */
export const listStockProductEvents = async (productId, query = "") => {
  if (!productId) {
    throw new Error("Se requiere un productId para consultar los eventos de stock.");
  }

  const endpoint = `/stocks/products/${productId}/stock/events/${query.startsWith("?") ? query : `?${query}`}`.replace(/\/\?$/, "");

  try {
    const response = await djangoApi.get(endpoint);
    return response.data;
  } catch (error) {
    const reason =
      error.response?.data?.detail ||
      error.message ||
      "Error al obtener eventos de stock del producto.";
    console.error(`❌ Error al obtener eventos de stock para producto ${productId}:`, reason);
    throw new Error(reason);
  }
};

export default {
  listStockProductEvents,
};
