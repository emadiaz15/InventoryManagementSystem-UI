import { useState, useEffect, useCallback } from "react";
import { listProductFiles } from "../services/listProductFile"; // singular recomendado

/**
 * Hook para listar los archivos (imágenes/videos) asociados a un producto.
 *
 * @param {string|number} productId - ID del producto
 */
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
