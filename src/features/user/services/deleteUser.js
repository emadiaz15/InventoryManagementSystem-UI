// src/features/user/services/deleteUser.js
import { axiosInstance } from '../../../services/api';

export const deleteUser = async (userId) => {
  try {
    // La URL es relativa para que se use el baseURL definido en Axios
    const response = await axiosInstance.delete(`/users/${userId}/`);
    return response.data; // Devuelve los datos del usuario eliminado (soft delete)
  } catch (error) {
    console.error(`Error al eliminar el usuario ${userId}:`, error.response?.data || error.message);
    throw new Error(error.response?.data?.detail || `Error al eliminar el usuario ${userId}`);
  }
};

export default {
  deleteUser,
};
