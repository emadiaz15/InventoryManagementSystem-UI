import React, { useState, useEffect } from 'react';
import Modal from '../../../components/ui/Modal';
import FormInput from '../../../components/ui/form/FormInput';
import FormCheckbox from '../../../components/ui/form/FormCheckbox';
import SuccessMessage from '../../../components/common/SuccessMessage';
import ErrorMessage from '../../../components/common/ErrorMessage';
import PasswordResetModal from './PasswordResetModal';

const UserEditModal = ({ user, isOpen, onClose, onSave, onPasswordReset }) => {
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    last_name: '',
    email: '',
    dni: '',
    is_active: true,
    is_staff: false,
    image: null, // Se inicia en null
  });

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  // Actualiza el formulario cuando cambia el usuario
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
        image: null, // Se resetea a null para evitar cambios no intencionales
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox'
        ? checked
        : type === 'file'
          ? files[0]
          : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setValidationErrors({});

    // Validaciones en el front antes de enviar
    let errors = {};
    if (!formData.username) {
      errors.username = 'El nombre de usuario es obligatorio.';
    }
    if (!formData.email) {
      errors.email = 'El email es obligatorio.';
    }
    if (!formData.dni.match(/^\d{7,11}$/)) {
      errors.dni = 'El DNI debe tener entre 7 y 11 dígitos numéricos.';
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    try {
      let dataToSend;
      // Si hay una imagen, usar FormData
      if (formData.image instanceof File) {
        dataToSend = new FormData();
        Object.keys(formData).forEach((key) => {
          dataToSend.append(key, formData[key]);
        });
      } else {
        // Si no se seleccionó imagen, omitir ese campo
        const { image, ...rest } = formData;
        dataToSend = rest;
      }

      await onSave(user.id, dataToSend);
      setSuccessMessage('Usuario actualizado con éxito');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('❌ Error al actualizar usuario:', err);

      if (err.response?.data) {
        setValidationErrors(err.response.data); // Mostrar errores específicos del backend
      } else {
        setError(err.message || 'Error al actualizar el usuario.');
      }
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
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          {error && <ErrorMessage message={error} shouldReload={false} />}

          <FormInput
            label="Nombre de usuario"
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            error={validationErrors.username}
          />
          <FormInput
            label="Nombre"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <FormInput
            label="Apellido"
            type="text"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            required
          />
          <FormInput
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            error={validationErrors.email}
          />
          <FormInput
            label="DNI"
            type="text"
            name="dni"
            value={formData.dni}
            onChange={handleChange}
            required
            error={validationErrors.dni}
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

          {/* Campo para seleccionar imagen */}
          <FormInput
            label="Imagen"
            type="file"
            name="image"
            onChange={handleChange}
          />

          {/* Botón para cambiar contraseña */}
          <div className="flex justify-end mt-4">
            <button
              type="button"
              onClick={handleRestorePassword}
              className="bg-warning-500 text-white py-2 px-4 rounded hover:bg-warning-600 transition-colors"
            >
              Cambiar Contraseña
            </button>
          </div>

          {/* Botones de acción */}
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
              className={`bg-primary-500 text-white py-2 px-4 rounded hover:bg-primary-600 transition-colors`}
            >
              Guardar
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
