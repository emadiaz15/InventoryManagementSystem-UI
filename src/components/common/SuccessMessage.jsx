import React, { useEffect } from 'react';

const SuccessMessage = ({ message, onClose, shouldReload = false }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(); // Cerrar automáticamente después de 4 segundos
      if (shouldReload) {
        // Forzar el reload de la página aquí
        window.location.reload();
      }
    }, 4000);

    return () => clearTimeout(timer); // Limpiar el temporizador cuando el componente se desmonte
  }, [onClose, shouldReload]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-success-500 text-white p-4 rounded-4xl shadow-md">
        {message}
      </div>
    </div>
  );
};

export default SuccessMessage;
