import { axiosInstance } from '../../../services/api';

export const createProduct = async (productData) => {
  try {
    const response = await axiosInstance.post('/inventory/products/create/', productData);
    return response.data; // Devuelve los datos del producto creado
  } catch (error) {
    console.error('❌ Error al crear el producto:', error.response?.data || error.message);
    throw new Error(
      error.response?.data?.detail || 'No se pudo crear el producto.'
    );
  }
};

export default {
  createProduct,
};
