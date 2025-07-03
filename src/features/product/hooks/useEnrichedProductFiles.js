import { useState, useEffect } from "react";

/**
 * 🆔 Obtiene un identificador único de un archivo.
 * Si existe el campo 'key', lo usa; si no, intenta con 'id'.
 * @param {Object} file - Objeto de archivo recibido desde el backend.
 * @returns {string} - ID o key único.
 */
const getFileId = (file) => {
  if (!file) return "";
  return file.key || file.id || "";
};

/**
 * Hook que enriquece la lista de archivos de un producto.
 * Usa directamente la URL pública que viene del backend.
 */
export const useEnrichedProductFiles = (productId, rawFiles = []) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState(null);

  const enrichFiles = async () => {
    if (!productId || !Array.isArray(rawFiles)) return;

    setLoading(true);
    setLoadError(null);

    try {
      const enriched = rawFiles.map((f) => ({
        ...f,
        id: getFileId(f),
        url: f.url, // la URL pública ya la trae el backend
        filename: f.name || f.filename || "archivo",
        contentType: f.mimeType || f.contentType || "application/octet-stream",
      }));

      setFiles(enriched.filter((f) => f.url)); // solo mostramos los que tienen URL
    } catch (err) {
      console.error("❌ Error al enriquecer archivos:", err);
      setLoadError("No se pudieron cargar los archivos multimedia.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    enrichFiles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId, rawFiles]);

  return {
    files,
    loading,
    loadError,
    refresh: enrichFiles,
  };
};
