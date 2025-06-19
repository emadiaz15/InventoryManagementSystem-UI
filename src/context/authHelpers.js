import { axiosInstance } from "../services/api";

/**
 * 🔒 logoutHelper — Notifica al backend para invalidar el refresh token (opcional),
 * y limpia todos los tokens de sesión en el frontend.
 */
export const logoutHelper = async () => {
  const refreshToken = sessionStorage.getItem("refreshToken");

  try {
    if (refreshToken) {
      await axiosInstance.post("/users/logout/", {
        refresh_token: refreshToken,
      });
    }
  } catch (error) {
    console.warn("⚠️ Error al cerrar sesión:", error?.message);
  } finally {
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("refreshToken");
    window.dispatchEvent(new Event("sessionExpired"));
  }
};
