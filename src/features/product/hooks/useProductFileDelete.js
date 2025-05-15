import { useState } from "react";
import { deleteProductFile } from "../services/deleteProductFiles";

/**
 * Hook para eliminar un archivo multimedia asociado a un producto.
 */
export const useProductFileDelete = () => {
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  const deleteFile = async (productId, fileId) => {
    setDeleting(true);
    setDeleteError(null);

    try {
      await deleteProductFile(productId, fileId);
      return true;
    } catch (err) {
      console.error("❌ Error en useProductFileDelete:", err);
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
