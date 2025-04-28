import { useEffect } from 'react';
import { getFastapiToken, clearTokens } from '../services/api';
import { isJwtExpired } from '../utils/jwtUtils';

/**
 * Hook que chequea periódicamente si el fastapiToken expiró.
 * Si expiró, limpia tokens y dispara un evento de sesión expirada.
 */
export function useSession({ intervalMs = 30000 } = {}) {
  useEffect(() => {
    const checkSession = () => {
      const fastapiToken = getFastapiToken();
      if (!fastapiToken) {
        console.warn('🚫 No hay fastapiToken, cerrando sesión');
        clearTokens();
        window.dispatchEvent(new Event('sessionExpired'));
        return;
      }

      if (isJwtExpired(fastapiToken)) {
        console.warn('⌛ Token fastapi expirado, cerrando sesión');
        clearTokens();
        window.dispatchEvent(new Event('sessionExpired'));
      }
    };

    // Ejecutar chequeo inmediatamente
    checkSession();

    // Setear intervalo de chequeo
    const interval = setInterval(checkSession, intervalMs);

    // Cleanup
    return () => clearInterval(interval);
  }, [intervalMs]);
}
