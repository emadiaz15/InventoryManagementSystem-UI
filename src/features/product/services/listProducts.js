import { djangoApi } from "@/api/clients";

/**
 * 📄 Obtiene la lista de productos (paginada).
 * @param {string} url - Endpoint de paginación o URL base (por defecto: /inventory/products/)
 * @returns {Promise<Object>} - Objeto con results, next, previous, etc.
 */
export const listProducts = async (url = "/inventory/products/") => {
  if (typeof url !== "string" || !url.startsWith("/")) {
    throw new Error("❌ URL inválida para listar productos.");
  }

  try {
    const response = await djangoApi.get(url);

    if (response.data && Array.isArray(response.data.results)) {
      response.data.results.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );
    }

    return response.data;
  } catch (error) {
    console.error(
      "❌ Error al obtener productos:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.detail || "Error al obtener la lista de productos."
    );
  }
};

export default {
  listProducts,
};
