import { djangoApi } from "@/api/clients";

/**
 * ✏️ Servicio para actualizar una categoría existente.
 */
export const updateCategory = async (categoryId, updatedData) => {
  try {
    const dataToSend = {
      name: updatedData.name?.trim(),
      description: updatedData.description?.trim() || '',
      status: updatedData.status
    };

    const response = await djangoApi.put(`/inventory/categories/${categoryId}/`, dataToSend);

    return response.data;

  } catch (error) {
    const backendError = error.response?.data;

    if (backendError?.name?.length) {
      throw new Error(backendError.name[0]);
    }
    if (backendError?.detail) {
      throw new Error(backendError.detail);
    }

    console.error("❌ Error al actualizar la categoría:", backendError || error.message);
    throw new Error("No se pudo actualizar la categoría.");
  }
};

export default updateCategory;
