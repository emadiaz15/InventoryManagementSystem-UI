import React, { useState } from 'react';

const ActionButtonWithModal = ({ buttonText, children, onSave }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true); // Abrir el modal
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // Cerrar el modal
  };

  const handleSave = (data) => {
    if (onSave) onSave(data); // Ejecutar la función onSave si está presente
    setIsModalOpen(false); // Cerrar el modal después de guardar
  };

  return (
    <div>
      <button
        onClick={handleOpenModal}
        type="button"
        className="bg-primary-500 text-text-white py-2 px-4 rounded hover:bg-primary-600 focus:outline-none focus:ring-4 focus:ring-primary-500 transition-colors"
      >
        {buttonText}
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-background-100 p-6 rounded shadow-md w-1/2">
            {React.cloneElement(children, {
              onClose: handleCloseModal,
              onSave: handleSave,
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ActionButtonWithModal;
