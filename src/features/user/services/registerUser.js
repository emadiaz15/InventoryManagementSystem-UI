import { axiosInstance } from '../../../services/api'; // Usa la instancia de Axios configurada

// Método para el registro de usuarios
export const registerUser = async (userData) => {
  try {
    const formData = new FormData();
    formData.append('username', userData.username);
    formData.append('email', userData.email);
    formData.append('name', userData.name);
    formData.append('last_name', userData.last_name);
    formData.append('dni', userData.dni);
    formData.append('is_active', userData.is_active);
    formData.append('is_staff', userData.is_staff);
    formData.append('password', userData.password);

    if (userData.image) {
      formData.append('image', userData.image);
    }

    // Obtener el token de acceso del sessionStorage
    const token = sessionStorage.getItem('accessToken');
    if (!token) {
      throw new Error("Token de acceso no encontrado. Por favor, inicia sesión.");
    }

    // Enviar la solicitud POST al endpoint de registro de usuarios
    const response = await axiosInstance.post('/users/register/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`, // Incluye el token Bearer
      },
    });

    return response.data;
  } catch (error) {
    if (error.response) {
      console.error('Error en el registro:', error.response.data);

      // Si hay un mensaje de error detallado, mostrarlo
      const errors = error.response.data;
      const errorMessages = [];

      // Recopilar mensajes de error específicos de cada campo
      for (const key in errors) {
        if (errors.hasOwnProperty(key)) {
          errorMessages.push(`${key}: ${errors[key].join(', ')}`);
        }
      }

      // Combinar todos los mensajes de error en uno solo
      const errorMessage = errorMessages.length ? errorMessages.join(' | ') : 'Error en el registro de usuario';

      throw new Error(errorMessage);
    } else {
      console.error('Error en el registro:', error.message);
      throw new Error('Error en la conexión o en el servidor');
    }
  }
};

export default {
  registerUser,
};
