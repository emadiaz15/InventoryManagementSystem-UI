import { axiosInstance } from '../../../services/api';

/**
 * Lista todas las órdenes de corte o usa una URL personalizada (paginación, filtros).
 * GET /api/v1/cutting/cutting-orders/
 *
 * @param {string} [url='/cutting/cutting-orders/'] – Ruta relativa al endpoint
 */
export const listCuttingOrders = async (url = '/cutting/cutting-orders/') => {
  try {
    const response = await axiosInstance.get(url);
    return response.data;
  } catch (error) {
    console.error(
      'Error al listar las órdenes de corte:',
      error.response?.data || error.message
    );
    throw error;
  }
};
