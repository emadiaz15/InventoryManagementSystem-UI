import { useState, useEffect, useCallback } from "react";
import { listSubproductFiles } from "../services/listSubproductFile";

/**
 * Hook para listar archivos multimedia asociados a un subproducto.
 *
 * @param {string|number} productId
 * @param {string|number} subproductId
 */
export const useSubproductFileList = (productId, subproductId) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState(null);

  const fetchFiles = useCallback(async () => {
    if (!productId || !subproductId) return;

    setLoading(true);
    setListError(null);

    try {
      const result = await listSubproductFiles(productId, subproductId);
      setFiles(result);
    } catch (err) {
      console.error("❌ Error al listar archivos de subproducto:", err);
      setListError(err.message || "Error al obtener archivos.");
    } finally {
      setLoading(false);
    }
  }, [productId, subproductId]);

  useEffect(() => {
    fetchFiles();
  }, [productId, subproductId, fetchFiles]);

  return {
    files,
    loading,
    listError,
    refreshFiles: fetchFiles,
  };
};
