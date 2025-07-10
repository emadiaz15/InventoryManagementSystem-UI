/**
 * 📥 Obtiene la imagen de perfil de un usuario desde una URL presignada.
 * 
 * @param {string} imageUrl - URL presignada generada desde el backend (MinIO).
 * @returns {Promise<string|null>} - La misma URL si es válida, o null.
 */
import axios from "axios";

export const downloadProfileImage = async (imageUrl) => {
  if (!imageUrl || typeof imageUrl !== "string") {
    console.warn("❌ URL de imagen no válida:", imageUrl);
    return null;
  }

  try {
    const response = await axios.get(imageUrl, { responseType: "blob" });
    return URL.createObjectURL(response.data);
  } catch (error) {
    console.warn("❌ Error descargando imagen:", error);
    return null;
  }
};

export default downloadProfileImage;
