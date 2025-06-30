import { djangoApi } from "@/api/clients";

/**
 * Servicio para eliminar (soft delete) un tipo.
 * @param {number|string} typeId - ID del tipo a eliminar.
 * @returns {boolean} - true si la eliminación fue exitosa.
 * @throws {Error} - En caso de error en la API o conexión.
 */
export const deleteType = async (typeId) => {
  try {
    await djangoApi.delete(`/inventory/types/${typeId}/`);
    return true;
  } catch (error) {
    console.error("❌ Error al eliminar el tipo:", error.response?.data || error.message);

    const detail = error.response?.data?.detail || "No se pudo eliminar el tipo.";
    throw new Error(detail);
  }
};

export default deleteType;
