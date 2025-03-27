import React from 'react';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-background-100 p-6 rounded shadow-md w-full max-w-full sm:max-w-lg mx-4 sm:mx-auto relative transition-colors">
        {/* Botón de cerrar */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-text-secondary hover:text-text-primary focus:outline-none"
          aria-label="Close modal"
        >
          &times;
        </button>
        {/* Título del modal, si se proporciona */}
        {title && <h2 className="text-2xl mb-4 text-text-primary">{title}</h2>}
        {/* Contenido del modal */}
        <div className="text-text-primary">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
