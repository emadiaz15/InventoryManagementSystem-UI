import { axiosInstance } from '../../../services/api'; // Usa la instancia de Axios configurada

// Método para listar usuarios con soporte para paginación
export const listUsers = async (url = '/users/list/') => {
  try {
    const response = await axiosInstance.get(url); // Aquí pasamos la URL dinámica para manejar la paginación

    // Asegúrate de tener resultados y luego ordena los usuarios por fecha de creación descendente
    if (response.data && Array.isArray(response.data.results)) {
      // Ordenar los usuarios de más nuevos a más antiguos
      response.data.results.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }

    return response.data; // Devolvemos el objeto completo del backend con "results", "next", "previous"
  } catch (error) {
    console.error('Error al listar usuarios:', error.response?.data || error.message);
    throw new Error(error.response?.data?.detail || 'Error al listar usuarios');
  }
};

export default {
  listUsers,
};
