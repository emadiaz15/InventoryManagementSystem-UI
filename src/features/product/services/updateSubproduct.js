import { djangoApi } from "@/api/clients";

/**
 * ✏️ Actualiza un subproducto (incluye soporte para archivos con FormData).
 *
 * @param {number|string} productId - ID del producto padre
 * @param {number|string} subproductId - ID del subproducto
 * @param {FormData} subproductData - FormData con los campos del subproducto
 * @returns {Promise<Object>} - Subproducto actualizado
 */
export const updateSubproduct = async (productId, subproductId, subproductData) => {
  if (!productId || !subproductId || !(subproductData instanceof FormData)) {
    throw new Error("❌ Parámetros inválidos para actualizar subproducto.");
  }

  try {
    const response = await djangoApi.put(
      `/inventory/products/${productId}/subproducts/${subproductId}/`,
      subproductData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    const detail =
      error.response?.data?.detail ||
      JSON.stringify(error.response?.data) ||
      "No se pudo actualizar el subproducto.";
    console.error("❌ Error al actualizar subproducto:", detail);
    throw new Error(detail);
  }
};

export default {
  updateSubproduct,
};
