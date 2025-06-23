import { useState, useEffect } from "react";
import { useDownloadSubproductFile } from "./useDownloadSubproductFile";
import { getFileId } from "@/utils/fileUtils"; // sugerido para DRY

/**
 * Enriquecer archivos crudos de subproducto con URL descargable, nombre y tipo MIME.
 */
export const useEnrichedSubproductFiles = (productId, subproductId, rawFiles = []) => {
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
          const fileId = getFileId(f);
          const url = f.url || await downloadFile(productId, subproductId, fileId);
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
  }, [productId, subproductId, rawFiles]); // eliminado stringify

  return {
    files,
    loading,
    loadError,
    refresh: enrichFiles,
  };
};
