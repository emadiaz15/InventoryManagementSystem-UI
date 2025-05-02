import axios from '../../../services/api';

/**
 * Elimina una imagen de perfil en el backend y devuelve el usuario actualizado.
 * @param {string} fileId - ID del archivo (obligatorio).
 * @param {number|null} userId - ID del usuario dueño de la imagen (solo requerido si el admin borra la imagen de otro).
 * @returns {Promise<Object>} - Datos actualizados del usuario.
 */
export const deleteProfileImage = async (fileId, userId = null) => {
  if (!fileId) throw new Error('ID de imagen no proporcionado');

  const url = userId
    ? `/users/image/${fileId}/delete/?user_id=${userId}`
    : `/users/image/${fileId}/delete/`;

  const response = await axios.delete(url);
  return response.data; // ✅ Devuelve el usuario actualizado con image & image_url = null
};
