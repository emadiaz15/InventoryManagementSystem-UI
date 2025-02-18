import api from '../../../services/api'; // Asegúrate de usar tu instancia configurada de Axios

export const listTypes = async (url = '/inventory/types/') => {  // Aquí agregamos el prefijo '/api/v1'
  try {
    const token = localStorage.getItem('jwtToken'); // Cambia esto si usas otro método de almacenamiento

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,  // Agrega el token al encabezado Authorization
      },
    };

    const response = await api.get(url, config);  // Aquí usas la URL correcta y pasas los headers
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
