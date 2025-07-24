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
  // El backend hace `request.FILES.getlist("file")`
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
 * 🔽 Descarga un archivo multimedia de un producto.
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

/**
 * 🗑️ Elimina un archivo multimedia de un producto.
 */
export const deleteProductFile = async (productId, fileId) => {
  if (!productId || !fileId) {
    throw new Error("Se requieren productId y fileId para eliminar.");
  }
  const id = String(productId).trim();
  const fId = String(fileId).trim();
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
 * 🖇️ Enriquecer metadatos con URLs de blob + nombre + tipo de contenido.
 */
export const enrichFilesWithBlobUrls = async ({
  productId,
  rawFiles = [],
  subproductId = null,
  signal = null,
}) => {
  if (!productId || !Array.isArray(rawFiles)) return [];
  const enriched = await Promise.all(
    rawFiles.map(async (f) => {
      const id = f.drive_file_id || f.id;
      if (!id || f.mimeType === "application/vnd.google-apps.folder") return null;
      const url = await fetchProtectedFile(productId, id, subproductId, signal);
      if (!url) return null;
      return {
        ...f,
        id,
        url,                                  // ← aquí el carousel leerá image.url
        filename: f.name || f.filename || "",
        contentType: f.mimeType || f.contentType,
      };
    })
  );
  return enriched.filter(Boolean);
};
