import { useEffect, useRef } from "react";
import { getAccessToken, clearTokens } from "../utils/sessionUtils";
import { isJwtExpired } from "../utils/jwtUtils";

/**
 * Hook que chequea periódicamente si el accessToken expiró.
 * Si expiró, limpia tokens y dispara un evento de sesión expirada (solo una vez).
 * @param {Object} options
 * @param {number} options.intervalMs - Frecuencia de chequeo en milisegundos.
 */
export function useSession({ intervalMs = 30000 } = {}) {
  const notifiedRef = useRef(false);

  useEffect(() => {
    const checkSession = () => {
      const accessToken = getAccessToken();

      if (!accessToken) {
        // Si no hay token, reseteamos la bandera para futuros logins
        if (notifiedRef.current) {
          notifiedRef.current = false;
        }
        console.warn("🚫 [Session] No hay accessToken, omitiendo chequeo");
        return;
      }

      // Si ya notificamos una expiración previa, no hacemos nada
      if (notifiedRef.current) {
        return;
      }

      if (isJwtExpired(accessToken)) {
        console.warn("⌛ [Session] accessToken expirado, cerrando sesión");
        clearTokens();
        notifiedRef.current = true;
        window.dispatchEvent(new Event("sessionExpired"));
      }
    };

    // Primer chequeo inmediato
    checkSession();

    const intervalId = setInterval(checkSession, intervalMs);
    return () => clearInterval(intervalId);
  }, [intervalMs]);
}
