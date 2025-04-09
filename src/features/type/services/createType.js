import { axiosInstance } from '../../../services/api';

export const createType = async (typeData) => {
  try {
    console.log(" Enviando datos al servidor:", typeData);

    const response = await axiosInstance.post('/inventory/types/create/', typeData);

    console.log("✅ Respuesta del servidor:", response.data);

    return response.data;
  } catch (error) {
    console.error('❌ Error al crear el tipo:', error.response?.data || error.message);

    if (error.response && error.response.data) {
      // Maneja errores específicos de la API y genera un mensaje adecuado
      const errorMessage = error.response.data.detail || 'No se pudo crear el tipo.';
      throw new Error(errorMessage);
    } else {
      // Maneja errores de conexión u otros errores inesperados
      throw new Error('Error en la conexión o en el servidor.');
    }
  }
};

export default createType;