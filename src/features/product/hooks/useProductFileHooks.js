import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  listProductFiles,
  uploadFileProduct,
  deleteProductFile,
} from "@/features/product/services/products/files";
import { fetchProtectedFile } from "@/services/files/fileAccessService";

// ─────────────────────────────────────────────────────────────
// 📥 useProductFileList
// ─────────────────────────────────────────────────────────────
export const useProductFileList = (productId) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState(null);

  const fetchFiles = useCallback(async () => {
    if (!productId) return;

    setLoading(true);
    setListError(null);

    try {
      const result = await listProductFiles(productId);
      setFiles(result);
    } catch (err) {
      console.error("❌ Error al listar archivos:", err);
      setListError(err.message || "Error al obtener archivos.");
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchFiles();
  }, [productId, fetchFiles]);

  return {
    files,
    loading,
    listError,
    refreshFiles: fetchFiles,
  };
};

// ─────────────────────────────────────────────────────────────
// 📤 useProductFileUpload
// ─────────────────────────────────────────────────────────────
export const useProductFileUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [failedFiles, setFailedFiles] = useState([]);

  const uploadFiles = async (productId, filesArray) => {
    if (!productId || !Array.isArray(filesArray) || filesArray.length === 0) {
      setUploadError("No hay archivos para subir.");
      return false;
    }

    if (filesArray.length > 5) {
      setUploadError("Máximo 5 archivos permitidos.");
      return false;
    }

    setUploading(true);
    setUploadError(null);
    setFailedFiles([]);

    try {
      const { data, status } = await uploadFileProduct(productId, filesArray);

      if (status === 207 && data?.failed_files?.length) {
        setUploadError(
          `Falló la subida de: ${data.failed_files
            .map((f) => f.name || f)
            .join(", ")}`
        );
        setFailedFiles(data.failed_files);
        return false;
      }

      return status === 201 || status === 200;
    } catch (err) {
      console.error("❌ Error al subir archivos:", err);
      setUploadError(err.message || "Error al subir archivos.");
      return false;
    } finally {
      setUploading(false);
    }
  };

  const clearUploadError = useCallback(() => {
    setUploadError(null);
  }, []);

  return {
    uploading,
    uploadError,
    failedFiles,
    uploadFiles,
    clearUploadError,
  };
};

// ─────────────────────────────────────────────────────────────
// 🗑️ useProductFileDelete
// ─────────────────────────────────────────────────────────────
export const useProductFileDelete = () => {
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  const deleteFile = async (productId, fileId) => {
    if (!productId || !fileId) {
      setDeleteError("ID de producto y archivo requeridos.");
      return false;
    }

    setDeleting(true);
    setDeleteError(null);

    try {
      await deleteProductFile(productId, fileId);
      return true;
    } catch (err) {
      console.error("❌ Error al eliminar archivo:", err);
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

// ─────────────────────────────────────────────────────────────
// 🔽 useDownloadProductFile
// ─────────────────────────────────────────────────────────────
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

// ─────────────────────────────────────────────────────────────
// 🎨 useEnrichedProductFiles
// ─────────────────────────────────────────────────────────────
const getFileId = (file) => {
  if (!file) return "";
  return file.key || file.id || "";
};

export const useEnrichedProductFiles = (productId, rawFiles = []) => {
  const files = useMemo(() => {
    if (!productId || !Array.isArray(rawFiles)) return [];
    return rawFiles
      .filter((f) => f.url)
      .map((f) => ({
        ...f,
        id: getFileId(f),
        url: f.url,
        filename: f.name || f.filename || "archivo",
        contentType: f.mimeType || f.contentType || "application/octet-stream",
      }));
  }, [productId, rawFiles]);

  return {
    files,
    loading: false,
    loadError: null,
    refresh: () => {},
  };
};
