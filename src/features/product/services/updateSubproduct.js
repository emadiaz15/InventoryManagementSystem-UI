import { axiosInstance } from "../../../services/api";

export const updateSubproduct = async (productId, subproductId, subproductData) => {
  try {
    const response = await axiosInstance.put(
      `/inventory/products/${productId}/subproducts/${subproductId}/`,
      subproductData
    );
    return response.data;
  } catch (error) {
    console.error("❌ Error al actualizar subproducto:", error.response?.data || error.message);
    const detail = error.response?.data?.detail || "No se pudo actualizar el subproducto.";
    throw new Error(detail);
  }
};

export default { updateSubproduct };
