// services/cuttingOrder/getCuttingOrder.js
import api from '../../../services/api';

/**
 * Recupera los detalles de una orden de corte específica
 * GET /api/v1/cutting/orders/{id}/
 *
 * @param {number} orderId - ID de la orden
 */
export const getCuttingOrder = async (orderId) => {
  try {
    const response = await api.get(`/cutting/orders/${orderId}/`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener la orden de corte ${orderId}:`, error.response?.data || error.message);
    throw error;
  }
};
