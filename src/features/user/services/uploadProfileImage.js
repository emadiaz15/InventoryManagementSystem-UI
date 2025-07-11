import { djangoApi } from "@/api/clients";
import { invalidateCachedUsersByUrl } from "./userCache";

/**
 * 📤 Sube una nueva imagen de perfil para el usuario y actualiza el caché.
 *
 * @param {File} file - El archivo de imagen a subir.
 * @param {number|null} userId - ID del usuario (requerido solo si lo sube un admin).
 * @param {string} [listUrl="/users/list/"] - URL para invalidar el caché del listado.
 * @returns {Promise<Object>} - Datos del usuario actualizado con nueva imagen.
 * @throws {Error} - Si ocurre un error durante la carga.
 */
export const uploadProfileImage = async (
  file,
  userId = null,
  listUrl = "/users/list/"
) => {
  if (!file || !(file instanceof File)) {
    throw new Error("Debes seleccionar una imagen válida para subir.");
  }

  const formData = new FormData();
  formData.append("file", file);

  const url = userId
    ? `/users/image/upload/?user_id=${userId}`
    : `/users/image/upload/`;

  try {
    const response = await djangoApi.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    // ✅ Invalida el caché para actualizar listado o datos relacionados
    if (listUrl) {
      invalidateCachedUsersByUrl(listUrl);
    }

    return response.data;
  } catch (error) {
    console.error(
      "❌ Error al subir imagen de perfil:",
      error.response?.data || error.message
    );
    throw new Error("No se pudo subir la imagen. Intenta nuevamente.");
  }
};

export default uploadProfileImage;
