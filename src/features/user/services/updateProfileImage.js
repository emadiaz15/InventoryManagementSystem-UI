import { djangoApi } from "@/api/clients";
import { invalidateCachedUsersByUrl } from "./userCache";

/**
 * 📸 Reemplaza la imagen de perfil de un usuario y actualiza el caché.
 *
 * @param {File} file - El nuevo archivo de imagen.
 * @param {string} fileId - ID del archivo actual en el sistema.
 * @param {number|null} userId - ID del usuario (requerido solo si el admin lo hace).
 * @param {string} [listUrl="/users/list/"] - URL a invalidar en la caché.
 * @returns {Promise<Object>} - Usuario actualizado con nueva imagen.
 */
export const updateProfileImage = async (
  file,
  fileId,
  userId = null,
  listUrl = "/users/list/"
) => {
  if (!fileId) throw new Error("Falta el ID del archivo a reemplazar.");
  if (!file || !(file instanceof File)) {
    throw new Error("Debes seleccionar una imagen válida para subir.");
  }

  const formData = new FormData();
  formData.append("file", file);

  const url = userId
    ? `/users/image/${fileId}/replace/?user_id=${userId}`
    : `/users/image/${fileId}/replace/`;

  try {
    const response = await djangoApi.put(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    // ✅ Invalida el caché para refrescar listado o datos relacionados
    if (listUrl) {
      invalidateCachedUsersByUrl(listUrl);
    }

    return response.data;
  } catch (error) {
    console.error(
      "❌ Error al actualizar imagen de perfil:",
      error.response?.data || error.message
    );
    throw new Error("No se pudo actualizar la imagen. Intenta nuevamente.");
  }
};

export default updateProfileImage;
