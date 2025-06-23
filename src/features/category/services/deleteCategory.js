import { djangoApi } from "@/api/clients";

/**
 * 🗑️ Servicio para eliminar (soft-delete) una categoría por su ID.
 * @param {number|string} categoryId - ID de la categoría a eliminar.
 * @returns {boolean} - true si se eliminó correctamente.
 */
export const deleteCategory = async (categoryId) => {
  try {
    await djangoApi.delete(`/inventory/categories/${categoryId}/`);
    return true;
  } catch (error) {
    console.error("❌ Error al eliminar la categoría:", error.response?.data || error.message);

    const detail = error.response?.data?.detail || "No se pudo eliminar la categoría.";
    throw new Error(detail);
  }
};

export default deleteCategory;
