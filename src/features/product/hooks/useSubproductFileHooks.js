import { useState, useEffect, useRef, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  listSubproductFiles,
  uploadSubproductFiles,
  deleteSubproductFile,
} from "../../product/services/subproducts/subproductsFiles";
import { fetchProtectedFile } from "@/services/files/fileAccessService";

// 📄 Listar archivos de un subproducto
export const useSubproductFileList = (productId, subproductId) => {
  return useQuery({
    queryKey: ["subproduct-files", productId, subproductId],
    queryFn: () => listSubproductFiles(productId, subproductId),
    enabled: !!productId && !!subproductId,
  });
};

// 📤 Subir archivo al subproducto
export const useSubproductFileUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const queryClient = useQueryClient();

  const clearUploadError = useCallback(() => setUploadError(""), []);

  const uploadFiles = async (productId, subproductId, files) => {
    if (!productId || !subproductId || !Array.isArray(files) || files.length === 0) {
      setUploadError("Parámetros inválidos o sin archivos.");
      return false;
    }

    setUploading(true);
    setUploadError("");

    try {
      const { data, status } = await uploadSubproductFiles(productId, subproductId, files);

      if (status === 207 && data?.failed_files?.length) {
        setUploadError(
          `Falló la subida de: ${data.failed_files
            .map((f) => f.name || f)
            .join(", ")}`
        );
        return false;
      }

      const ok = status === 201 || status === 200;
      if (ok) {
        queryClient.invalidateQueries(["subproduct-files", productId, subproductId]);
      }
      return ok;
    } catch (err) {
      console.error("❌ Error subiendo archivo de subproducto:", err);
      setUploadError(err.message || "Error al subir archivo.");
      return false;
    } finally {
      setUploading(false);
    }
  };

  return {
    uploadFiles,
    uploading,
    uploadError,
    clearUploadError,
  };
};

// 🗑️ Eliminar archivo de subproducto
export const useSubproductFileDelete = () => {
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const queryClient = useQueryClient();

  const deleteFile = async (productId, subproductId, fileId) => {
    if (!productId || !subproductId || !fileId) {
      setDeleteError("Parámetros incompletos.");
      return false;
    }

    setDeleting(true);
    setDeleteError(null);

    try {
      await deleteSubproductFile(productId, subproductId, fileId);
      queryClient.invalidateQueries(["subproduct-files", productId, subproductId]);
      return true;
    } catch (err) {
      console.error("❌ Error al eliminar archivo de subproducto:", err);
      setDeleteError(err.message || "Error al eliminar archivo.");
      return false;
    } finally {
      setDeleting(false);
    }
  };

  return {
    deleting,
    deleteError,
    deleteFile,
  };
};

// 🔽 Descargar archivo protegido
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
    controllerRef.current?.abort();
  };

  return {
    downloading,
    downloadError,
    downloadFile,
    abortDownload,
  };
};
