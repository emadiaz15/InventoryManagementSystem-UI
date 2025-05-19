import { axiosInstance } from "../../../services/api";

/**
 * Actualiza un subproducto con PUT utilizando FormData y headers explícitos
 * @param {number} productId - ID del producto padre
 * @param {number} subproductId - ID del subproducto
 * @param {FormData} subproductData - Datos en FormData
 */
export const updateSubproduct = async (productId, subproductId, subproductData) => {
  try {
    const response = await axiosInstance.put(
      `/inventory/products/${productId}/subproducts/${subproductId}/`,
      subproductData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("❌ Error al actualizar subproducto:", error.response?.data || error.message);
    const detail = error.response?.data?.detail || "No se pudo actualizar el subproducto.";
    throw new Error(detail);
  }
};

export default { updateSubproduct };
