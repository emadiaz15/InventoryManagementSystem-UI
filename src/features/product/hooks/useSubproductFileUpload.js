import { useState } from "react";
import { axiosInstance } from "../../../services/api";

export const useSubproductFileUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const clearUploadError = () => setUploadError("");

  const uploadFiles = async (productId, subproductId, files) => {
    setUploading(true);
    setUploadError("");
    try {
      const data = new FormData();
      files.forEach((f) => data.append("file", f));
      await axiosInstance.post(
        `/inventory/products/${productId}/subproducts/${subproductId}/files/upload/`,
        data,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      return true;
    } catch (err) {
      console.error("❌ Error subiendo archivos de subproducto:", err.response?.data || err.message);
      const detail = err.response?.data?.detail || "Error al subir archivos";
      setUploadError(detail);
      return false;
    } finally {
      setUploading(false);
    }
  };

  return { uploadFiles, uploading, uploadError, clearUploadError };
};

export default useSubproductFileUpload;
