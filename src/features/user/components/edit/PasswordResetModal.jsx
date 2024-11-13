// src/components/edit/PasswordResetModal.jsx
import React, { useState } from 'react';
import Modal from '../../../../components/ui/Modal';
import FormInput from '../../../../components/forms/FormInput';

const PasswordResetModal = ({ userId, onClose, onSave }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    try {
      await onSave(userId, { password });
      onClose();
    } catch (error) {
      setError(error.message || 'Error al cambiar la contraseña');
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose} title="Restablecer Contraseña">
      <form onSubmit={handleSubmit}>
        {error && <p className="text-red-500 mb-4">{error}</p>}

        <FormInput
          label="Nueva Contraseña"
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        
        <FormInput
          label="Confirmar Nueva Contraseña"
          type="password"
          name="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <div className="flex justify-end space-x-2 mt-4">
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-500 text-white py-2 px-4 rounded"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded"
          >
            Guardar
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default PasswordResetModal;
