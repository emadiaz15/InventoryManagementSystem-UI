import { djangoApi } from "@/api/clients";
import { clearUsersCache } from "./userCache";
import { extractFileName } from "@/utils/extractFileName";  // ✅ Import del helper

/**
 * 🗑️ Elimina la imagen de perfil de un usuario.
 *
 * @param {string} filePath - Ruta completa o parcial del archivo en el sistema.
 * @param {number|null} userId - ID del usuario (requerido solo si lo hace un admin).
 * @returns {Promise<Object>} - Usuario actualizado sin imagen de perfil.
 */
export const deleteProfileImage = async (filePath, userId = null) => {
  if (!filePath) throw new Error("Falta el ID del archivo a eliminar.");

  const fileName = extractFileName(filePath);

  const url = userId
    ? `/users/image/${fileName}/delete/?user_id=${userId}`
    : `/users/image/${fileName}/delete/`;

  try {
    const response = await djangoApi.delete(url);

    // ✅ Limpiar cache después de eliminar la imagen
    clearUsersCache();

    return response.data;
  } catch (error) {
    console.error("❌ Error al eliminar imagen de perfil:", error.response?.data || error.message);
    throw new Error("No se pudo eliminar la imagen. Intenta nuevamente.");
  }
};

export default deleteProfileImage;
