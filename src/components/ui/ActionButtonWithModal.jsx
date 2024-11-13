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
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300"
        type="button"
      >
        {buttonText}
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-md w-1/2">
            {React.cloneElement(children, { onClose: handleCloseModal, onSave: handleSave })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ActionButtonWithModal;
