import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { ExclamationCircleIcon } from "@heroicons/react/24/solid";

const ErrorMessage = ({ message = "Ocurrió un error inesperado", shouldReload = false }) => {
  useEffect(() => {
    if (shouldReload) {
      // Forzar el reload de la página aquí
      window.location.reload();
    }
  }, [shouldReload]);

  return (
    <div
      className="flex items-center text-error-500 text-sm bg-error-100 p-2 rounded-md"
      role="alert"
      aria-live="assertive"
    >
      <ExclamationCircleIcon className="size-5 me-2" />
      <span>{message}</span>
    </div>
  );
};

// Validación de tipos para las props
ErrorMessage.propTypes = {
  message: PropTypes.string,
  shouldReload: PropTypes.bool,
};

export default ErrorMessage;
