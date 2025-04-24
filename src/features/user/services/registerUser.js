import { axiosInstance } from '../../../services/api';

export const registerUser = async (formData) => {
  try {
    const token = sessionStorage.getItem('accessToken');
    if (!token) {
      throw new Error("Token de acceso no encontrado. Por favor, inicia sesión.");
    }

    const response = await axiosInstance.post('/users/register/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`,
      },
    });

    return response.data;

  } catch (error) {
    if (error.response?.data && typeof error.response.data === 'object') {
      const apiErrors = error.response.data;

      const flatMessage = Object.entries(apiErrors)
        .map(([field, messages]) =>
          `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`
        )
        .join(' | ');

      throw {
        message: "Por favor revisa los errores en el formulario.",
        fieldErrors: apiErrors,
        raw: flatMessage,
      };
    }

    throw new Error('Error en la conexión o en el servidor');
  }
};
