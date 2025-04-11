import { axiosInstance } from '../../../services/api';

export const listProducts = async (url = '/inventory/products/') => {
  try {
    const response = await axiosInstance.get(url);

    if (response.data && Array.isArray(response.data.results)) {
      // Ordenar por fecha de creación (opcional) de más reciente a más antigua:
      response.data.results.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );
    }
    return response.data; // { results, next, previous, ... }
  } catch (error) {
    console.error('❌ Error al obtener productos:', error.response?.data || error.message);
    throw new Error(
      error.response?.data?.detail || 'Error al obtener la lista de productos.'
    );
  }
};

export default {
  listProducts,
};
