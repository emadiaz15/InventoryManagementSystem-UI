// src/features/cuttingOrder/services/listCuttingOrders.js
import api from '../../../services/api';

export const listCuttingOrders = async (url = '/cutting/orders/') => {
  try {
    // url puede ser la paginación (ej. 'http://localhost:8000/api/v1/cutting/orders/?page=2')
    // si tu baseURL = 'http://localhost:8000/api/v1', concatenará => http://localhost:8000/api/v1 + /cutting/orders/
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    console.error('Error al listar las órdenes de corte:', error.response?.data || error.message);
    throw error;
  }
};
