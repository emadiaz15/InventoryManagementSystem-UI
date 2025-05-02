import axios from "axios";
import { getFastapiToken } from "../../../services/api";

/**
 * Lista las imágenes asociadas a un producto desde FastAPI.
 * @param {string} productId - ID del producto
 * @returns {Promise<Array>} - Lista de metadatos de imágenes
 */
export const listProductImages = async (productId) => {
  try {
    const response = await axios.get(
      `/drive/product/${productId}/list`,
      {
        baseURL: import.meta.env.VITE_FASTAPI_URL,
        headers: {
          "x-api-key": `Bearer ${getFastapiToken()}`,
        },
      }
    );
    return response.data.images;
  } catch (error) {
    console.error("❌ Error al listar imágenes del producto:", error.response?.data || error.message);
    throw new Error("No se pudieron listar las imágenes del producto.");
  }
};

export default {
  listProductImages,
};
