import { axiosInstance } from '../../../services/api'; // Importa la instancia de Axios configurada

// Servicio para crear un nuevo tipo
export const createType = async (typeData) => {
  try {
    console.log("📤 Enviando datos al servidor:", typeData); // 🔍 Verifica qué datos se están enviando

    const response = await axiosInstance.post('/inventory/types/create/', typeData); // ✅ Corrección de la URL

    console.log("✅ Respuesta del servidor:", response.data); // 🔍 Verifica la respuesta de la API

    return response.data;
  } catch (error) {
    console.error('❌ Error al crear el tipo:', error.response?.data || error.message);

    // Captura errores específicos de la API y genera un mensaje adecuado
    if (error.response && error.response.data) {
      throw new Error(error.response.data.detail || 'No se pudo crear el tipo.');
    } else {
      throw new Error('Error en la conexión o en el servidor.');
    }
  }
};

export default createType;
