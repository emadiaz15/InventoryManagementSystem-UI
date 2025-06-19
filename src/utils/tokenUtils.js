/**
 * 🌐 Token Utils — Manejo centralizado de tokens JWT para autenticación
 */

// ─── Getters ─────────────────────────────────────────────────
export const getAccessToken = () => sessionStorage.getItem("accessToken") || null;
export const getRefreshToken = () => sessionStorage.getItem("refreshToken") || null;
export const getFastapiToken = () => sessionStorage.getItem("fastapiToken") || null; // si lo usas

// ─── Limpiar sesión ─────────────────────────────────────────
/**
 * Elimina todos los tokens del sessionStorage y emite un evento global.
 */
export const clearTokens = () => {
  sessionStorage.removeItem("accessToken");
  sessionStorage.removeItem("refreshToken");
  sessionStorage.removeItem("fastapiToken");
  window.dispatchEvent(new Event("sessionExpired"));
};
