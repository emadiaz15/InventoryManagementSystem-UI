import axios from "axios";
import { getAccessToken, clearTokens } from "./api";
import { parseJwt } from "../utils/jwtUtils";

/**
 * Descarga una imagen protegida desde Django usando el token JWT.
 * @param {string} url - URL protegida a la que se hace fetch.
 * @returns {Promise<string>} - Blob URL usable como src en <img>.
 */
export const fetchProtectedImage = async (url) => {
  const accessToken = getAccessToken();

  if (!accessToken) {
    console.error("❌ No hay accessToken en sessionStorage");
    throw new Error("Token no encontrado");
  }

  const payload = parseJwt(accessToken);
  const now = Math.floor(Date.now() / 1000);

  if (!payload || !payload.exp || now >= payload.exp) {
    console.warn("🚫 Token expirado o inválido en fetchProtectedImage");
    clearTokens();
    window.dispatchEvent(new Event("sessionExpired"));
    throw new Error("Token expirado");
  }

  try {
    const response = await axios.get(url, {
      responseType: "blob",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return URL.createObjectURL(response.data);
  } catch (error) {
    console.error("❌ Error al descargar imagen protegida:", error);
    throw error;
  }
};
