import { useState } from "react";
import { uploadProductFiles } from "../services/uploadProductFiles";

/**
 * 🧠 Hook para subir múltiples archivos multimedia (imágenes/videos) al producto
 */
export const useProductFileUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [failedFiles, setFailedFiles] = useState([]);

  /**
   * Sube archivos multimedia a GDrive, creando la carpeta si no existe
   * @param {string|number} productId
   * @param {File[]} filesArray
   * @returns {Promise<boolean>} true si todo ok, false si falló alguno
   */
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
      const { success, failed } = await uploadProductFiles(productId, filesArray);

      if (failed && failed.length > 0) {
        const names = failed.map(f => f.file?.name || "archivo_desconocido");
        setUploadError(`Falló la subida de: ${names.join(', ')}`);
        setFailedFiles(failed);
        return false;
      }

      return true;
    } catch (err) {
      console.error("❌ Error en useProductFileUpload:", err);
      setUploadError("Error inesperado al subir archivos.");
      return false;
    } finally {
      setUploading(false);
    }
  };

  /**
   * Limpia el mensaje de error de subida
   */
  const clearUploadError = () => {
    setUploadError(null);
  };

  return {
    uploading,
    uploadError,
    failedFiles,
    uploadFiles,
    clearUploadError,
  };
};
