/**
 * 📂 Extrae solo el nombre de archivo desde una ruta completa.
 * @param {string} path - La ruta completa, ejemplo: 'profile-images/1_asd32.png'
 * @returns {string} - El nombre del archivo, ejemplo: '1_asd32.png'
 */
export const extractFileName = (path) => {
  if (!path) return "";
  return path.split('/').pop();
};
