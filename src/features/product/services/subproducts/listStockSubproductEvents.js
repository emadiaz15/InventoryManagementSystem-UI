import { djangoApi } from "@/api/clients";

/**
 * 📊 Lista eventos de stock de un subproducto en un rango de fechas opcional.
 *
 * @param {string|number} productId - ID del producto padre
 * @param {string|number} subproductId - ID del subproducto
 * @param {string|null} startDate - Fecha inicial en formato YYYY-MM-DD
 * @param {string|null} endDate - Fecha final en formato YYYY-MM-DD
 * @returns {Promise<Object>} - Datos de eventos
 */
export const listStockSubproductEvents = async (
  productId,
  subproductId,
  startDate = null,
  endDate = null
) => {
  if (!productId || !subproductId) {
    throw new Error("Faltan productId o subproductId para obtener eventos de stock.");
  }

  const params = {};
  if (startDate) params.start_date = startDate;
  if (endDate) params.end_date = endDate;

  const url = `/stocks/products/${productId}/subproducts/${subproductId}/stock/events/`;

  try {
    const response = await djangoApi.get(url, { params });
    return response.data;
  } catch (error) {
    const detail =
      error.response?.data?.detail ||
      error.message ||
      "Error al listar eventos de stock del subproducto.";
    console.error(`❌ Error listando eventos del subproducto ${subproductId}:`, detail);
    throw new Error(detail);
  }
};

export default {
  listStockSubproductEvents,
};
