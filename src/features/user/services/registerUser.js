import { djangoApi } from "@/api/clients";
import { clearUsersCache } from "./userCache";

/**
 * 🧾 Registra un nuevo usuario en el sistema.
 *
 * @param {FormData} formData - Datos del formulario de registro.
 * @returns {Promise<Object>} - Usuario creado.
 */
export const registerUser = async (formData) => {
  if (!formData || !(formData instanceof FormData)) {
    throw new Error("Datos del formulario inválidos.");
  }

  try {
    const response = await djangoApi.post('/users/register/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data', // axios lo infiere, pero lo dejamos explícito
      },
    });

    // ✅ Limpiar cache al crear nuevo usuario
    clearUsersCache();

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

export default {
  registerUser,
};
