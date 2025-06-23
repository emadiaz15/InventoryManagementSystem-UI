import { djangoApi } from "@/api/clients";

/**
 * 🆕 Servicio para crear una nueva categoría.
 * @param {Object} categoryData - Datos del formulario (nombre, descripción, estado).
 * @returns {Object} - Objeto de categoría creada.
 */
export const createCategory = async (categoryData) => {
  try {
    const response = await djangoApi.post("/inventory/categories/create/", categoryData);
    return response.data;
  } catch (error) {
    console.error("❌ Error al crear la categoría:", error.response?.data || error.message);

    // Captura detalle específico o usa mensaje genérico
    const detail = error.response?.data?.detail || "No se pudo crear la categoría.";
    throw new Error(detail);
  }
};

export default createCategory;
