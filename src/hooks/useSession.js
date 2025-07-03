import { useEffect } from "react";
import { getAccessToken, clearTokens } from "../utils/sessionUtils";
import { isJwtExpired } from "../utils/jwtUtils";

/**
 * Hook que chequea periódicamente si el accessToken (Django) expiró.
 * Si expiró, limpia tokens y dispara un evento de sesión expirada.
 * @param {Object} options
 * @param {number} options.intervalMs - Frecuencia de chequeo en milisegundos.
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

      const isExpired = isJwtExpired(accessToken);

      if (isExpired) {
        console.warn("⌛ [Session] accessToken expirado, cerrando sesión");
        clearTokens();
        window.dispatchEvent(new Event("sessionExpired"));
      }
    };

    checkSession(); // Primer chequeo inmediato

    const intervalId = setInterval(checkSession, intervalMs);
    return () => clearInterval(intervalId); // Limpieza
  }, [intervalMs]);
}
