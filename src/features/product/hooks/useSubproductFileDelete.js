import { useState } from "react";
import { axiosInstance } from "../../../services/api";

/**
 * Hook para eliminar un archivo multimedia de un subproducto.
 */
export const useSubproductFileDelete = () => {
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  const deleteFile = async (productId, subproductId, fileId) => {
    setDeleting(true);
    setDeleteError(null);

    try {
      await axiosInstance.delete(
        `/inventory/products/${productId}/subproducts/${subproductId}/files/${fileId}/delete/`
      );
      return true;
    } catch (err) {
      console.error("❌ Error al eliminar archivo:", err);
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
