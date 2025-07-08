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

    const failed = [];

    for (const file of filesArray) {
      try {
        await uploadFileProduct(productId, [file]);
      } catch (err) {
        console.error("❌ Error al subir archivo:", file.name, err);
        failed.push(file);
      }
    }

    if (failed.length > 0) {
      setUploadError(`Falló la subida de: ${failed.map(f => f.name).join(", ")}`);
      setFailedFiles(failed);
      setUploading(false);
      return false;
    }

    setUploading(false);
    return true;
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
