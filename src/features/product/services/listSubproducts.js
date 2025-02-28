import { axiosInstance } from '../../../services/api'; // Usa la instancia de Axios configurada

// Obtener subproductos de un producto padre
export const listSubproducts = async (product_pk) => {
  try {
    const response = await axiosInstance.get(`/api/v1/inventory/products/${product_pk}/subproducts/`);
    return response.data;
  } catch (error) {
    console.error('Error al listar subproductos:', error.response?.data || error.message);
    throw new Error(error.response?.data?.detail || 'Error al listar subproductos');
  }
};