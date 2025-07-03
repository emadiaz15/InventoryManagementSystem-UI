import { djangoApi } from "@/api/clients";

/**
 * 📥 Lista los archivos multimedia de un producto.
 * @param {string|number} productId - ID del producto
 * @returns {Promise<Array>} - Array de archivos asociados
 */
export const listProductFiles = async (productId) => {
  if (!productId) {
    throw new Error("Se requiere un productId para listar archivos.");
  }

  try {
    const response = await djangoApi.get(`/inventory/products/${productId}/files/`);
    
    const files = response.data?.files;
    
    if (!Array.isArray(files)) {
      throw new Error("La API no devolvió un listado de archivos válido.");
    }

    return files;
  } catch (error) {
    console.error(
      "❌ Error al listar archivos del producto:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.detail || "No se pudo listar los archivos del producto."
    );
  }
};

export default {
  listProductFiles,
};
