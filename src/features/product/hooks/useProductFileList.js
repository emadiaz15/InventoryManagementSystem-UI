import { useState, useEffect } from "react";
import { listProductFiles } from "../services/listProductFiles";

/**
 * Hook para listar los archivos (imágenes/videos) asociados a un producto.
 * @param {string} productId
 */
export const useProductFileList = (productId) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState(null);

  const fetchFiles = async () => {
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
  };

  useEffect(() => {
    if (productId) fetchFiles();
  }, [productId]);

  return {
    files,
    loading,
    listError,
    refreshFiles: fetchFiles,
  };
};
