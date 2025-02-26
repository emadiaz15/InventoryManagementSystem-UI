// src/components/edit/PasswordResetModal.jsx
import React, { useState } from 'react';
import Modal from '../../../components/ui/Modal';
import FormInput from '../../../components/ui/form/FormInput';

const PasswordResetModal = ({ userId, isOpen, onClose, onSave }) => {
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
    } catch (err) {
      setError(err.message || 'Error al cambiar la contraseña');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Restablecer Contraseña">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-error-500">{error}</p>}

        <FormInput
          label="Nueva Contraseña"
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
        />

        <FormInput
          label="Confirmar Nueva Contraseña"
          type="password"
          name="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
        />

        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onClose}
            className="bg-neutral-500 text-white py-2 px-4 rounded hover:bg-neutral-600 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="bg-primary-500 text-white py-2 px-4 rounded hover:bg-primary-600 transition-colors"
          >
            Guardar
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default PasswordResetModal;
