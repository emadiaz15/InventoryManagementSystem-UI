// src/features/type/services/listType.js (Versión que devuelve datos crudos)
import { axiosInstance } from "/src/services/api.js"; // Ajusta ruta si es necesario

export const listTypes = async (url = '/inventory/types/') => {
  try {
    const response = await axiosInstance.get(url);
    console.log('Respuesta de la API (listTypes - raw data):', response.data);
    // Devuelve directamente la data de la respuesta (results, next, previous, count)
    return response.data;
  } catch (error) {
    console.error('Error en listTypes (raw data):', error.response?.data || error.message);
    if (error.response) {
      if (error.response.status === 404) throw new Error('Tipos no encontrados.');
      if (error.response.status === 500) throw new Error('Error interno del servidor.');
      throw new Error(error.response.data?.detail || 'Error al obtener la lista de tipos.');
    } else if (error.request) {
      throw new Error('No se pudo conectar con el servidor.');
    } else {
      throw new Error('Error en la configuración de la solicitud.');
    }
  }
};
// No necesita export default