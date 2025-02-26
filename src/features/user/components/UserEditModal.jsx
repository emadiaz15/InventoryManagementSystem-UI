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
    image: null, // Inicialmente null para no enviar nada si no se selecciona archivo
  });
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [error, setError] = useState('');
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
        image: null, // Reseteamos a null al cargar el usuario
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

  // Manejador para el input de archivo
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prevData) => ({
        ...prevData,
        image: e.target.files[0],
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      let dataToSend;
      // Si se seleccionó un archivo para la imagen, usar FormData
      if (formData.image instanceof File) {
        dataToSend = new FormData();
        for (const key in formData) {
          // Agrega todos los campos al FormData
          dataToSend.append(key, formData[key]);
        }
      } else {
        // Si no se seleccionó imagen, omite el campo "image"
        const { image, ...rest } = formData;
        dataToSend = rest;
      }
      // Se llama al onSave con los datos adecuados
      await onSave(user.id, dataToSend);
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
        <form onSubmit={handleSubmit} encType="multipart/form-data">
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

          {/* Campo para seleccionar imagen */}
          <FormInput
            label="Imagen"
            type="file"
            name="image"
            onChange={handleFileChange}
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
              className="bg-primary-500 text-white py-2 px-4 rounded hover:bg-primary-600 transition-colors"
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
