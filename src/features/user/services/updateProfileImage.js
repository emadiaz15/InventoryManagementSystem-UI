import axios from '../../../services/api';

/**
 * Reemplaza la imagen de perfil de un usuario.
 *
 * @param {File} file - El nuevo archivo de imagen.
 * @param {string} fileId - ID del archivo actual.
 * @param {number|null} userId - ID del usuario (solo requerido si lo actualiza un admin).
 * @returns {Promise<Object>} - Respuesta del backend.
 */
export const updateProfileImage = async (file, fileId, userId = null) => {
  if (!file || !fileId) {
    throw new Error('Faltan parámetros para actualizar la imagen de perfil');
  }

  const formData = new FormData();
  formData.append('file', file);

  const url = userId
    ? `/users/image/${fileId}/replace/?user_id=${userId}`
    : `/users/image/${fileId}/replace/`;

  const response = await axios.put(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};
