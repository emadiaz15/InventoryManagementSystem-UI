const ARGENTINA_TZ = "America/Argentina/Cordoba";

/**
 * Convierte un ISO string UTC a zona horaria Argentina
 * y lo formatea en 24 hrs: dd/MM/yyyy HH:mm:ss
 *
 * @param {string} isoString — Fecha en formato ISO (UTC)
 * @returns {string} — Fecha formateada en zona Argentina o "N/A"
 */
export function formatArgentineDate(isoString) {
  if (!isoString) return "N/A";
  const date = new Date(isoString);
  return date.toLocaleString("es-AR", {
    timeZone: ARGENTINA_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",    // 24 hrs
    minute: "2-digit",
    second: "2-digit",
    hour12: false       // fuerza 24 hrs
  });
}
