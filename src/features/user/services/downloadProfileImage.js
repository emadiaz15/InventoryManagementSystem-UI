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

  try {
    const response = await fetch(imageUrl);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const blob = await response.blob();
    return URL.createObjectURL(blob);
  } catch (err) {
    console.error("❌ Error al descargar imagen de perfil:", err);
    return imageUrl;
  }
};

export default downloadProfileImage;
