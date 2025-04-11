import { axiosInstance } from "../../../services/api";

export const createSubproduct = async (product_pk, subproductData) => {
  try {
    const response = await axiosInstance.post(
      `/inventory/products/${product_pk}/subproducts/create/`,
      subproductData
    );
    return response.data;
  } catch (error) {
    console.error("Error al crear subproducto:", error.response?.data || error.message);
    throw new Error(
      error.response?.data?.detail ||
      JSON.stringify(error.response?.data) ||
      "Error al crear subproducto"
    );
  }
};
