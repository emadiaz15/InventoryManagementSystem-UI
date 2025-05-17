import { useState, useEffect } from "react";
import { useDownloadSubproductFile } from "./useDownloadSubproductFile";

/**
 * Enriquecer archivos crudos con URL descargable, nombre y tipo MIME.
 */
export const useEnrichedSubproductFiles = (productId, subproductId, rawFiles = [], source = "django") => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState(null);
  const { downloadFile } = useDownloadSubproductFile();

  const enrichFiles = async () => {
    if (!productId || !subproductId || !Array.isArray(rawFiles)) return;

    setLoading(true);
    setLoadError(null);

    try {
      const enriched = await Promise.all(
        rawFiles.map(async (f) => {
          const fileId = f.drive_file_id || f.id;
          const url = f.url || await downloadFile(productId, subproductId, fileId, source);
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
      console.error("❌ Error enriqueciendo archivos:", err);
      setLoadError("No se pudieron cargar los archivos multimedia.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    enrichFiles();
  }, [productId, subproductId, JSON.stringify(rawFiles)]);

  return {
    files,
    loading,
    loadError,
    refresh: enrichFiles,
  };
};
