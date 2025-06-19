/**
 * 🔓 Parsea un JWT y devuelve el payload decodificado.
 * @param {string} token El JWT completo
 * @returns {object|null} El payload como objeto, o null si falla
 */
export function parseJwt(token) {
  try {
    if (typeof token !== "string") throw new Error("Token no es una cadena válida");
    
    const parts = token.split(".");
    if (parts.length !== 3) throw new Error("Formato JWT inválido");

    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const payload = JSON.parse(window.atob(base64));

    return payload;
  } catch (e) {
    console.error("❌ Error al decodificar el JWT:", e.message);
    return null;
  }
}

/**
 * ⏰ Verifica si un JWT está expirado comparando su `exp` con la hora actual.
 * @param {string} token El JWT completo
 * @returns {boolean} true si expiró o es inválido, false si aún es válido
 */
export function isJwtExpired(token) {
  const payload = parseJwt(token);
  if (!payload || typeof payload.exp !== "number") return true;

  const now = Math.floor(Date.now() / 1000); // Tiempo actual en segundos
  return now >= payload.exp;
}
