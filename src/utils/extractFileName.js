/**
 * 📂 Extrae solo el nombre de archivo desde una ruta completa.
 * @param {string} path - La ruta completa, ejemplo: 'profile-images/1_asd32.png'
 * @returns {string} - El nombre del archivo, ejemplo: '1_asd32.png'
 */
export const extractFileName = (path) => {
  if (!path) return "";
  return path.split('/').pop();
};

/**
 * 🆔 Obtiene un identificador único de un archivo.
 * Si existe el campo 'key', lo usa; si no, intenta con 'id'.
 * @param {Object} file - Objeto de archivo recibido desde el backend.
 * @returns {string} - ID o key único.
 */
export const getFileId = (file) => {
  if (!file) return "";
  return file.key || file.id || "";
};
