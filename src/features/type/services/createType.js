import { djangoApi } from "@/api/clients";

/**
 * Servicio para crear un nuevo tipo.
 * @param {Object} typeData - Datos del tipo (name, description, etc.)
 * @returns {Object} - Tipo creado.
 * @throws {Error} - En caso de error en la API o conexión.
 */
export const createType = async (typeData) => {
  try {
    const response = await djangoApi.post('/inventory/types/create/', typeData);
    return response.data;
  } catch (error) {
    console.error('❌ Error al crear el tipo:', error.response?.data || error.message);

    const detail = error.response?.data?.detail || 'No se pudo crear el tipo.';
    throw new Error(detail);
  }
};

export default createType;
