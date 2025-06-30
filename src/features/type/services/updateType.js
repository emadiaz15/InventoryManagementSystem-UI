import { djangoApi } from "@/api/clients";

/**
 * Servicio para actualizar un tipo.
 * @param {number|string} typeId - ID del tipo.
 * @param {Object} updatedData - Datos a actualizar (name, description, category, status).
 * @returns {Object} - Tipo actualizado.
 * @throws {Error} - En caso de error en la API o validaciones.
 */
export const updateType = async (typeId, updatedData) => {
  try {
    const dataToSend = {
      name: updatedData.name || "",
      description: updatedData.description || "",
    };

    if (updatedData.category) {
      const categoryId = parseInt(updatedData.category, 10);
      if (isNaN(categoryId)) {
        throw new Error("El ID de la categoría no es válido.");
      }
      dataToSend.category = categoryId;
    }

    if (typeof updatedData.status === "boolean") {
      dataToSend.status = updatedData.status;
    }

    const response = await djangoApi.put(`/inventory/types/${typeId}/`, dataToSend);
    return response.data;
  } catch (error) {
    console.error("❌ Error al actualizar el tipo:", error.response?.data || error.message);

    const detail = error.response?.data?.detail;

    if (typeof error.response?.data === "object") {
      const fieldErrors = Object.entries(error.response.data)
        .map(([key, val]) => `${key}: ${Array.isArray(val) ? val.join(", ") : val}`)
        .join("; ");
      throw new Error(fieldErrors || detail || "Error al actualizar el tipo.");
    }

    throw new Error(detail || "Error en la conexión o en el servidor.");
  }
};

export default updateType;
