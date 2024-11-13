import api from '../../../services/api'; // Usa la instancia de Axios configurada

// Método para actualizar los datos del perfil del usuario
export const updateUser = async (userId, userData) => {
  try {
    const response = await api.put(`users/${userId}/`, userData); // Asegúrate de que use la URL correcta
    return response.data; // Devuelve los datos actualizados
  } catch (error) {
    console.error('Error al actualizar el perfil del usuario:', error.response?.data || error.message);
    
    // Manejar errores específicos de campos duplicados
    if (error.response && error.response.data) {
      const errorMsg = error.response.data;

      // Captura errores específicos de validación y campos duplicados
      if (errorMsg.username) {
        throw new Error("El nombre de usuario ya está en uso.");
      }
      if (errorMsg.email) {
        throw new Error("El email ya está registrado.");
      }
      if (errorMsg.dni) {
        throw new Error("El DNI ya está registrado.");
      }

      // Mostrar todos los errores si existen múltiples problemas
      if (typeof errorMsg === 'object') {
        const fieldErrors = Object.entries(errorMsg).map(([field, messages]) => `${field}: ${messages.join(', ')}`);
        throw new Error(fieldErrors.join(' | '));
      }

      // Manejar cualquier otro error
      throw new Error(errorMsg.detail || 'Error al actualizar el perfil del usuario.');
    } else {
      throw new Error('Error en la conexión o en el servidor.');
    }
  }
};

export default {
  updateUser,
};
