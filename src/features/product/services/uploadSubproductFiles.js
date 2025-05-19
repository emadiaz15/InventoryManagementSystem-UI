import { axiosInstance } from "@/services/api";

/**
 * 📤 Sube múltiples archivos multimedia a un subproducto (imágenes, PDFs, etc).
 *
 * @param {string|number} productId
 * @param {string|number} subproductId
 * @param {File[]} files - Lista de archivos a subir
 * @returns {Promise<{ success: boolean, failed: Array<{ file: File, reason: string }> }>}
 */
export const uploadSubproductFiles = async (productId, subproductId, files) => {
  const failed = [];

  for (const file of files) {
    const formData = new FormData();
    formData.append("file", file);

    try {
      await axiosInstance.post(
        `/inventory/products/${productId}/subproducts/${subproductId}/files/upload/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
    } catch (error) {
      console.error(`❌ Error subiendo "${file.name}":`, error);
      failed.push({
        file,
        reason: error.response?.data?.detail || "Error desconocido al subir archivo",
      });
    }
  }

  return {
    success: failed.length === 0,
    failed,
  };
};
