import { djangoApi } from "@/api/clients";
import { fetchProtectedFile } from "@/services/files/fileAccessService";

/**
 * 📥 Lista los archivos multimedia de un producto.
 */
export const listProductFiles = async (productId) => {
  if (!productId) {
    throw new Error("Se requiere un productId para listar archivos.");
  }
  try {
    const response = await djangoApi.get(
      `/inventory/products/${productId}/files/`
    );
    const files = response.data?.files;
    if (!Array.isArray(files)) {
      throw new Error("La API no devolvió un listado de archivos válido.");
    }
    return files;
  } catch (error) {
    console.error("❌ Error al listar archivos del producto:", error);
    const message =
      error.response?.data?.detail ||
      "No se pudo listar los archivos del producto.";
    throw new Error(message);
  }
};

/**
 * 📤 Sube uno o varios archivos multimedia a un producto.
 */
export const uploadFileProduct = async (productId, files) => {
  if (!productId || !files?.length) {
    throw new Error("Se requiere productId y al menos un archivo.");
  }
  const id = String(productId).trim();
  const formData = new FormData();
  files.forEach((file) => formData.append("file", file));
  try {
    const response = await djangoApi.post(
      `/inventory/products/${id}/files/upload/`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return response.data;
  } catch (error) {
    console.error("❌ Error al subir archivo del producto:", error);
    const message =
      error.response?.data?.detail ||
      "No se pudo subir el archivo.";
    throw new Error(message);
  }
};

/**
 * 🗑️ Elimina un archivo multimedia de un producto.
 */
export const deleteProductFile = async (productId, fileId) => {
  if (!productId || !fileId) {
    throw new Error("Se requieren productId y fileId para eliminar.");
  }
  const id = String(productId).trim();
  // encodea el fileId para que "products/43/xyz.png" se convierta en "products%2F43%2Fxyz.png"
  const fId = encodeURIComponent(String(fileId).trim());
  try {
    const response = await djangoApi.delete(
      `/inventory/products/${id}/files/${fId}/delete/`
    );
    return response.data;
  } catch (error) {
    console.error("❌ Error al eliminar archivo del producto:", error);
    const message =
      error.response?.data?.detail ||
      "No se pudo eliminar el archivo.";
    throw new Error(message);
  }
};

/**
 * 🔽 Descarga protegido y convierte a blob URL.
 */
export const downloadProductFile = async (
  productId,
  fileId,
  signal = null
) => {
  if (!productId || !fileId) {
    console.warn("⚠️ Faltan parámetros para descargar archivo.");
    return null;
  }
  try {
    return await fetchProtectedFile(productId, fileId, null, signal);
  } catch (error) {
    console.error(
      `❌ Error al descargar archivo ${fileId} del producto ${productId}:`,
      error
    );
    return null;
  }
};
