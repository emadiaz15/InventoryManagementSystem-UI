import React, { useEffect } from 'react';

const SuccessMessage = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(); // Cerrar automáticamente después de 5 segundos
    }, 4000);

    return () => clearTimeout(timer); // Limpiar el temporizador cuando el componente se desmonte
  }, [onClose]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-green-500 text-white p-4 rounded shadow-md">
        {message}
      </div>
    </div>
  );
};

export default SuccessMessage;
