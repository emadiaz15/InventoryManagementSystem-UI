import { axiosInstance } from '../../../services/api'; // Asegúrate de usar tu instancia configurada de Axios

export const listTypes = async (url = '/inventory/types/') => {  // Aquí agregamos el prefijo '/api/v1'
  try {
    const response = await axiosInstance.get(url);  // Axios ya maneja automáticamente el token
    console.log('Respuesta de la API:', response.data);  // Verifica que la respuesta sea correcta

    const activeTypes = response.data.results.filter((type) => type.status);

    return {
      activeTypes,
      nextPage: response.data.next,
      previousPage: response.data.previous,
    };
  } catch (error) {
    console.error('Error al obtener la lista de tipos:', error.response?.data || error.message);
    throw new Error(error.response?.data?.detail || 'Error al obtener la lista de tipos.');
  }
};

export default listTypes;
