import { axiosInstance } from "../../../services/api";

/**
 * 🗑️ Elimina un archivo multimedia de un subproducto.
 * @param {string|number} productId
 * @param {string|number} subproductId
 * @param {string} fileId
 * @returns {Promise<void>}
 */
export const deleteSubproductFile = async (productId, subproductId, fileId) => {
  try {
    await axiosInstance.delete(
      `/inventory/products/${productId}/subproducts/${subproductId}/files/${fileId}/delete/`
    );
  } catch (error) {
    console.error(
      "❌ Error al eliminar archivo de subproducto:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.detail || "Error al eliminar archivo de subproducto"
    );
  }
};
