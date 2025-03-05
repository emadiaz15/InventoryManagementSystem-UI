import { axiosInstance } from '../../../services/api';

// Servicio para actualizar una categoría (incluyendo el status)
export const updateCategory = async (categoryId, updatedData) => {
  try {
    // Asegurar que se envían todos los campos requeridos por el backend
    const dataToSend = {
      name: updatedData.name || "",  // Evita null en el backend
      description: updatedData.description || "",
      status: updatedData.status,    // Asegurar que el estado es enviado
    };

    const response = await axiosInstance.put(`/inventory/categories/${categoryId}/`, dataToSend);

    return response.data; // Devuelve los datos actualizados de la categoría
  } catch (error) {
    console.error('Error al actualizar la categoría:', error.response?.data || error.message);

    // Manejo de errores detallado:
    if (error.response && error.response.data) {
      const errorDetail = error.response.data.detail || 'Error al actualizar la categoría.';
      throw new Error(errorDetail);
    } else {
      throw new Error('Error en la conexión o en el servidor.');
    }
  }
};

export default updateCategory;
