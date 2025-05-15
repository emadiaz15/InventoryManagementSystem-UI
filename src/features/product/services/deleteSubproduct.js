import { axiosInstance } from "../../../services/api";

/**
 * Elimina (soft delete) un subproducto.
 * @param {number|string} product_pk - ID del producto padre.
 * @param {number|string} subp_pk - ID del subproducto a eliminar.
 * @returns {Promise<void>} - Promise resuelta al completar la eliminación.
 * @throws Error si la solicitud falla.
 */
export const deleteSubproduct = async (product_pk, subp_pk) => {
  if (!product_pk || !subp_pk) {
    throw new Error("Se requieren product_pk y subp_pk para eliminar un subproducto.");
  }

  try {
    await axiosInstance.delete(
      `/inventory/products/${product_pk}/subproducts/${subp_pk}/`
    );
  } catch (error) {
    console.error(
      "Error al eliminar subproducto:",
      error.response?.data || error.message
    );
    throw error;
  }
};
