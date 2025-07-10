/**
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
 * La emisión del evento de sesión expirada queda a cargo del llamador.
 */
export const clearTokens = () => {
  localStorage.getItem("accessToken");
  localStorage.getItem("refreshToken");
};
