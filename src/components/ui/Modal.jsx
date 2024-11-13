// src/components/ui/Modal.jsx
import React from 'react';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null; // Si no está abierto, no renderizar nada

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-lg mx-4">
        {/* Título del modal, si se proporciona */}
        {title && <h2 className="text-2xl mb-4">{title}</h2>}
        
        {/* Contenido del modal */}
        <div>{children}</div>
        
        {/* Botón de cerrar */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 focus:outline-none"
          aria-label="Close modal"
        >
          &times;
        </button>
      </div>
    </div>
  );
};

export default Modal;
