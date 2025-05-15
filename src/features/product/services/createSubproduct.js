import { axiosInstance } from "../../../services/api";

export const createSubproduct = async (productId, subproductData) => {
  try {
    const response = await axiosInstance.post(
      `/inventory/products/${productId}/subproducts/create/`,
      subproductData
    );
    return response.data;
  } catch (error) {
    console.error("❌ Error al crear subproducto:", error.response?.data || error.message);
    const detail =
      error.response?.data?.detail ||
      JSON.stringify(error.response?.data) ||
      "Error al crear subproducto";
    throw new Error(detail);
  }
};

export default { createSubproduct };
