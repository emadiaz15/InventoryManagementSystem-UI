// src/components/common/ActionButtonWithModal.jsx
import React, { useState } from 'react';
import { PlusCircleIcon } from '@heroicons/react/24/solid';

const ActionButtonWithModal = ({ children, onSave }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSave = (data) => {
    if (onSave) onSave(data);
    setIsModalOpen(false);
  };

  return (
    <div>
      <button
        onClick={handleOpenModal}
        type="button"
        className="bg-primary-500 text-text-white p-2 rounded hover:bg-primary-600 focus:outline-none focus:ring-4 focus:ring-primary-500 transition-colors"
      >
        <PlusCircleIcon className="w-6 h-6" />
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
