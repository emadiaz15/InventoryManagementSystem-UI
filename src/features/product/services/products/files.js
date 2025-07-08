import { djangoApi } from "@/api/clients";
import { fetchProtectedFile } from "@/services/files/fileAccessService";

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
    console.error("❌ Error al listar archivos del producto:", error);
    throw new Error(
      error.response?.data?.detail || "No se pudo listar los archivos del producto."
    );
  }
};

/**
 * 📤 Sube uno o varios archivos multimedia a un producto.
 * @param {string|number} productId - ID del producto
 * @param {FileList|Array<File>} files - Lista de archivos a subir
 * @returns {Promise<Object>} - Resultado del backend
 */
export const uploadFileProduct = async (productId, files) => {
  if (!productId || !files || !files.length) {
    throw new Error("Se requiere productId y al menos un archivo.");
  }

  const formData = new FormData();
  for (const file of files) {
    formData.append("file", file);
  }

  try {
    const response = await djangoApi.post(
      `/inventory/products/${productId}/files/upload/`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return response.data;
  } catch (error) {
    const detail =
      error.response?.data?.detail || error.message || "No se pudo subir el archivo.";
    console.error("❌ Error al subir archivo del producto:", detail);
    throw new Error(detail);
  }
};

/**
 * 🔽 Descarga un archivo multimedia de un producto.
 * @param {string|number} productId - ID del producto
 * @param {string} fileId - ID del archivo
 * @returns {Promise<string|null>} - URL de blob para vista o descarga
 */
export const downloadProductFile = async (productId, fileId) => {
  if (!productId || !fileId) {
    console.warn("⚠️ Faltan parámetros para descargar archivo.");
    return null;
  }

  try {
    return await fetchProtectedFile(productId, fileId);
  } catch (error) {
    console.error(`❌ Error al descargar archivo ${fileId} del producto ${productId}:`, error);
    return null;
  }
};

/**
 * 🗑️ Elimina un archivo multimedia de un producto.
 * @param {string|number} productId - ID del producto
 * @param {string|number} fileId - ID del archivo
 * @returns {Promise<Object>} - Respuesta del backend
 */
export const deleteProductFile = async (productId, fileId) => {
  if (!productId || !fileId) {
    throw new Error("Se requieren productId y fileId para eliminar.");
  }

  try {
    const response = await djangoApi.delete(
      `/inventory/products/${productId}/files/${fileId}/delete/`
    );
    return response.data;
  } catch (error) {
    const detail =
      error.response?.data?.detail || error.message || "No se pudo eliminar el archivo.";
    console.error("❌ Error al eliminar archivo del producto:", detail);
    throw new Error(detail);
  }
};
