import { useState } from "react";

const useSuccess = () => {
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState(null);

  const handleSuccess = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const handleError = (err) => {
    console.error("Error:", err);
    if (err.response?.data?.name) {
      setError("El nombre de la categoría ya existe. Debe ser único.");
    } else {
      setError("Hubo un problema al actualizar la categoría. Inténtalo de nuevo.");
    }
  };

  return { successMessage, error, handleSuccess, handleError };
};

export default useSuccess;
