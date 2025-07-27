/*
src/hooks/useSuccess.js
Hook para manejar mensajes de éxito y error en una aplicación React.
Permite mostrar mensajes de éxito temporales y manejar errores de API con mensajes claros.
*/

import { useState, useRef, useCallback, useEffect } from "react";

/**
 * Hook para manejar mensajes de éxito y error, con control de tiempo y tipo.
 */
const useSuccess = ({ timeout = 3000 } = {}) => {
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState(null);

  // Guardamos el timer para limpiarlo si el componente se desmonta antes
  const timerRef = useRef(null);

  // Limpia el timer al desmontar
  useEffect(() => {
    return () => {
      clearTimeout(timerRef.current);
    };
  }, []);

  /**
   * Muestra mensaje de éxito durante un tiempo controlado
   * @param {string} message - Texto del mensaje
   */
  const handleSuccess = useCallback((message) => {
    setSuccessMessage(message);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setSuccessMessage("");
    }, timeout);
  }, [timeout]);

  /**
   * Interpreta errores comunes de API y genera mensaje de error
   * @param {any} err - Error recibido desde catch()
   */
  const handleError = useCallback((err) => {
    console.error("❌ Error:", err);

    // Axios-like error shape
    const data = err?.response?.data;
    if (data) {
      // Validación de unicidad
      if (Array.isArray(data.name) && data.name[0]?.includes("ya existe")) {
        setError("El nombre ya existe. Debe ser único.");
        return;
      }
      // Mensaje genérico en .detail
      if (typeof data.detail === "string") {
        setError(data.detail);
        return;
      }
      // Cualquier otro objeto: concatenar valores
      if (typeof data === "object") {
        const msgs = Object.values(data)
          .flat()
          .map((m) => (typeof m === "string" ? m : JSON.stringify(m)))
          .join(" ");
        setError(msgs);
        return;
      }
    }

    // Fallback simple
    setError(err.message || "Ocurrió un error inesperado.");
  }, []);

  /**
   * Limpia mensajes de éxito y error
   */
  const clear = useCallback(() => {
    clearTimeout(timerRef.current);
    setSuccessMessage("");
    setError(null);
  }, []);

  return {
    successMessage,
    error,
    handleSuccess,
    handleError,
    clear,
  };
};

export default useSuccess;
