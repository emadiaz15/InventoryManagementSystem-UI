import { axiosInstance } from '../../../services/api';

export const updateUser = async (userId, userData) => {
  try {
    let dataToSend;
    // Verifica si se ha seleccionado un archivo para la imagen
    if (userData.image && userData.image instanceof File) {
      dataToSend = new FormData();
      // Añade todos los campos al FormData
      for (const key in userData) {
        if (userData.hasOwnProperty(key)) {
          dataToSend.append(key, userData[key]);
        }
      }
    } else {
      // Si no hay archivo, se envía el JSON directamente
      dataToSend = userData;
    }

    // Realiza la petición PUT
    const response = await axiosInstance.put(`/users/${userId}/`, dataToSend);
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
          .map(([field, messages]) =>
            Array.isArray(messages)
              ? `${field}: ${messages.join(', ')}`
              : `${field}: ${messages}`
          );
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
