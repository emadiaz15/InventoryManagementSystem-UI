// src/services/cuttingService.js
import api from '../../../services/api'; // Usa la instancia de axios que ya configuraste

// Método para listar todas las órdenes de corte
export const listCuttingOrders = async () => {
  try {
    const response = await api.get('/cutting/orders/');
    return response.data;
  } catch (error) {
    console.error('Error al listar las órdenes de corte:', error.response?.data || error.message);
    throw error; // Lanzamos el error para manejarlo en el componente
  }
};

// Método para crear una nueva orden de corte
export const createCuttingOrder = async (orderData) => {
  try {
    const response = await api.post('/cutting/orders/', orderData);
    return response.data; // Devuelve los datos de la orden creada
  } catch (error) {
    console.error('Error al crear la orden de corte:', error.response?.data || error.message);
    throw error; // Lanzamos el error para manejarlo en el componente
  }
};

// Método para obtener los detalles de una orden de corte específica
export const getCuttingOrderDetails = async (orderId) => {
  try {
    const response = await api.get(`/cutting/orders/${orderId}/`);
    return response.data; // Devuelve los detalles de la orden
  } catch (error) {
    console.error(`Error al obtener detalles de la orden de corte ${orderId}:`, error.response?.data || error.message);
    throw error; // Lanzamos el error para manejarlo en el componente
  }
};

// Método para actualizar una orden de corte existente
export const updateCuttingOrder = async (orderId, updateData) => {
  try {
    const response = await api.put(`/cutting/orders/${orderId}/`, updateData);
    return response.data; // Devuelve los datos actualizados de la orden
  } catch (error) {
    console.error(`Error al actualizar la orden de corte ${orderId}:`, error.response?.data || error.message);
    throw error; // Lanzamos el error para manejarlo en el componente
  }
};

// Método para eliminar una orden de corte
export const deleteCuttingOrder = async (orderId) => {
  try {
    const response = await api.delete(`/cutting/orders/${orderId}/`);
    return response.data; // Devuelve los datos de la orden eliminada
  } catch (error) {
    console.error(`Error al eliminar la orden de corte ${orderId}:`, error.response?.data || error.message);
    throw error; // Lanzamos el error para manejarlo en el componente
  }
};

// Exportamos todo el servicio para facilitar la importación en otros archivos
export default {
  listCuttingOrders,
  createCuttingOrder,
  getCuttingOrderDetails,
  updateCuttingOrder,
  deleteCuttingOrder,
};
