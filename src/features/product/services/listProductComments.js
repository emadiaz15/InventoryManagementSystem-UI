import { axiosInstance } from '../../../services/api';

export const listProductComments = async (prodId, url = null) => {
  try {
    // Si se pasa una URL, se usa esa URL (para paginación); de lo contrario, se utiliza el endpoint por defecto
    const endpoint = url || `/comments/products/${prodId}/comments/`;
    const response = await axiosInstance.get(endpoint);
    return response.data;
  } catch (error) {
    console.error("Error fetching product comments:", error.response?.data || error.message);
    throw new Error(error.response?.data?.detail || "Error fetching product comments.");
  }
};

export default listProductComments;
