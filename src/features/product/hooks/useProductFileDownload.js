import { useState, useRef, useCallback } from "react";
import { fetchProtectedFile } from "@/services/files/fileAccessService";

/**
 * Hook para descargar un archivo multimedia protegido (solo Django).
 *
 * @returns {{
 *   downloading: boolean,
 *   downloadError: string | null,
 *   downloadFile: (productId: number, fileId: string) => Promise<string | null>,
 *   abortDownload: () => void
 * }}
 */
export const useDownloadProductFile = () => {
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState(null);
  const controllerRef = useRef(null);

  const downloadFile = useCallback(async (productId, fileId) => {
    if (!productId || !fileId) {
      setDownloadError("ID de producto o archivo no válidos.");
      return null;
    }

    controllerRef.current = new AbortController();
    setDownloading(true);
    setDownloadError(null);

    try {
      const blobUrl = await fetchProtectedFile(productId, fileId, null, controllerRef.current.signal);
      return blobUrl;
    } catch (err) {
      if (err.name === "AbortError") {
        console.warn("⛔ Descarga cancelada");
        return null;
      }
      console.error(`❌ Error al descargar archivo ${fileId}:`, err);
      setDownloadError(err.message || "No se pudo descargar el archivo.");
      return null;
    } finally {
      setDownloading(false);
    }
  }, []);

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
