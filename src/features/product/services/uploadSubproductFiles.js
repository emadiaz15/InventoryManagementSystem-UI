import { axiosInstance } from "../../../services/api";

/**
 * 📤 Sube múltiples archivos a un subproducto (imágenes, PDFs, etc).
 * @param {string|number} productId
 * @param {string|number} subproductId
 * @param {File[]} files
 * @returns {Promise<{ success: boolean, failed: Array<{ file: File, reason: string }> }>}
 */
export const uploadSubproductFiles = async (productId, subproductId, files) => {
  const failed = [];

  for (const file of files) {
    const data = new FormData();
    data.append("file", file);

    try {
      await axiosInstance.post(
        `/inventory/products/${productId}/subproducts/${subproductId}/files/upload/`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
    } catch (error) {
      console.error("❌ Error subiendo archivo:", file.name, error);
      failed.push({
        file,
        reason: error.response?.data?.detail || error.message,
      });
    }
  }

  return {
    success: failed.length === 0,
    failed,
  };
};
