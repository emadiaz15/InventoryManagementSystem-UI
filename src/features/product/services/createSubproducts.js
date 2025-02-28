// Crear un subproducto

import axiosInstance from "../../../services/api";
export const createSubproduct = async (product_pk, subproductData) => {
    try {
      const response = await axiosInstance.post(`/api/v1/inventory/products/${product_pk}/subproducts/create/`, subproductData);
      return response.data;
    } catch (error) {
      console.error('Error al crear subproducto:', error.response?.data || error.message);
      throw new Error(error.response?.data?.detail || 'Error al crear subproducto');
    }
  };
  