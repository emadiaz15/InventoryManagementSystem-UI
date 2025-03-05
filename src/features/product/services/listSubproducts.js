import { axiosInstance } from "../../../services/api";

export const listSubproducts = async (product_pk) => {
  if (!product_pk) {
    console.error("Error: `product_pk` es undefined. No se puede hacer la solicitud.");
    return { results: [] }; // Retorna un array vacío en lugar de lanzar un error
  }

  try {
    const response = await axiosInstance.get(`/inventory/products/${product_pk}/subproducts/`);
    return response.data;
  } catch (error) {
    console.error("Error al listar subproductos:", error.response?.data || error.message);
    return { results: [], error: error.response?.data?.detail || "Error al listar subproductos" };
  }
};
