import { useState, useRef, useCallback } from "react";
import { fetchProtectedFile } from "../../../services/mediaService";

/**
 * Hook para descargar un archivo multimedia de subproducto.
 */
export const useSubproductFileDownload= () => {
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState(null);
  const controllerRef = useRef(null);

  const downloadFile = useCallback(
    async (productId, subproductId, fileId, source = "django") => {
      if (!productId || !subproductId || !fileId) {
        setDownloadError("ID inválido.");
        return null;
      }

      controllerRef.current = new AbortController();
      setDownloading(true);
      setDownloadError(null);

      try {
        const blobUrl = await fetchProtectedFile(
          productId,
          fileId,
          source,
          subproductId,
          controllerRef.current.signal
        );
        return blobUrl;
      } catch (err) {
        if (err.name === "AbortError") {
          console.warn("⛔ Descarga cancelada");
          return null;
        }
        console.error("❌ Error al descargar:", err);
        setDownloadError(err.message || "No se pudo descargar.");
        return null;
      } finally {
        setDownloading(false);
      }
    },
    []
  );

  const abortDownload = () => {
    if (controllerRef.current) {
      controllerRef.current.abort();
    }
  };

  return {
    downloading,
    downloadError,
    downloadFile,
    abortDownload,
  };
};
