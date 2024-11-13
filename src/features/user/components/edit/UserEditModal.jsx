import React, { useState } from 'react';
import Modal from '../../../../components/ui/Modal';
import FormInput from '../../../../components/forms/FormInput';
import FormCheckbox from '../../../../components/forms/FormCheckbox'; // Importamos el componente reutilizable de checkbox
import SuccessMessage from '../../../../components/ui/SuccessMessage';
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

    try {
      await onSave(user.id, formData);
      setSuccessMessage('Usuario actualizado con éxito');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setError(error.message || 'Error al actualizar el usuario');
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
    } catch (error) {
      setError('Error al cambiar la contraseña');
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="Editar Usuario">
        <form onSubmit={handleSubmit}>
          {error && <p className="text-red-500 mb-4">{error}</p>}

          {/* Campos de entrada del formulario */}
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

          {/* Checkbox para estado activo */}
          <FormCheckbox
            label="Activo"
            name="is_active"
            checked={formData.is_active}
            onChange={handleChange}
          />

          {/* Checkbox para rol de administrador */}
          <FormCheckbox
            label="Administrador"
            name="is_staff"
            checked={formData.is_staff}
            onChange={handleChange}
          />

          {/* Campos para cambio de contraseña */}
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

          {/* Botones de acción */}
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
            <button
              type="button"
              onClick={handleRestorePassword}
              className="bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600"
            >
              Restaurar Contraseña
            </button>
          </div>
        </form>
      </Modal>

      {/* Mensaje de éxito */}
      <SuccessMessage
        message={successMessage}
        onClose={() => setSuccessMessage('')}
      />

      {/* Modal para restablecimiento de contraseña */}
      {showPasswordModal && (
        <PasswordResetModal
          userId={user.id}
          onClose={() => setShowPasswordModal(false)}
          onSave={handleSaveNewPassword}
        />
      )}
    </>
  );
};

export default UserEditModal;
