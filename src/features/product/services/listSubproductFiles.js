import { axiosInstance } from "../../../services/api";

/**
 * 📥 Lista los archivos multimedia de un subproducto.
 * @param {string|number} productId
 * @param {string|number} subproductId
 */
export const listSubproductFiles = async (productId, subproductId) => {
  try {
    const response = await axiosInstance.get(
      `/inventory/products/${productId}/subproducts/${subproductId}/files/`
    );
    // tu vista devuelve { files: [...] }
    return response.data.files;
  } catch (error) {
    console.error("❌ Error al listar archivos de subproducto:", error.response?.data || error.message);
    throw new Error(error.response?.data?.detail || "Error al listar archivos de subproducto");
  }
};
