// src/features/user/services/updateUser.js
import { axiosInstance } from '../../../services/api';

export const updateUser = async (userId, userData) => {
  try {
    // Asegúrate de que la URL corresponda con tu API, por ejemplo, incluyendo el prefijo "api/v1/"
    const response = await axiosInstance.put(`/users/${userId}/`, userData);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar el perfil del usuario:', error.response?.data || error.message);
    if (error.response && error.response.data) {
      const errorMsg = error.response.data;
      if (errorMsg.username) {
        throw new Error("El nombre de usuario ya está en uso.");
      }
      if (errorMsg.email) {
        throw new Error("El email ya está registrado.");
      }
      if (errorMsg.dni) {
        throw new Error("El DNI ya está registrado.");
      }
      if (typeof errorMsg === 'object') {
        const fieldErrors = Object.entries(errorMsg)
          .map(([field, messages]) => `${field}: ${messages.join(', ')}`);
        throw new Error(fieldErrors.join(' | '));
      }
      throw new Error(errorMsg.detail || 'Error al actualizar el perfil del usuario.');
    } else {
      throw new Error('Error en la conexión o en el servidor.');
    }
  }
};

export default {
  updateUser,
};
