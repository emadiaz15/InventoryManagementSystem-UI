import api from '../../../services/api'; // Asegúrate de que esta es tu instancia configurada de Axios

// Servicio para obtener la lista de categorías
export const listCategories = async () => {
  try {
    // Enviar solicitud GET para obtener todas las categorías
    const response = await api.get('/inventory/categories/');
    console.log('Categorias obtenidas:', response.data.results); // Verifica las categorías obtenidas
    return response.data.results; // Devuelve las categorías desde 'results'
  } catch (error) {
    console.error('Error al obtener la lista de categorías:', error.response?.data || error.message);

    // Manejar errores específicos
    if (error.response && error.response.data) {
      throw new Error(error.response.data.detail || 'Error al obtener las categorías.');
    } else {
      throw new Error('Error en la conexión o en el servidor.');
    }
  }
};

export default listCategories;
