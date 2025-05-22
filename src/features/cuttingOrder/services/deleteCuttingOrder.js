import { axiosInstance } from '../../../services/api';

/**
 * Elimina suavemente una orden de corte específica
 * DELETE /api/v1/cutting/cutting-orders/{orderId}/
 *
 * @param {number} orderId
 */
export const deleteCuttingOrder = async (orderId) => {
  try {
    // Devuelve '204 No Content' en caso de éxito
    const response = await axiosInstance.delete(
      `/cutting/cutting-orders/${orderId}/`
    );
    return response.data;
  } catch (error) {
    console.error(
      `Error al eliminar la orden de corte ${orderId}:`,
      error.response?.data || error.message
    );
    throw error;
  }
};
