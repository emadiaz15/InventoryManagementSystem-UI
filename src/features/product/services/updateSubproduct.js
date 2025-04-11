import { axiosInstance } from '../../../services/api';

export const updateSubproduct = async (productId, subproductId, subproductData) => {
  try {
    const response = await axiosInstance.put(
      `/inventory/products/${productId}/subproducts/${subproductId}/`,
      subproductData
    );
    return response.data; // Devuelve el subproducto actualizado
  } catch (error) {
    console.error('❌ Error al actualizar el subproducto:', error.response?.data || error.message);
    throw new Error(
      error.response?.data?.detail || 'No se pudo actualizar el subproducto.'
    );
  }
};

export default {
  updateSubproduct,
};
