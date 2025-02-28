import { axiosInstance } from '../../../services/api';

export const createProduct = async (productData) => {
  try {
    const response = await axiosInstance.post('/inventory/products/', productData);
    return response.data;
  } catch (error) {
    console.error('❌ Error al crear el producto:', error.response?.data || error.message);
    throw new Error(error.response?.data?.detail || 'No se pudo crear el producto.');
  }
};

export default {
  createProduct,
};
