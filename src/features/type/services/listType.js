import { djangoApi } from "@/api/clients";

/**
 * Servicio para obtener la lista de tipos.
 * @param {string} [url="/inventory/types/"] - URL con paginación o filtros.
 * @returns {Object} - { results, next, previous, count }
 * @throws {Error} - En caso de error en la API o conexión.
 */
export const listTypes = async (url = "/inventory/types/") => {
  try {
    const response = await djangoApi.get(url);
    return response.data;
  } catch (error) {
    console.error("❌ Error al obtener tipos:", error.response?.data || error.message);

    const status = error.response?.status;
    const detail = error.response?.data?.detail;

    if (status === 404) throw new Error("Tipos no encontrados.");
    if (status === 500) throw new Error("Error interno del servidor.");
    if (detail) throw new Error(detail);

    throw new Error("Error al obtener la lista de tipos.");
  }
};

/**
 * Obtiene los tipos pertenecientes a una categoría.
 *
 * @param {number|string} categoryId - ID de la categoría
 * @returns {Object} - { results, next, previous, count }
 */
export const listTypesByCategory = async (categoryId) => {
  const url = `/inventory/types/?limit=1000&status=true&category=${categoryId}`;
  return listTypes(url);
};

