import { useEffect } from "react";
import { getAccessToken, clearTokens } from "../services/api";
import { isJwtExpired } from "../utils/jwtUtils";

/**
 * Hook que chequea periódicamente si el accessToken (Django) expiró.
 * Si expiró, limpia tokens y dispara un evento de sesión expirada.
 */
export function useSession({ intervalMs = 30000 } = {}) {
  useEffect(() => {
    const checkSession = () => {
      const accessToken = getAccessToken();

      if (!accessToken) {
        console.warn("🚫 [Session] No hay accessToken, cerrando sesión");
        clearTokens();
        window.dispatchEvent(new Event("sessionExpired"));
        return;
      }

      if (isJwtExpired(accessToken)) {
        console.warn("⌛ [Session] accessToken expirado, cerrando sesión");
        clearTokens();
        window.dispatchEvent(new Event("sessionExpired"));
      }
    };

    checkSession();
    const interval = setInterval(checkSession, intervalMs);
    return () => clearInterval(interval);
  }, [intervalMs]);
}
