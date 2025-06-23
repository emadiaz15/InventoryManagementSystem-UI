import { djangoApi } from "@/api/clients";
import { invalidateCachedUsersByUrl } from "./userCache";

/**
 * ✏️ Actualiza los datos de un usuario.
 *
 * @param {number|string} userId - ID del usuario a actualizar.
 * @param {Object} userData - Datos del usuario a enviar.
 * @param {string} [listUrl="/users/list/"] - URL específica para invalidar cache si es necesario.
 * @returns {Promise<Object>} - Usuario actualizado.
 */
export const updateUser = async (userId, userData, listUrl = "/users/list/") => {
  if (!userId) throw new Error("ID de usuario requerido para actualizar.");

  try {
    let dataToSend;

    // Si la imagen es un File, enviamos FormData
    if (userData.image && userData.image instanceof File) {
      dataToSend = new FormData();
      Object.entries(userData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          dataToSend.append(key, value);
        }
      });
    } else {
      // Caso contrario, envío JSON plano
      dataToSend = userData;
    }

    const response = await djangoApi.put(`/users/${userId}/`, dataToSend);

    // 🧹 Invalidamos la caché solo si corresponde (ejemplo: listado cacheado)
    if (listUrl) {
      invalidateCachedUsersByUrl(listUrl);
    }

    return response.data;
  } catch (error) {
    const responseData = error.response?.data;
    console.error("❌ Error al actualizar el usuario:", responseData || error.message);

    if (responseData && typeof responseData === "object") {
      const fieldErrors = Object.entries(responseData).map(([field, messages]) =>
        Array.isArray(messages)
          ? `${field}: ${messages.join(", ")}`
          : `${field}: ${messages}`
      );
      throw new Error(fieldErrors.join(" | "));
    }

    throw new Error("Error al actualizar el usuario. Intenta nuevamente.");
  }
};

export default updateUser;
