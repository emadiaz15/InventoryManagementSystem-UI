import { djangoApi } from "@/api/clients";
import { getRefreshToken, clearTokens } from "@/utils/sessionUtils";

/**
 * 🔒 logoutHelper — Notifica al backend para invalidar el refresh token (si existe),
 * y limpia todos los tokens de sesión en el frontend.
 */
export const logoutHelper = async () => {
  const refreshToken = getRefreshToken();

  try {
    if (refreshToken) {
      await djangoApi.post("/users/logout/", {
        refresh_token: refreshToken,
      });
    }
  } catch (error) {
    console.warn("⚠️ Error al cerrar sesión:", error?.response?.data || error.message);
  } finally {
  clearTokens(); // now clears from localStorage
  }
};
