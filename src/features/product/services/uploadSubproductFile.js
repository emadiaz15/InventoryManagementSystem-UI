import { djangoApi } from "@/api/clients";

/**
 * 📝 Actualiza un archivo multimedia de un subproducto.
 *
 * @param {string|number} productId - ID del producto padre
 * @param {string|number} subproductId - ID del subproducto
 * @param {string} fileId - ID del archivo (por ejemplo, key o drive_file_id)
 * @param {File} newFile - Nuevo archivo para reemplazar
 * @returns {Promise<Object>} - Respuesta del servidor con datos del archivo actualizado
 */
export const uploadSubproductFile = async (productId, subproductId, fileId, newFile) => {
  if (!productId || !subproductId || !fileId || !newFile) {
    throw new Error("❌ Faltan parámetros para actualizar el archivo del subproducto.");
  }

  const formData = new FormData();
  formData.append("file", newFile);

  try {
    const response = await djangoApi.put(
      `/inventory/products/${productId}/subproducts/${subproductId}/files/${fileId}/`,
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
      JSON.stringify(error.response?.data) ||
      "No se pudo actualizar el archivo del subproducto.";
    console.error(`❌ Error actualizando archivo ${fileId} del subproducto:`, detail);
    throw new Error(detail);
  }
};

export default {
  uploadSubproductFile,
};
