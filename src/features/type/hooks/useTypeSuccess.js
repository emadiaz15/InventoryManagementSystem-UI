import { useState } from "react";

const useTypeSuccess = () => {
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState(null);

  const handleTypeSuccess = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const handleTypeError = (err) => {
    console.error("Error:", err);
    if (err.response?.data?.name) {
      setError("El nombre del tipo ya existe. Debe ser único.");
    } else {
      setError("Hubo un problema al actualizar el tipo. Inténtalo de nuevo.");
    }
  };

  return { successMessage, error, handleTypeSuccess, handleTypeError };
};

export default useTypeSuccess;