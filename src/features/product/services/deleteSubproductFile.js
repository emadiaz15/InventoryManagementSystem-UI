import { djangoApi } from "@/api/clients";

/**
 * 🗑️ Elimina un archivo multimedia asociado a un subproducto.
 *
 * @param {string|number} productId - ID del producto padre
 * @param {string|number} subproductId - ID del subproducto
 * @param {string} fileId - ID del archivo (drive_file_id o key)
 * @returns {Promise<void>} - Lanza excepción si falla
 */
export const deleteSubproductFile = async (productId, subproductId, fileId) => {
  if (!productId || !subproductId || !fileId) {
    throw new Error("Faltan parámetros necesarios para eliminar archivo de subproducto.");
  }

  const endpoint = `/inventory/products/${productId}/subproducts/${subproductId}/files/${fileId}/delete/`;

  try {
    await djangoApi.delete(endpoint);
  } catch (error) {
    const reason =
      error.response?.data?.detail ||
      JSON.stringify(error.response?.data) ||
      "Error al eliminar archivo de subproducto.";
    console.error(`❌ (${fileId}) Fallo al eliminar archivo de subproducto:`, reason);
    throw new Error(reason);
  }
};

export default {
  deleteSubproductFile,
};
