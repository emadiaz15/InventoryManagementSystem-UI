import { djangoApi } from "@/api/clients";
import { fetchProtectedFile } from "@/services/files/fileAccessService";

/**
 * 📥 Lista los archivos multimedia de un subproducto.
 * @param {string|number} productId - ID del producto padre
 * @param {string|number} subproductId - ID del subproducto
 * @returns {Promise<Array>} - Lista de archivos asociados
 */
export const listSubproductFiles = async (productId, subproductId) => {
  if (!productId || !subproductId) {
    throw new Error("Faltan productId o subproductId para listar archivos del subproducto.");
  }

  const url = `/inventory/products/${productId}/subproducts/${subproductId}/files/`;

  try {
    const response = await djangoApi.get(url);
    return response.data?.files || [];
  } catch (error) {
    const status = error.response?.status || "???";
    const message =
      error.response?.data?.detail ||
      "Error desconocido al listar archivos del subproducto.";
    console.error(`❌ (${status}) listSubproductFiles:`, message);
    throw new Error(message);
  }
};

/**
 * 📤 Sube uno o varios archivos a un subproducto.
 * @param {string|number} productId - ID del producto padre
 * @param {string|number} subproductId - ID del subproducto
 * @param {FileList|Array<File>} files - Archivos a subir
 * @returns {Promise<{data: any, status: number}>} - Respuesta de la API
 */
export const uploadSubproductFiles = async (productId, subproductId, files) => {
  if (!productId || !subproductId || !files || files.length === 0) {
    throw new Error(
      "Faltan productId, subproductId o archivos para subir al subproducto."
    );
  }

  const formData = new FormData();
  for (const file of files) {
    formData.append("file", file);
  }

  try {
    const response = await djangoApi.post(
      `/inventory/products/${productId}/subproducts/${subproductId}/files/upload/`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return { data: response.data, status: response.status };
  } catch (error) {
    const detail =
      error.response?.data?.detail ||
      error.message ||
      "No se pudo subir archivos del subproducto.";
    console.error("❌ Error al subir archivos del subproducto:", detail);
    throw new Error(detail);
  }
};

/**
 * 📤 Sube o reemplaza un archivo de un subproducto.
 * @param {string|number} productId
 * @param {string|number} subproductId
 * @param {string} fileId
 * @param {File} newFile
 * @returns {Promise<Object>} - Archivo actualizado
 */
export const uploadSubproductFile = async (
  productId,
  subproductId,
  fileId,
  newFile
) => {
  if (!productId || !subproductId || !fileId || !newFile) {
    throw new Error("❌ Faltan parámetros para actualizar archivo de subproducto.");
  }

  const formData = new FormData();
  formData.append("file", newFile);

  try {
    const response = await djangoApi.put(
      `/inventory/products/${productId}/subproducts/${subproductId}/files/${fileId}/`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return response.data;
  } catch (error) {
    const detail =
      error.response?.data?.detail ||
      JSON.stringify(error.response?.data) ||
      "No se pudo actualizar el archivo del subproducto.";
    console.error(`❌ Error actualizando archivo ${fileId}:`, detail);
    throw new Error(detail);
  }
};

/**
 * 🗑️ Elimina un archivo multimedia de un subproducto.
 * @param {string|number} productId
 * @param {string|number} subproductId
 * @param {string} fileId
 * @returns {Promise<void>} - Lanza excepción si falla
 */
export const deleteSubproductFile = async (
  productId,
  subproductId,
  fileId
) => {
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

/**
 * 🔽 Descarga un archivo multimedia de un subproducto.
 * @param {string|number} productId
 * @param {string|number} subproductId
 * @param {string} fileId
 * @param {AbortSignal|null} signal
 * @returns {Promise<string|null>} - URL de blob o null si falla
 */
export const downloadSubproductFile = async (
  productId,
  subproductId,
  fileId,
  signal = null
) => {
  if (!productId || !subproductId || !fileId) {
    console.warn("⚠️ Faltan parámetros para descargar archivo de subproducto.");
    return null;
  }

  try {
    return await fetchProtectedFile(productId, fileId, subproductId, signal);
  } catch (error) {
    console.error(
      `❌ Error al descargar archivo ${fileId} del subproducto ${subproductId}:`,
      error
    );
    return null;
  }
};
