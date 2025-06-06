import { axiosInstance } from '../../../services/api';

/**
 * Soft-delete de un producto.
 * Usa baseURL='/api/v1' + esta ruta => '/api/v1/inventory/products/:id/'
 */
export const deleteProduct = async (productId) => {
  try {
    // Coincide con tu updateProduct:
    const response = await axiosInstance.delete(`/inventory/products/${productId}/`);
    // axios lanza si no es 2xx, así que si llega aquí, fue 204 o 200
    return response;
  } catch (error) {
    const detail = error.response?.data?.detail || 'Error al eliminar el producto';
    throw new Error(detail);
  }
};

export default {
  deleteProduct,
};
