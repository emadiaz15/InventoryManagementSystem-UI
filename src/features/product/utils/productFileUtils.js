import { fetchProtectedFile } from "../../../services/mediaService";

/**
 * 🧪 Enriquecer archivos crudos con blob URLs para vista en frontend (img/video).
 * @param {string} productId
 * @param {Array} rawFiles
 * @param {'fastapi' | 'django'} source - Origen de descarga (forzado a 'django' en este caso)
 */
export const enrichProductFiles = async (productId, rawFiles = [], source = 'django') => {
  if (!productId || !Array.isArray(rawFiles)) {
    console.warn("❌ Parámetros inválidos en enrichProductFiles:", { productId, rawFiles });
    return [];
  }

  const VALID_SOURCES = ['fastapi', 'django'];

  if (!VALID_SOURCES.includes(source)) {
    console.warn(`⚠️ 'source' inválido: '${source}'. Se usará 'django' por defecto.`);
    source = 'django';
  }

  const enriched = await Promise.all(
    rawFiles
      .filter(f => f?.drive_file_id || f?.id)
      .map(async (f) => {
        const fileId = f.drive_file_id || f.id;

        // ⚠️ Forzamos siempre 'django' porque tu endpoint actual es de Django
        const url = await fetchProtectedFile(productId, fileId, 'django');

        return {
          ...f,
          id: fileId,
          url,
          filename: f.name || f.filename || "archivo_sin_nombre",
          contentType: f.mimeType || f.contentType || "application/octet-stream",
        };
      })
  );

  return enriched.filter(file => file.url); // 🔥 Solo archivos válidos con URL Blob
};
