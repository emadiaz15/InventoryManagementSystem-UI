import { useState, useEffect } from "react";
import { axiosInstance } from "../../../services/api";

/**
 * Hook para listar archivos multimedia asociados a un subproducto.
 */
export const useSubproductFileList = (productId, subproductId) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState(null);

  const fetchFiles = async () => {
    setLoading(true);
    setListError(null);

    try {
      const res = await axiosInstance.get(
        `/inventory/products/${productId}/subproducts/${subproductId}/files/`
      );
      setFiles(res.data);
    } catch (err) {
      console.error("❌ Error al listar archivos de subproducto:", err);
      setListError(err.message || "Error al obtener archivos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (productId && subproductId) fetchFiles();
  }, [productId, subproductId]);

  return {
    files,
    loading,
    listError,
    refreshFiles: fetchFiles,
  };
};
