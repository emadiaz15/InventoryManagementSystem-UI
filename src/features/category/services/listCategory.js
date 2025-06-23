import { djangoApi } from "@/api/clients";

/**
 * 📋 Servicio para listar categorías con paginación.
 * @param {string} [url="/inventory/categories/"] - Endpoint completo si se desea paginar.
 * @returns {Object} - { results, next, previous }
 */
export const listCategories = async (url = "/inventory/categories/") => {
  try {
    const response = await djangoApi.get(url);
    return response.data;
  } catch (error) {
    const status = error.response?.status;
    const detail = error.response?.data?.detail;

    // Manejo de errores con mensajes detallados
    if (status === 404) throw new Error("Categorías no encontradas.");
    if (status === 500) throw new Error("Error interno del servidor.");
    if (detail) throw new Error(detail);

    throw new Error("Error al obtener las categorías.");
  }
};

export default listCategories;
