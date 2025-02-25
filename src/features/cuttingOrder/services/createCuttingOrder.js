// services/cuttingOrder/createCuttingOrder.js
import api from '../../../services/api';

/**
 * Crea una nueva orden de corte
 * POST /api/v1/cutting/orders/create/
 *
 * @param {Object} orderData - Datos para crear la orden
 * (product, customer, cutting_quantity, etc.)
 */
export const createCuttingOrder = async (orderData) => {
  try {
    const response = await api.post('/cutting/orders/create/', orderData);
    return response.data;
  } catch (error) {
    console.error('Error al crear la orden de corte:', error.response?.data || error.message);
    throw error;
  }
};
