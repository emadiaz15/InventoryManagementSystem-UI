import { axiosInstance } from '../../../services/api';

// Servicio para actualizar un tipo (incluyendo el status)
export const updateType = async (typeId, updatedData) => {
  try {
    // Asegurar que se envían todos los campos requeridos por el backend
    const dataToSend = {
      name: updatedData.name || "",  // Evita valores null
      description: updatedData.description || "",
      category: updatedData.category ? parseInt(updatedData.category, 10) : null, // Asegura que la categoría sea un número válido
      status: updatedData.status,    // Asegurar que el estado es enviado
    };

    console.log(`📡 Enviando solicitud a: /inventory/types/${typeId}/`);
    console.log("🔹 Datos enviados:", dataToSend);

    const response = await axiosInstance.put(`/inventory/types/${typeId}/`, dataToSend);

    console.log("✅ Respuesta recibida:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error al actualizar el tipo:", error.response?.data || error.message);

    // Manejo de errores detallado:
    if (error.response && error.response.data) {
      const errorDetail = error.response.data.detail || 'Error al actualizar el tipo.';
      throw new Error(errorDetail);
    } else {
      throw new Error('Error en la conexión o en el servidor.');
    }
  }
};

export default updateType;
