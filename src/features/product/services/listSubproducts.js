import { axiosInstance } from "../../../services/api";

/**
 * Lista subproductos con paginación.
 * @param {number} product_pk - ID del producto padre.
 * @param {string} [url] - URL a usar. Si se pasa, ignora product_pk.
 */
export const listSubproducts = async (product_pk, url) => {
  const endpoint = url || `/inventory/products/${product_pk}/subproducts/`;

  if (!product_pk && !url) {
    console.error("Error: falta product_pk y url.");
    return { results: [] };
  }

  try {
    const response = await axiosInstance.get(endpoint);
    return response.data;
  } catch (error) {
    console.error("Error al listar subproductos:", error.response?.data || error.message);
    return {
      results: [],
      error: error.response?.data?.detail || "Error al listar subproductos",
    };
  }
};
