import { useState } from "react";

/**
 * Hook para manejar mensajes de éxito y error, con control de tiempo y tipo.
 */
const useSuccess = ({ timeout = 3000 } = {}) => {
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState(null);

  /**
   * Muestra mensaje de éxito durante un tiempo controlado
   * @param {string} message - Texto del mensaje
   */
  const handleSuccess = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(""), timeout);
  };

  /**
   * Interpreta errores comunes de API y genera mensaje de error
   * @param {any} err - Error recibido desde catch()
   */
  const handleError = (err) => {
    console.error("❌ Error:", err);

    if (err?.response?.data) {
      const data = err.response.data;

      if (data.name?.[0]?.includes("ya existe")) {
        setError("El nombre ya existe. Debe ser único.");
        return;
      }

      if (data.detail) {
        setError(data.detail);
        return;
      }

      if (typeof data === "object") {
        const messages = Object.values(data).flat().join(" ");
        setError(messages);
        return;
      }
    }

    setError(err.message || "Ocurrió un error inesperado.");
  };

  const clear = () => {
    setError(null);
    setSuccessMessage("");
  };

  return {
    successMessage,
    error,
    handleSuccess,
    handleError,
    clear,
  };
};

export default useSuccess;
