import React, { useState, useEffect, useCallback } from 'react';
import Modal from '../../../components/ui/Modal';
import FormInput from '../../../components/ui/form/FormInput';
import ErrorMessage from '../../../components/common/ErrorMessage';
import PasswordResetModal from './PasswordResetModal';
import Spinner from '../../../components/ui/Spinner';
import SuccessMessage from '../../../components/common/SuccessMessage';
import { TrashIcon } from '@heroicons/react/24/solid';
import { deleteProfileImage } from '../services/deleteProfileImage';
import { updateProfileImage } from '../services/updateProfileImage';

const UserEditModal = ({
  user,
  isOpen,
  onClose,
  onSave,
  onSaveSuccess,
  onPasswordReset,
  openDeleteConfirmModal,
}) => {
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
  const [hasImage, setHasImage] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');


  useEffect(() => {
    if (isOpen && user) {
      console.log("🧠 [DEBUG] USER OBJ:", user);
      console.log("🧠 [DEBUG] user.image ID:", user.image);
      console.log("🧠 [DEBUG] user.image_url:", user.image_url);

      setFormData({
        username: user.username || '',
        name: user.name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        dni: user.dni || '',
        image: null,
        is_staff: user.is_staff || false,
      });
      setHasImage(!!user?.image_url);
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
    if (name === 'image' && files?.length > 0) {
      setHasImage(false);
    }
  }, []);

  const handleDeleteImage = () => {
    if (!user.image) {
      setInternalError('No se puede eliminar la imagen: ID no encontrado.');
      return;
    }

    openDeleteConfirmModal({
      type: 'delete-image',
      username: user.username,
      onConfirm: async () => {
        try {
          const deletedUser = await deleteProfileImage(user.image, user.id);
          setHasImage(false);
          setFormData((prev) => ({
            ...prev,
            image: null,
          }));

          // 🔁 Actualiza campos locales para que icono delete desaparezca
          user.image = deletedUser.image || '';
          user.image_url = deletedUser.image_url || null;

          setSuccessMessage('Imagen de perfil eliminada correctamente.');
          setTimeout(() => {
            setSuccessMessage('');
            onClose();
          }, 2000);

        } catch (err) {
          setInternalError('No se pudo eliminar la imagen.');
          console.error(err);
        }
      },
    });
  };

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setInternalError('');
    setValidationErrors({});

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const errors = {};
    if (!formData.username.trim()) errors.username = 'El nombre de usuario es obligatorio.';
    if (!formData.name.trim()) errors.name = 'El nombre es obligatorio.';
    if (!formData.last_name.trim()) errors.last_name = 'El apellido es obligatorio.';
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

      // ✅ Intentar reemplazar imagen si hay una nueva y el usuario ya tenía una
      if (formData.image && user.image) {
        try {
          await updateProfileImage(formData.image, user.image, user.id);
          setHasImage(true);
        } catch (imgErr) {
          console.warn('⚠️ Error al actualizar imagen:', imgErr);
          setInternalError('Usuario actualizado, pero falló la imagen.');
        }
      }

      if (onSaveSuccess) onSaveSuccess(`Usuario "${updatedUser.username}" actualizado correctamente.`);
      setSuccessMessage(`Usuario "${updatedUser.username}" actualizado correctamente.`);
      setTimeout(() => {
        setSuccessMessage('');
        onClose();
      }, 2000);
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
      {successMessage && (
        <div className="fixed top-20 right-5 z-[9999]">
          <SuccessMessage message={successMessage} onClose={() => setSuccessMessage('')} />
        </div>
      )}
      <Modal isOpen={isOpen} onClose={onClose} title={`Editar Usuario: ${user?.username || ''}`} position="center">
        <form onSubmit={handleSubmit} encType="multipart/form-data" noValidate>
          {internalError && <ErrorMessage message={internalError} onClose={() => setInternalError('')} />}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center mb-4">
            <FormInput
              label="Nombre de usuario"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              error={validationErrors.username}
            />
            <div className="flex items-center ps-4 border border-background-200 rounded-sm bg-background-100 text-text-primary h-[46px]">
              <input
                id="is_staff"
                type="checkbox"
                name="is_staff"
                checked={formData.is_staff}
                onChange={handleChange}
                className="w-4 h-4 text-primary-500 bg-gray-100 border-gray-300 rounded-sm focus:ring-primary-500 focus:ring-2"
              />
              <label htmlFor="is_staff" className="ms-2 text-sm font-medium">
                Administrador
              </label>
            </div>
          </div>

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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
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
          </div>

          <div className="mb-4 mt-4">
            <label htmlFor="image" className="block mb-2 text-sm font-medium text-text-secondary">
              Imagen de perfil
            </label>
            <div className="flex items-center space-x-4">
              <label
                htmlFor="image"
                className="cursor-pointer bg-background-100 border border-background-200 text-text-primary text-sm rounded-lg px-4 py-2 hover:bg-background-200 transition-colors"
              >
                Seleccionar archivo
              </label>
              {(formData.image || hasImage) && (
                <div className="flex items-center space-x-2 max-w-[220px] truncate">
                  <span className="text-sm text-text-secondary truncate">
                    {formData.image?.name || 'Imagen actual'}
                  </span>
                  <button
                    type="button"
                    onClick={handleDeleteImage}
                    className="bg-red-500 p-2 rounded hover:bg-red-600 transition-colors"
                    aria-label="Eliminar imagen"
                    title="Eliminar Imagen de Perfil"
                  >
                    <TrashIcon className="w-5 h-5 text-white" />
                  </button>
                </div>
              )}
              {!formData.image && !hasImage && (
                <span className="text-sm text-text-secondary">Sin archivo seleccionado</span>
              )}
            </div>
            <input
              id="image"
              name="image"
              type="file"
              accept="image/*"
              onChange={handleChange}
              className="hidden"
            />
            {validationErrors.image && (
              <p className="text-error-500 text-xs italic mt-1">
                {Array.isArray(validationErrors.image)
                  ? validationErrors.image.join(', ')
                  : validationErrors.image}
              </p>
            )}
          </div>

          <div className="flex justify-start mt-4">
            <button
              type="button"
              onClick={handleRestorePassword}
              disabled={internalLoading}
              className="bg-info-500 text-white py-2 px-4 rounded hover:bg-info-600 transition-colors disabled:opacity-50"
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
              className={`bg-primary-500 text-white py-2 px-4 rounded hover:bg-primary-600 transition-colors flex items-center justify-center gap-2 ${internalLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {internalLoading && <Spinner size="4" />}
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
