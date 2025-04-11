import axios from '../../../services/api'; // Asegúrate que este path esté bien

export const listStockProductEvents = async (productId, query = '') => {
  try {
    const response = await axios.get(`/stocks/products/${productId}/stock/events/${query}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching stock events:', error);
    throw error;
  }
};
