/**
 * 🌐 Token Utils — Manejo centralizado de tokens JWT para Auth
 */

// ─── Getters ─────────────────────────────
export const getAccessToken = () => sessionStorage.getItem("accessToken");
export const getRefreshToken = () => sessionStorage.getItem("refreshToken");

export const clearTokens = () => {
  sessionStorage.removeItem("accessToken");
  sessionStorage.removeItem("refreshToken");
  window.dispatchEvent(new Event("sessionExpired"));
};
