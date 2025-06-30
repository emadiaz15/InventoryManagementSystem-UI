import { djangoApi } from "@/api/clients";

/**
 * 🔐 Restablece la contraseña de un usuario (solo admin o staff autorizado).
 *
 * @param {number|string} userId - ID del usuario a modificar.
 * @param {object} passwordData - { password: string, confirmPassword: string }
 * @returns {Promise<object>} - Mensaje del backend.
 */
export const resetUserPassword = async (userId, passwordData) => {
  if (!userId) throw new Error("Se requiere el ID del usuario.");

  const { password, confirmPassword } = passwordData || {};
  if (!password || !confirmPassword) {
    throw new Error("Debes completar ambos campos de contraseña.");
  }

  if (password !== confirmPassword) {
    throw new Error("Las contraseñas no coinciden.");
  }

  if (password.length < 8) {
    throw new Error("La contraseña debe tener al menos 8 caracteres.");
  }

  try {
    const response = await djangoApi.post(`/users/${userId}/change-password/`, {
      password,
      confirmPassword,
    });

    return response.data;
  } catch (error) {
    const responseErrors = error.response?.data;

    if (typeof responseErrors === "object" && responseErrors !== null) {
      const messages = [];

      if (Array.isArray(responseErrors.password)) {
        messages.push(`Contraseña: ${responseErrors.password.join(', ')}`);
      }
      if (Array.isArray(responseErrors.confirmPassword)) {
        messages.push(`Confirmación: ${responseErrors.confirmPassword.join(', ')}`);
      }
      if (responseErrors.detail) {
        messages.push(responseErrors.detail);
      }

      throw new Error(messages.length ? messages.join(" | ") : "Error al restablecer la contraseña.");
    }

    throw new Error(
      typeof responseErrors === "string"
        ? responseErrors
        : "No se pudo restablecer la contraseña. Verifica la conexión."
    );
  }
};
