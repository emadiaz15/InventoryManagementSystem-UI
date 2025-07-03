/**
 * 🌐 Session Utils — Manejo centralizado de tokens JWT para autenticación
 */

// ─── Getters ─────────────────────────────────────────────────
export const getAccessToken = () =>
  sessionStorage.getItem("accessToken") || null;
export const getRefreshToken = () =>
  sessionStorage.getItem("refreshToken") || null;

// ─── Limpiar sesión ─────────────────────────────────────────
/**
 * Elimina todos los tokens de sessionStorage.
 * La emisión del evento de sesión expirada queda a cargo del llamador.
 */
export const clearTokens = () => {
  sessionStorage.removeItem("accessToken");
  sessionStorage.removeItem("refreshToken");
};
