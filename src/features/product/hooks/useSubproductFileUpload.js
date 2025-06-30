import { useState } from "react";
import { uploadSubproductFile } from "../services/uploadSubproductFile"; // Asegúrate de crearlo si no existe

/**
 * Hook para subir múltiples archivos a un subproducto.
 */
export const useSubproductFileUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const clearUploadError = () => setUploadError("");

  const uploadFiles = async (productId, subproductId, files) => {
    if (!productId || !subproductId || !Array.isArray(files) || files.length === 0) {
      setUploadError("Parámetros inválidos o sin archivos.");
      return false;
    }

    setUploading(true);
    setUploadError("");

    try {
      const { success, failed } = await uploadSubproductFile(productId, subproductId, files);

      if (failed.length > 0) {
        const names = failed.map(f => f.file?.name || "desconocido");
        setUploadError(`Falló la subida de: ${names.join(", ")}`);
        return false;
      }

      return success;
    } catch (err) {
      console.error("❌ Error subiendo archivos de subproducto:", err.response?.data || err.message);
      setUploadError(err.message || "Error al subir archivos.");
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

export default useSubproductFileUpload;
