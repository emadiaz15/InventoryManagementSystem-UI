import { djangoApi } from "@/api/clients";
import { clearUsersCache } from "./userCache";

/**
 * 🗑️ Elimina (soft delete) un usuario por su ID.
 *
 * @param {number|string} userId - ID del usuario a eliminar.
 * @returns {Promise<Object>} - Datos del usuario eliminado.
 * @throws {Error} - Si la operación falla.
 */
export const deleteUser = async (userId) => {
  if (!userId) throw new Error("ID de usuario no proporcionado");

  try {
    const response = await djangoApi.delete(`/users/${userId}/`);

    // ✅ Limpiar cache tras eliminar usuario
    clearUsersCache();

    return response.data;
  } catch (error) {
    console.error(`❌ Error al eliminar el usuario ${userId}:`, error.response?.data || error.message);
    throw new Error(error.response?.data?.detail || `Error al eliminar el usuario ${userId}`);
  }
};

export default deleteUser;
