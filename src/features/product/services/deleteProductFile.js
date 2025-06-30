import { djangoApi } from "@/api/clients";

/**
 * 🗑️ Elimina un archivo multimedia de un producto.
 * @param {string|number} productId 
 * @param {string|number} fileId 
 */
export const deleteProductFile = async (productId, fileId) => {
  if (!productId || !fileId) {
    throw new Error("Se requieren productId y fileId para eliminar el archivo.");
  }

  try {
    const response = await djangoApi.delete(
      `/inventory/products/${productId}/files/${fileId}/delete/`
    );
    return response.data;
  } catch (error) {
    console.error("❌ Error al eliminar archivo:", error.response?.data || error.message);
    throw new Error(
      error.response?.data?.detail || "No se pudo eliminar el archivo."
    );
  }
};

export default {
  deleteProductFile,
};
