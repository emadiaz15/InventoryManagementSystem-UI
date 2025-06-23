import { djangoApi } from "@/api/clients";

/**
 * ✏️ Servicio para actualizar una categoría existente.
 * @param {number|string} categoryId - ID de la categoría.
 * @param {Object} updatedData - Campos a modificar: name, description, status.
 * @returns {Object} - Categoría actualizada.
 */
export const updateCategory = async (categoryId, updatedData) => {
  try {
    // Prepara payload evitando valores null
    const dataToSend = {
      name: updatedData.name || "",
      description: updatedData.description || "",
      status: updatedData.status,
    };

    const response = await djangoApi.put(`/inventory/categories/${categoryId}/`, dataToSend);
    return response.data;
  } catch (error) {
    console.error("❌ Error al actualizar la categoría:", error.response?.data || error.message);

    const detail = error.response?.data?.detail || "No se pudo actualizar la categoría.";
    throw new Error(detail);
  }
};

export default updateCategory;
