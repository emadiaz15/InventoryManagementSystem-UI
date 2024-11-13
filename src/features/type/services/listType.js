// src/services/types/listType.js
import api from '../../../services/api';

export const listTypes = async () => {
  try {
    const response = await api.get('/inventory/types/');
    return response.data;
  } catch (error) {
    console.error('Error al obtener la lista de tipos:', error.response?.data || error.message);
    // Lanza el error para que el componente principal lo maneje
    throw new Error(error.response?.data?.detail || 'Error al obtener la lista de tipos.');
  }
};

export default listTypes;
