// src/components/ui/ErrorMessage.jsx
import React from 'react';
import PropTypes from 'prop-types';

const ErrorMessage = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="flex items-center justify-between p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg shadow-md" role="alert">
      <span>{message}</span>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="ml-2 text-red-500 hover:text-red-700 focus:outline-none"
        >
          &times;
        </button>
      )}
    </div>
  );
};

ErrorMessage.propTypes = {
  message: PropTypes.string.isRequired, // Mensaje a mostrar
  onClose: PropTypes.func,             // Función opcional para cerrar el mensaje
};

ErrorMessage.defaultProps = {
  onClose: null, // Si no se proporciona una función, no se muestra el botón de cerrar
};

export default ErrorMessage;