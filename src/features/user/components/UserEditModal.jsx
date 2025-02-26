// src/features/user/components/UserEditModal.jsx
import React, { useState, useEffect } from 'react';
import Modal from '../../../components/ui/Modal';
import FormInput from '../../../components/ui/form/FormInput';
import FormCheckbox from '../../../components/ui/form/FormCheckbox';
import SuccessMessage from '../../../components/common/SuccessMessage';
import PasswordResetModal from './PasswordResetModal';

const UserEditModal = ({ user, isOpen, onClose, onSave, onPasswordReset }) => {
  const [formData, setFormData] = useState({
    username: user.username,
    name: user.name,
    last_name: user.last_name,
    email: user.email,
    dni: user.dni,
    is_active: user.is_active,
    is_staff: user.is_staff,
    password: '',
    confirmPassword: '',
  });
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Actualiza los datos del formulario cuando el usuario cambia
  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username,
        name: user.name,
        last_name: user.last_name,
        email: user.email,
        dni: user.dni,
        is_active: user.is_active,
        is_staff: user.is_staff,
        password: '',
        confirmPassword: '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const validateForm = () => {
    if (formData.password && formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setError('');
    try {
      await onSave(user.id, formData);
      setSuccessMessage('Usuario actualizado con éxito');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err.message || 'Error al actualizar el usuario');
    }
  };

  const handleRestorePassword = () => {
    setShowPasswordModal(true);
  };

  const handleSaveNewPassword = async (userId, newPasswordData) => {
    try {
      await onPasswordReset(userId, newPasswordData);
      setSuccessMessage('Contraseña cambiada exitosamente');
      setShowPasswordModal(false);
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (err) {
      setError('Error al cambiar la contraseña');
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="Editar Usuario">
        <form onSubmit={handleSubmit}>
          {error && <p className="text-error-500 mb-4">{error}</p>}

          <FormInput
            label="Nombre de usuario"
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
          />
          <FormInput
            label="Nombre"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
          <FormInput
            label="Apellido"
            type="text"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
          />
          <FormInput
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          <FormInput
            label="DNI"
            type="text"
            name="dni"
            value={formData.dni}
            onChange={handleChange}
          />

          <FormCheckbox
            label="Activo"
            name="is_active"
            checked={formData.is_active}
            onChange={handleChange}
          />

          <FormCheckbox
            label="Administrador"
            name="is_staff"
            checked={formData.is_staff}
            onChange={handleChange}
          />

          <FormInput
            label="Nueva Contraseña"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
          <FormInput
            label="Confirmar Nueva Contraseña"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
          />

          <div className="flex justify-end space-x-2 mt-4">
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
            <button
              type="button"
              onClick={handleRestorePassword}
              className="bg-warning-500 text-white py-2 px-4 rounded hover:bg-warning-600 transition-colors"
            >
              Restaurar Contraseña
            </button>
          </div>
        </form>
      </Modal>

      <SuccessMessage
        message={successMessage}
        onClose={() => setSuccessMessage('')}
      />

      {showPasswordModal && (
        <PasswordResetModal
          userId={user.id}
          isOpen={showPasswordModal}
          onClose={() => setShowPasswordModal(false)}
          onSave={handleSaveNewPassword}
        />
      )}
    </>
  );
};

export default UserEditModal;
