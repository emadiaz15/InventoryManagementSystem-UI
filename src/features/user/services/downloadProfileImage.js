/**
 * 📥 Obtiene la imagen de perfil de un usuario desde una URL presignada.
 * 
 * @param {string} imageUrl - URL presignada generada desde el backend (MinIO).
 * @returns {Promise<string|null>} - La misma URL si es válida, o null.
 */
export const downloadProfileImage = async (imageUrl) => {
  if (!imageUrl || typeof imageUrl !== "string") {
    console.warn("❌ URL de imagen no válida:", imageUrl);
    return null;
  }

  // En este caso no se necesita petición, la URL ya viene lista desde el backend
  return imageUrl;
};

export default downloadProfileImage;
