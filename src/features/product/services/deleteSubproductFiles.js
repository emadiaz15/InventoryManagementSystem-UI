import { axiosInstance } from "@/services/api";

/**
 * 🗑️ Elimina un archivo multimedia asociado a un subproducto.
 *
 * @param {string|number} productId - ID del producto padre
 * @param {string|number} subproductId - ID del subproducto
 * @param {string} fileId - ID del archivo (drive_file_id)
 * @returns {Promise<void>} - Lanza excepción si falla
 */
export const deleteSubproductFile = async (productId, subproductId, fileId) => {
  const endpoint = `/inventory/products/${productId}/subproducts/${subproductId}/files/${fileId}/delete/`;

  try {
    await axiosInstance.delete(endpoint);
  } catch (error) {
    const reason = error.response?.data?.detail || "Error al eliminar archivo de subproducto";
    console.error(`❌ (${fileId}) Fallo al eliminar archivo:`, reason);
    throw new Error(reason);
  }
};
