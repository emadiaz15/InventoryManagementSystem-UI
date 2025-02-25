import { axiosInstance } from '../../../services/api'; // Asegúrate de usar tu instancia configurada de Axios

// Servicio para crear un nuevo tipo
export const createType = async (typeData) => {
  try {
    const response = await axiosInstance.post('/inventory/types/', typeData);
    return response.data; // Devuelve los datos del tipo creado
  } catch (error) {
    console.error('Error al crear el tipo:', error.response?.data || error.message);
    throw new Error(error.response?.data?.detail || 'Error al crear el tipo.');
  }
};

export default createType;
