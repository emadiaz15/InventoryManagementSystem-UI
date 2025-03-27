import api from '../../../services/api';

export const listCuttingOrders = async (url = '/cutting/cutting-orders/') => {
  try {
    // La URL por defecto es "/cutting/cutting-orders/". 
    // Si se pasa otra URL (por ejemplo, para paginación) se utilizará esa.
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    console.error('Error al listar las órdenes de corte:', error.response?.data || error.message);
    throw error;
  }
};
