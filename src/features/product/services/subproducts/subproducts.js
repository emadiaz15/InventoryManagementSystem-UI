import { djangoApi } from "@/api/clients";

/**
 * 📄 Lista subproductos con soporte para paginación.
 * @param {number|string} product_pk - ID del producto padre
 * @param {string|null} url - URL paginada (ignora product_pk si se pasa)
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

/**
 * ➕ Crea un subproducto asociado a un producto padre.
 * @param {number|string} productId - ID del producto padre
 * @param {FormData} subproductData - FormData con los campos del subproducto
 * @param {AbortSignal} [signal] - AbortSignal opcional
 * @returns {Promise<Object|null>} - Subproducto creado o null si fue cancelado
 */
export const createSubproduct = async (productId, subproductData, signal = null) => {
  if (!productId || !(subproductData instanceof FormData)) {
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
    if (error.name === "CanceledError" || error.code === "ERR_CANCELED") {
      console.warn("🚫 Solicitud cancelada.");
      return null;
    }

    const detail =
      error.response?.data?.detail ||
      JSON.stringify(error.response?.data) ||
      "Error al crear subproducto.";
    console.error("❌ Error al crear subproducto:", detail);
    throw new Error(detail);
  }
};

/**
 * ✏️ Actualiza un subproducto (FormData soportado).
 * @param {number|string} productId - ID del producto padre
 * @param {number|string} subproductId - ID del subproducto
 * @param {FormData} subproductData - FormData con los campos
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

/**
 * 🗑️ Elimina (soft delete) un subproducto.
 * @param {number|string} product_pk - ID del producto padre
 * @param {number|string} subp_pk - ID del subproducto
 * @returns {Promise<void>} - Lanza error si falla
 */
export const deleteSubproduct = async (product_pk, subp_pk) => {
  if (!product_pk || !subp_pk) {
    throw new Error("Se requieren product_pk y subp_pk para eliminar un subproducto.");
  }

  try {
    await djangoApi.delete(`/inventory/products/${product_pk}/subproducts/${subp_pk}/`);
  } catch (error) {
    const detail =
      error.response?.data?.detail ||
      JSON.stringify(error.response?.data) ||
      "No se pudo eliminar el subproducto.";

    console.error("❌ Error al eliminar subproducto:", detail);
    throw new Error(detail);
  }
};
