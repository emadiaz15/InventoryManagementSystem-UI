import api from '../../../../services/api';

// Método para cambiar el estado de `is_active` a false (eliminación lógica)
export const deleteProduct = async (productId) => {
  try {
    // Actualiza solo `is_active` a `false` en lugar de un DELETE completo
    const response = await api.put(`/inventory/products/${productId}/`, { is_active: false });
    return response.data;
  } catch (error) {
    console.error(`Error al desactivar el producto ${productId}:`, error.response?.data || error.message);
    throw error;
  }
};

export default {
  deleteProduct,
};
