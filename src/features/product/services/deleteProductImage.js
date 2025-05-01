import axios from "axios";
import { getFastapiToken } from "../../../services/api";

/**
 * Elimina una imagen de un producto desde FastAPI.
 * @param {string} productId - ID del producto
 * @param {string} fileId - ID del archivo en Drive
 */
export const deleteProductImage = async (productId, fileId) => {
  try {
    await axios.delete(
      `/drive/product/${productId}/delete/${fileId}`,
      {
        baseURL: import.meta.env.VITE_FASTAPI_URL,
        headers: {
          "x-api-key": `Bearer ${getFastapiToken()}`,
        },
      }
    );
  } catch (error) {
    console.error("❌ Error al eliminar la imagen:", error.response?.data || error.message);
    throw new Error("No se pudo eliminar la imagen.");
  }
};

export default {
  deleteProductImage,
};
