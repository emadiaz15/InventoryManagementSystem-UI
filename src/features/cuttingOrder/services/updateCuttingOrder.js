// services/cuttingOrder/updateCuttingOrder.js
import api from '../../../services/api';

/**
 * Actualiza una orden de corte específica
 * PUT o PATCH /api/v1/cutting/orders/{id}/
 *
 * @param {number} orderId - ID de la orden
 * @param {Object} updateData - Campos a actualizar
 */
export const updateCuttingOrder = async (orderId, updateData, method = 'PUT') => {
  try {
    // El endpoint admite PUT o PATCH. Aquí, por defecto, usamos PUT:
    const response = await api({
      url: `/cutting/orders/${orderId}/`,
      method,
      data: updateData
    });
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar la orden de corte ${orderId}:`, error.response?.data || error.message);
    throw error;
  }
};
