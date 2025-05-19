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
      // ❌ Ignora carpetas (solo procesa archivos)
      .filter(f => 
        (f?.drive_file_id || f?.id) &&
        f?.mimeType !== 'application/vnd.google-apps.folder'
      )
      .map(async (f) => {
        const fileId = f.drive_file_id || f.id;

        try {
          const url = await fetchProtectedFile(productId, fileId, 'django');

          return {
            ...f,
            id: fileId,
            url,
            filename: f.name || f.filename || "archivo_sin_nombre",
            contentType: f.mimeType || f.contentType || "application/octet-stream",
          };
        } catch (err) {
          console.error(`❌ Error descargando archivo con ID ${fileId}`, err);
          return null; // Evita que archivos con error pasen el filtro
        }
      })
  );

  return enriched.filter(file => file && file.url); // 🔥 Solo archivos válidos con URL Blob
};
