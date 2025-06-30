import { djangoApi } from "@/api/clients";

/**
 * Crea un subproducto asociado a un producto principal.
 * @param {number} productId - ID del producto padre.
 * @param {FormData} subproductData - FormData con los campos del subproducto.
 * @param {AbortSignal} [signal] - Optional AbortSignal para abortar la solicitud si es necesario.
 * @returns {Promise<Object>} - Subproducto creado.
 */
export const createSubproduct = async (productId, subproductData, signal = null) => {
  if (!productId || !subproductData || !(subproductData instanceof FormData)) {
    throw new Error("❌ Datos inválidos para crear subproducto.");
  }

  try {
    const response = await djangoApi.post(
      `/inventory/products/${productId}/subproducts/create/`,
      subproductData,
      { signal }
    );
    return response.data;
  } catch (error) {
    // Manejo más robusto del cancelado
    if (error.name === "CanceledError" || error.code === "ERR_CANCELED") {
      console.warn("🚫 Solicitud cancelada.");
      return null;
    }

    console.error("❌ Error al crear subproducto:", error.response?.data || error.message);
    throw new Error(
      error.response?.data?.detail ||
      JSON.stringify(error.response?.data) ||
      "Error al crear subproducto"
    );
  }
};

export default {
  createSubproduct,
};
