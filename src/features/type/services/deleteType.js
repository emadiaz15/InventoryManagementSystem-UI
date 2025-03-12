import { axiosInstance } from "../../../services/api"; // Asegúrate de importar correctamente

// Servicio para eliminar un tipo (cambio de estado a false)
export const deleteType = async (typeId) => {
  try {
    // Crear el objeto con los datos que se enviarán al backend para "eliminar" el tipo (soft delete)
    const dataToSend = {
      status: false, // Cambiar el estado a false para indicar que el tipo está eliminado
    };

    // Mostrar en la consola los datos antes de enviarlos (útil para depuración)
    console.log("📡 Enviando solicitud de eliminación:", dataToSend);

    // Realizar la solicitud PUT a la API (usamos PUT para modificar el tipo existente)
    const response = await axiosInstance.put(`/inventory/types/${typeId}/`, dataToSend);

    // Mostrar en la consola la respuesta recibida de la API
    console.log("✅ Respuesta recibida:", response.data);
    return response.data; // Retornar los datos recibidos como respuesta
  } catch (error) {
    // Mostrar el error en la consola
    console.error("❌ Error al eliminar el tipo:", error.response?.data || error.message);

    // Manejo de errores detallado: Si la respuesta contiene un mensaje de error, mostrarlo
    if (error.response && error.response.data) {
      const errorDetail = error.response.data.detail || 'Error al eliminar el tipo.';
      throw new Error(errorDetail);
    } else {
      throw new Error('Error en la conexión o en el servidor.');
    }
  }
};

export default deleteType;
