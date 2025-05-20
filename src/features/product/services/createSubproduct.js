import { axiosInstance } from "../../../services/api";

/**
 * Crea un subproducto asociado a un producto principal.
 * @param {number} productId - ID del producto padre.
 * @param {FormData} subproductData - FormData con los campos del subproducto.
 * @param {AbortSignal} [signal] - Optional AbortSignal para abortar la solicitud si es necesario.
 * @returns {Promise<Object>} - Subproducto creado.
 */
export const createSubproduct = async (productId, subproductData, signal = null) => {
  try {
    const response = await axiosInstance.post(
      `/inventory/products/${productId}/subproducts/create/`,
      subproductData,
      { signal }
    );
    return response.data;
  } catch (error) {
    if (error.name === "CanceledError") {
      console.warn("🚫 Request cancelado.");
      return;
    }
    throw new Error(
      error.response?.data?.detail ||
      JSON.stringify(error.response?.data) ||
      "Error al crear subproducto"
    );
  }
};
