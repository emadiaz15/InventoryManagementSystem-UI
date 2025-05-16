import { fetchProtectedFile } from "../../../services/mediaService";

/**
 * 🧪 Enriquecer archivos crudos de subproducto con blob URLs para vista en frontend (img/video).
 * @param {string} productId
 * @param {string} subproductId
 * @param {Array} rawFiles  — array que venga de la API: { drive_file_id, filename?, mimeType? }
 * @param {'fastapi'|'django'} source - Origen de descarga (usualmente 'django' si tu endpoint es de Django)
 */
export const enrichSubproductFiles = async (
  productId,
  subproductId,
  rawFiles = [],
  source = "django"
) => {
  if (!productId || !subproductId || !Array.isArray(rawFiles)) {
    console.warn("❌ Parámetros inválidos en enrichSubproductFiles:", { productId, subproductId, rawFiles });
    return [];
  }

  const VALID_SOURCES = ["fastapi", "django"];
  if (!VALID_SOURCES.includes(source)) {
    console.warn(`⚠️ 'source' inválido: '${source}'. Se usará 'django' por defecto.`);
    source = "django";
  }

  const enriched = await Promise.all(
    rawFiles
      .filter(f => f.drive_file_id || f.id)
      .map(async (f) => {
        const fileId = f.drive_file_id || f.id;
        // Construye la URL usando tu servicio de media, pasando subproductId si lo acepta
        const url = await fetchProtectedFile(productId, fileId, source, subproductId);
        return {
          ...f,
          id: fileId,
          url,
          filename: f.filename || f.name || "archivo_sin_nombre",
          contentType: f.mimeType || f.contentType || "application/octet-stream",
        };
      })
  );

  // Solo devuelve los que obtuvieron URL válida
  return enriched.filter(file => file.url);
};
