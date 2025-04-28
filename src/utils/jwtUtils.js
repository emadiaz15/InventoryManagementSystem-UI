/**
 * Parsea un JWT y devuelve el payload decodificado.
 * @param {string} token El JWT completo
 * @returns {object|null} El payload como objeto, o null si falla
 */
export function parseJwt(token) {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(window.atob(base64));
      return payload;
    } catch (e) {
      console.error('❌ Error al decodificar el JWT:', e);
      return null;
    }
  }
  
  /**
   * Verifica si un JWT está expirado comparando su `exp` con la hora actual.
   * @param {string} token El JWT completo
   * @returns {boolean} true si expiró, false si es válido
   */
  export function isJwtExpired(token) {
    const payload = parseJwt(token);
    if (!payload?.exp) return true;
  
    const now = Math.floor(Date.now() / 1000); // Tiempo actual en segundos
    return now >= payload.exp;
  }
  