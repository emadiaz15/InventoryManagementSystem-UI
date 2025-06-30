import { djangoApi } from "@/api/clients";

/**
 * 🗑️ Elimina (soft delete) un subproducto.
 * @param {number|string} product_pk - ID del producto padre.
 * @param {number|string} subp_pk - ID del subproducto a eliminar.
 * @returns {Promise<void>} - Lanza error si la solicitud falla.
 */
export const deleteSubproduct = async (product_pk, subp_pk) => {
  if (!product_pk || !subp_pk) {
    throw new Error("Se requieren product_pk y subp_pk para eliminar un subproducto.");
  }

  try {
    await djangoApi.delete(`/inventory/products/${product_pk}/subproducts/${subp_pk}/`);
  } catch (error) {
    const detail =
      error.response?.data?.detail ||
      JSON.stringify(error.response?.data) ||
      "No se pudo eliminar el subproducto.";

    console.error("❌ Error al eliminar subproducto:", detail);
    throw new Error(detail);
  }
};

export default {
  deleteSubproduct,
};
