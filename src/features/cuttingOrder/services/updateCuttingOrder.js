import { axiosInstance } from '../../../services/api';

/**
 * Actualiza una orden de corte específica
 * PUT o PATCH /api/v1/cutting/cutting-orders/{orderId}/
 *
 * @param {number} orderId      - ID de la orden
 * @param {Object} updateData   - Campos a actualizar
 * @param {string} [method='PUT'] - HTTP method: 'PUT' o 'PATCH'
 */
export const updateCuttingOrder = async (orderId, updateData, method = 'PUT') => {
  try {
    const response = await axiosInstance({
      url: `/cutting/cutting-orders/${orderId}/`,
      method,
      data: updateData
    });
    return response.data;
  } catch (error) {
    console.error(
      `Error al actualizar la orden de corte ${orderId}:`,
      error.response?.data || error.message
    );
    throw error;
  }
};
