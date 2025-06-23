import { useState } from "react";
import { deleteSubproductFile } from "../services/deleteSubproductFile";

/**
 * Hook para eliminar un archivo multimedia asociado a un subproducto.
 */
export const useSubproductFileDelete = () => {
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  const deleteFile = async (productId, subproductId, fileId) => {
    if (!productId || !subproductId || !fileId) {
      setDeleteError("Parámetros incompletos.");
      return false;
    }

    setDeleting(true);
    setDeleteError(null);

    try {
      await deleteSubproductFile(productId, subproductId, fileId);
      return true;
    } catch (err) {
      console.error("❌ Error al eliminar archivo del subproducto:", err);
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
