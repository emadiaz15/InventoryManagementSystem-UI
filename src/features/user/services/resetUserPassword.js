// ============== ARCHIVO NUEVO: apps/users/services/resetUserPassword.js ==============
import { axiosInstance } from '../../../services/api'; // Importa tu instancia configurada de Axios

/**
 * Llama a la API para cambiar/restablecer la contraseña de un usuario específico.
 * Requiere que el usuario que realiza la llamada esté autenticado y tenga permisos.
 *
 * @param {number|string} userId - El ID del usuario cuya contraseña se cambiará.
 * @param {object} passwordData - Objeto con la nueva contraseña. Ej: { password: 'newpassword123', confirmPassword: 'newpassword123' }
 * @returns {Promise<object>} - La respuesta de la API (ej. { message: '...' })
 * @throws {Error} - Lanza un error si la petición falla o hay errores de validación.
 */
export const resetUserPassword = async (userId, passwordData) => {
  // Verifica que los datos necesarios estén presentes
  if (!userId) {
    throw new Error("Se requiere el ID del usuario.");
  }
  if (!passwordData || !passwordData.password || !passwordData.confirmPassword) {
    throw new Error("Se requieren la nueva contraseña y su confirmación.");
  }
  // Validación básica de contraseña (opcional aquí, el backend DEBE validar)
  if (passwordData.password !== passwordData.confirmPassword) {
    throw new Error("Las contraseñas no coinciden.");
  }
  if (passwordData.password.length < 8) {
     throw new Error("La contraseña debe tener al menos 8 caracteres.");
  }


  console.log(`Attempting to reset password for user ID: ${userId}`);

  try {
    // 1. Obtener el token de acceso del usuario AUTENTICADO (el admin/staff)
    const token = sessionStorage.getItem('accessToken'); // O donde guardes tu token
    if (!token) {
      throw new Error("Token de acceso no encontrado. Por favor, inicia sesión.");
    }

    // 2. Construir la URL del endpoint (¡AJUSTA ESTA RUTA SI ES DIFERENTE!)
    const apiUrl = `/users/${userId}/change-password/`; // Reemplaza con tu URL real

    // 3. Enviar la solicitud POST con los datos de la nueva contraseña
    //    Axios enviará esto como application/json por defecto
    const response = await axiosInstance.post(apiUrl, {
        password: passwordData.password,
        confirmPassword: passwordData.confirmPassword // El backend validará que coincidan
    }, {
      headers: {
        // No necesitamos 'Content-Type': 'application/json', Axios lo hace por defecto con objetos
        'Authorization': `Bearer ${token}`, // Incluye el token Bearer del admin/staff
      },
    });

    console.log('Password reset response:', response.data);
    return response.data; // Devuelve la respuesta del backend (ej. { message: '...' })

  } catch (error) {
    // Manejo de errores similar a registerUser
    if (error.response) {
      // Error desde el backend (4xx, 5xx)
      console.error(`Error resetting password for user ${userId}:`, error.response.data);

      const errors = error.response.data;
      let errorMessage = 'Error al restablecer la contraseña.'; // Mensaje por defecto

      // Intenta construir un mensaje más específico
      if (typeof errors === 'object' && errors !== null) {
          const errorMessages = [];
          // Busca errores específicos de campo (ej. 'password') o un error general 'detail'
          if(errors.password && Array.isArray(errors.password)) {
              errorMessages.push(`Contraseña: ${errors.password.join(', ')}`);
          }
          if(errors.confirmPassword && Array.isArray(errors.confirmPassword)) {
              errorMessages.push(`Confirmar Contraseña: ${errors.confirmPassword.join(', ')}`);
          }
          if(errors.detail) {
               errorMessages.push(errors.detail);
          }
          // Combina mensajes o usa el default
          if (errorMessages.length > 0) {
            errorMessage = errorMessages.join(' | ');
          } else if (JSON.stringify(errors) !== '{}') {
             // Si hay un objeto de error pero no campos conocidos, muestra el objeto
             errorMessage = JSON.stringify(errors);
          }
      } else if (typeof errors === 'string') {
           errorMessage = errors; // Si el backend solo devuelve un string de error
      }

      throw new Error(errorMessage);

    } else if (error.request) {
        // La petición se hizo pero no se recibió respuesta
        console.error('Error resetting password (no response):', error.request);
        throw new Error('No se pudo conectar con el servidor. Verifica tu conexión.');
    } else {
      // Error al configurar la petición
      console.error('Error setting up password reset request:', error.message);
      throw new Error(`Error en la configuración de la solicitud: ${error.message}`);
    }
  }
};

// Puedes añadir otras funciones relacionadas con usuarios aquí si quieres
// export const anotherUserFunction = async (...) => { ... };

// Exporta la función (o funciones)
export default {
    resetUserPassword,
    // anotherUserFunction,
};
// ============== FIN ARCHIVO: apps/users/services/resetUserPassword.js ==============