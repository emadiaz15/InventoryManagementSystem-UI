// src/hooks/useProductImageUpload.js
import { useState } from "react";
import { createProductFolder } from "../services/createProductFolder";
import { uploadProductImage } from "../services/uploadProductImage";

/**
 * Hook para subir múltiples imágenes de producto a su carpeta en GDrive
 */
export const useProductImageUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  /**
   * Sube imágenes a GDrive creando primero la carpeta si es necesario
   * @param {string|number} productId
   * @param {File[]} imagesArray
   * @returns {Promise<boolean>} true si todo ok, false si falló
   */
  const uploadImages = async (productId, imagesArray) => {
    if (!productId || !Array.isArray(imagesArray) || imagesArray.length === 0) {
      setUploadError("No hay imágenes para subir.");
      return false;
    }

    if (imagesArray.length > 5) {
      setUploadError("Máximo 5 imágenes permitidas.");
      return false;
    }

    setUploading(true);
    setUploadError(null);

    try {
      await createProductFolder(productId);

      const uploadResults = await Promise.allSettled(
        imagesArray.map((img) => uploadProductImage(productId, img))
      );

      const failedUploads = uploadResults.filter(result => result.status === "rejected");

      if (failedUploads.length > 0) {
        throw new Error(`${failedUploads.length} imagen(es) no se pudieron subir.`);
      }

      return true;
    } catch (err) {
      console.error("❌ Error en useProductImageUpload:", err);
      setUploadError(err.message || "Error al subir imágenes.");
      return false;
    } finally {
      setUploading(false);
    }
  };

  return {
    uploading,
    uploadError,
    uploadImages,
  };
};
