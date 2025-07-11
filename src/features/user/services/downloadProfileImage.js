import axios from "axios";

/**
 * 📥 Obtiene la imagen de perfil de un usuario desde una URL presignada.
 * 
 * @param {string} imageUrl - URL presignada generada desde el backend (MinIO).
 * @returns {Promise<string|null>} - Blob URL para mostrar la imagen, o null.
 */
export const downloadProfileImage = async (imageUrl) => {
  if (!imageUrl || typeof imageUrl !== "string") {
    console.warn("❌ URL de imagen no válida:", imageUrl);
    return null;
  }

  // ── Fuerza HTTP en local si viene con HTTPS ───────────────────────────
  if (imageUrl.startsWith("https://localhost:9000")) {
    imageUrl = imageUrl.replace(/^https:\/\//, "http://");
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
