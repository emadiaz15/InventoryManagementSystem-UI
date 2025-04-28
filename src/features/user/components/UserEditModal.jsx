import React, { useState, useEffect, useCallback } from 'react';
import Modal from '../../../components/ui/Modal';
import FormInput from '../../../components/ui/form/FormInput';
import FormCheckbox from '../../../components/ui/form/FormCheckbox';
import ErrorMessage from '../../../components/common/ErrorMessage';
import PasswordResetModal from './PasswordResetModal';

const UserEditModal = ({ user, isOpen, onClose, onSave, onSaveSuccess, onPasswordReset }) => {
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    last_name: '',
    email: '',
    dni: '',
    image: null,
    is_staff: false,
  });

  const [internalLoading, setInternalLoading] = useState(false);
  const [internalError, setInternalError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  useEffect(() => {
    if (isOpen && user) {
      setFormData({
        username: user.username || '',
        name: user.name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        dni: user.dni || '',
        image: null,
        is_staff: user.is_staff || false,
      });
      setInternalError('');
      setValidationErrors({});
    }
  }, [isOpen, user]);

  const handleChange = useCallback((e) => {
    const { name, type, value, checked, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'file' ? files[0] : value,
    }));
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setInternalError('');
    setValidationErrors({});

    const errors = {};
    if (!formData.username.trim()) errors.username = 'El nombre de usuario es obligatorio.';
    if (!formData.name.trim()) errors.name = 'El nombre es obligatorio.';
    if (!formData.last_name.trim()) errors.last_name = 'El apellido es obligatorio.';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      errors.email = 'El correo electrónico es obligatorio.';
    } else if (!emailRegex.test(formData.email)) {
      errors.email = 'Ingresa un correo electrónico válido.';
    }
    if (formData.dni && !formData.dni.match(/^\d{7,11}$/)) {
      errors.dni = 'El DNI debe tener entre 7 y 11 dígitos numéricos.';
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    const dataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value === '' || value === undefined || value === null) return;
      if (typeof value === 'boolean') value = value ? 'true' : 'false';
      dataToSend.append(key, value);
    });

    setInternalLoading(true);
    try {
      const updatedUser = await onSave(user.id, dataToSend);
      if (onSaveSuccess) onSaveSuccess(`Usuario "${updatedUser.username}" actualizado correctamente.`);
    } catch (err) {
      const message = err?.message || 'Error al actualizar el usuario.';
      const fieldErrors = err?.fieldErrors || {};
      setInternalError(message);
      setValidationErrors(fieldErrors);
    } finally {
      setInternalLoading(false);
    }
  }, [formData, onSave, onSaveSuccess, user?.id]);

  const handleRestorePassword = () => setShowPasswordModal(true);
  const handleClosePasswordModal = () => setShowPasswordModal(false);

  const handleSaveNewPassword = async (userId, newPasswordData) => {
    try {
      await onPasswordReset(userId, newPasswordData);
      alert('Contraseña cambiada exitosamente.');
      handleClosePasswordModal();
    } catch (err) {
      alert('Error al cambiar la contraseña.');
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title={`Editar Usuario: ${user?.username || ''}`} position="center">
        <form onSubmit={handleSubmit} encType="multipart/form-data" noValidate>
          {internalError && <ErrorMessage message={internalError} onClose={() => setInternalError('')} />}

          <FormInput
            label="Nombre de usuario"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            error={validationErrors.username}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="Nombre"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              error={validationErrors.name}
            />
            <FormInput
              label="Apellido"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              error={validationErrors.last_name}
            />
          </div>

          <FormInput
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            error={validationErrors.email}
          />

          <FormInput
            label="DNI"
            name="dni"
            value={formData.dni}
            onChange={handleChange}
            required
            error={validationErrors.dni}
          />

          <div className="mb-4">
            <label className="block text-sm font-medium text-text-secondary mb-1">
              Cambiar Imagen
            </label>
            <input
              type="file"
              name="image"
              onChange={handleChange}
              className="mt-1 block w-full"
              accept="image/*"
            />
            {validationErrors.image && (
              <p className="text-red-500 text-xs italic mt-1">
                {Array.isArray(validationErrors.image)
                  ? validationErrors.image.join(', ')
                  : validationErrors.image}
              </p>
            )}
          </div>

          <FormCheckbox
            label="Administrador"
            name="is_staff"
            checked={formData.is_staff}
            onChange={handleChange}
          />
          <div className="flex justify-start mt-4">
            <button
              type="button"
              onClick={handleRestorePassword}
              disabled={internalLoading}
              className="bg-accent-500 text-white py-2 px-4 rounded hover:bg-accent-400 transition-colors disabled:opacity-50"
            >
              Cambiar Contraseña
            </button>
          </div>

          <div className="flex justify-end space-x-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={internalLoading}
              className="bg-neutral-500 text-white py-2 px-4 rounded hover:bg-neutral-600 transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={internalLoading}
              className={`bg-primary-500 text-white py-2 px-4 rounded hover:bg-primary-600 transition-colors ${internalLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {internalLoading ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </Modal>

      {showPasswordModal && (
        <PasswordResetModal
          userId={user.id}
          isOpen={showPasswordModal}
          onClose={handleClosePasswordModal}
          onSave={handleSaveNewPassword}
        />
      )}
    </>
  );
};

export default UserEditModal;
