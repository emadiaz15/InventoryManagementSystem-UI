// services/cuttingOrder/deleteCuttingOrder.js
import api from '../../../services/api';

/**
 * Elimina suavemente una orden de corte específica
 * DELETE /api/v1/cutting/orders/{id}/
 *
 * @param {number} orderId
 */
export const deleteCuttingOrder = async (orderId) => {
  try {
    // Devuelve '204' en caso de éxito
    const response = await api.delete(`/cutting/orders/${orderId}/`);
    return response.data; 
  } catch (error) {
    console.error(`Error al eliminar la orden de corte ${orderId}:`, error.response?.data || error.message);
    throw error;
  }
};
