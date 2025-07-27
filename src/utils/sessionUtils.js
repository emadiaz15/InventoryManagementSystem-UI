/** src/utils/sessionUtils.js
 * 🌐 Session Utils — Manejo centralizado de tokens JWT para autenticación
 */

// ─── Getters ─────────────────────────────────────────────────
export const getAccessToken = () =>
  localStorage.getItem("accessToken") || null;
export const getRefreshToken = () =>
  localStorage.getItem("refreshToken") || null;

// ─── Limpiar sesión ─────────────────────────────────────────
/**
 * Elimina todos los tokens de localStorage.
 */
export const clearTokens = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
};
