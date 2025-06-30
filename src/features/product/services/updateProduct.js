import { djangoApi } from "@/api/clients";

/**
 * 📝 Actualiza los datos de un producto.
 *
 * @param {string|number} productId - ID del producto a actualizar
 * @param {Object} productData - Datos del producto (sin archivo)
 * @returns {Promise<Object>} - Producto actualizado
 */
export const updateProduct = async (productId, productData) => {
  if (!productId || typeof productData !== "object") {
    throw new Error("❌ Se requiere un productId y un objeto de datos válido.");
  }

  try {
    // Excluir archivo si viene del formulario
    const { file, ...cleanData } = productData;

    const response = await djangoApi.put(
      `/inventory/products/${productId}/`,
      cleanData
    );

    return response.data;
  } catch (error) {
    const detail =
      error.response?.data?.detail ||
      error.message ||
      "No se pudo actualizar el producto.";
    console.error("❌ Error al actualizar el producto:", detail);
    throw new Error(detail);
  }
};

export default {
  updateProduct,
};
