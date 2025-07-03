import { useState, useCallback } from "react";
import { uploadFileProduct } from "../services/uploadFileProduct"; 

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
        await uploadFileProduct(productId, file);
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
