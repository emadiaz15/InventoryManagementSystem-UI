import { axiosInstance } from '../../../services/api'; // Usa la instancia configurada

export const listProducts = async (url = '/inventory/products/') => {
  try {
    const response = await axiosInstance.get(url);

    if (response.data && Array.isArray(response.data.results)) {
      // Ordenar los productos por fecha de creación (de más recientes a más antiguos)
      response.data.results.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }

    return response.data; // Retorna el objeto con { results, next, previous }
  } catch (error) {
    console.error('❌ Error al obtener productos:', error.response?.data || error.message);
    throw new Error(error.response?.data?.detail || 'Error al obtener la lista de productos.');
  }
};

export default {
  listProducts,
};
