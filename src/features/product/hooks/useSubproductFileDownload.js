import { useState, useRef, useCallback } from "react";
import { fetchProtectedFile } from "@/services/files/fileAccessService";

/**
 * Hook para descargar un archivo multimedia de subproducto (solo Django).
 */
export const useDownloadSubproductFile = () => {
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState(null);
  const controllerRef = useRef(null);

  const downloadFile = useCallback(async (productId, subproductId, fileId) => {
    if (!productId || !subproductId || !fileId) {
      setDownloadError("ID de producto, subproducto o archivo no válidos.");
      return null;
    }

    controllerRef.current = new AbortController();
    setDownloading(true);
    setDownloadError(null);

    try {
      const blobUrl = await fetchProtectedFile(
        productId,
        fileId,
        subproductId,
        controllerRef.current.signal
      );
      return blobUrl;
    } catch (err) {
      if (err.name === "AbortError") {
        console.warn("⛔ Descarga cancelada");
        return null;
      }
      console.error("❌ Error al descargar archivo del subproducto:", err);
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
