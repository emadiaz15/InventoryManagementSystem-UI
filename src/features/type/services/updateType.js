// En updateType.js - Refinado
import { axiosInstance } from '../../../services/api';

export const updateType = async (typeId, updatedData) => {
  try {
    // Prepara los datos base que siempre quieres enviar si existen
    const dataToSend = {
      name: updatedData.name, // Asume que el modal envía el nombre actual
      description: updatedData.description, // Asume que el modal envía la descripción actual
    };

    // Añade la categoría solo si se proporcionó (y conviértela a Int)
    if (updatedData.category !== undefined && updatedData.category !== null && updatedData.category !== '') {
      dataToSend.category = parseInt(updatedData.category, 10);
       // Valida si el resultado es NaN si la conversión falla
       if (isNaN(dataToSend.category)) {
            console.error("Error: Category ID could not be parsed to Integer", updatedData.category);
            throw new Error("El ID de la categoría no es válido.");
       }
    } else {
         // Decide si enviar null o simplemente no enviar la key 'category'
         // dataToSend.category = null; // Opcional: si el backend lo espera para desasignar
    }


    // Añade el status SOLO si está presente explícitamente en updatedData
    // Esto es crucial para distinguir entre edición normal y soft delete
    if (updatedData.status === true || updatedData.status === false) {
      dataToSend.status = updatedData.status;
    }

    // Elimina propiedades undefined antes de enviar (opcional pero más limpio)
    Object.keys(dataToSend).forEach(key => dataToSend[key] === undefined && delete dataToSend[key]);


    console.log(` Enviando solicitud PUT a: /inventory/types/${typeId}/`);
    console.log(" Datos enviados (updateType):", dataToSend);

    const response = await axiosInstance.put(`/inventory/types/${typeId}/`, dataToSend);

    console.log("✅ Respuesta recibida (updateType):", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error al actualizar el tipo:", error.response?.data || error.message);
    if (error.response && error.response.data) {
        // Intenta devolver errores más específicos si el backend los provee
        const errorData = error.response.data;
        let errorMessage = "Error al actualizar el tipo.";
        if (typeof errorData === 'object' && errorData !== null) {
            // Intenta extraer errores por campo (común en DRF)
            const fieldErrors = Object.entries(errorData)
                                    .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
                                    .join('; ');
            if (fieldErrors) errorMessage = fieldErrors;
            else if (errorData.detail) errorMessage = errorData.detail; // Error general de 'detail'
        } else if (typeof errorData === 'string') {
            errorMessage = errorData; // Si la respuesta es solo un string
        }
       throw new Error(errorMessage);
    } else {
      throw new Error('Error en la conexión o en el servidor.');
    }
  }
};

export default updateType;