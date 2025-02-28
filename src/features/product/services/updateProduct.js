import { axiosInstance } from '../../../services/api';

export const updateProduct = async (productId, productData) => {
  try {
    const response = await axiosInstance.put(`/inventory/products/${productId}/`, productData);
    return response.data;
  } catch (error) {
    console.error('❌ Error al actualizar el producto:', error.response?.data || error.message);
    throw new Error(error.response?.data?.detail || 'No se pudo actualizar el producto.');
  }
};

export default {
  updateProduct,
};
