import { useState, useEffect } from "react";
import { useDownloadProductFile } from "./useProductDownloadFile";

export const useEnrichedProductFiles = (productId, rawFiles = [], source = 'fastapi') => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState(null);
  const { downloadFile } = useDownloadProductFile();

  const enrichFiles = async () => {
    if (!productId || !Array.isArray(rawFiles)) return;

    setLoading(true);
    setLoadError(null);

    try {
      const enriched = await Promise.all(
        rawFiles.map(async (f) => {
          const fileId = f.drive_file_id || f.id;
          const url = f.url || await downloadFile(productId, fileId, source);
          return {
            ...f,
            id: fileId,
            url,
            filename: f.name || f.filename || "archivo",
            contentType: f.mimeType || f.contentType || "application/octet-stream",
          };
        })
      );
      setFiles(enriched.filter(f => f.url));
    } catch (err) {
      console.error("❌ Error al enriquecer archivos:", err);
      setLoadError("No se pudieron cargar los archivos multimedia.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    enrichFiles();
  }, [productId, JSON.stringify(rawFiles)]); // dependencias clave

  return {
    files,
    loading,
    loadError,
    refresh: enrichFiles,
  };
};
