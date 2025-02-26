import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { ExclamationCircleIcon } from "@heroicons/react/24/solid";

const ErrorMessage = ({ message = "Ocurrió un error inesperado", shouldReload = false }) => {
  useEffect(() => {
    let timer;
    if (shouldReload) {
      timer = setTimeout(() => {
        window.location.reload();
      }, 4000);
    }
    return () => clearTimeout(timer);
  }, [shouldReload]);

  return (
    <div
      className="flex items-center text-error-500 text-sm bg-error-100 p-2 rounded-md"
      role="alert"
      aria-live="assertive"
    >
      <ExclamationCircleIcon className="w-5 h-5 me-2" />
      <span>{message}</span>
    </div>
  );
};

ErrorMessage.propTypes = {
  message: PropTypes.string,
  shouldReload: PropTypes.bool,
};

export default ErrorMessage;
