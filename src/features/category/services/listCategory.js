import { axiosInstance } from '../../../services/api'; // Asegúrate de que esta es tu instancia configurada de Axios

// Servicio para obtener la lista de categorías con paginación
export const listCategories = async (url = '/inventory/categories/') => {
  try {
    const response = await axiosInstance.get(url);
    console.log('Categorias obtenidas:', response.data.results); // Verifica las categorías obtenidas
    return response.data; // Devuelve los datos completos con 'results', 'next', 'previous', etc.
  } catch (error) {
    if (error.response) {
      // El servidor respondió con un código de estado fuera del rango 2xx
      console.error('Error de la API:', error.response.data);
      if (error.response.status === 404) {
        throw new Error('Categorías no encontradas.');
      } else if (error.response.status === 500) {
        throw new Error('Error interno del servidor.');
      } else {
        throw new Error(error.response.data.detail || 'Error al obtener las categorías.');
      }
    } else if (error.request) {
      // La solicitud fue hecha, pero no se recibió respuesta
      console.error('Error de conexión:', error.request);
      throw new Error('No se pudo conectar con el servidor.');
    } else {
      // Algo sucedió en la configuración de la solicitud que desencadenó un error
      console.error('Error de configuración:', error.message);
      throw new Error('Error en la configuración de la solicitud.');
    }
  }
};

export default listCategories;