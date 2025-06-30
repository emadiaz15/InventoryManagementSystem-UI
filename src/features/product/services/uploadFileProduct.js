import { djangoApi } from "@/api/clients";

/**
 * 📤 Sube un archivo multimedia vinculado a un producto.
 *
 * @param {string|number} productId - ID del producto
 * @param {File} file - Objeto File del input
 * @returns {Promise<Object>} - Datos del archivo subido
 */
export const uploadFileProduct = async (productId, file) => {
  if (!productId || !file) {
    throw new Error("Se requiere productId y archivo para subir.");
  }

  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await djangoApi.post(
      `/inventory/products/${productId}/files/`,
      formData,
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
      error.message ||
      "No se pudo subir el archivo del producto.";
    console.error("❌ Error al subir archivo del producto:", detail);
    throw new Error(detail);
  }
};

export default {
  uploadFileProduct,
};
