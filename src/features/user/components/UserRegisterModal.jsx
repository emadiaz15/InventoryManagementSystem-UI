import React, { useEffect } from 'react';
import useUserForm from '../hooks/useUserForm'; // Hook con la lógica del formulario
import FormInput from '../../../components/ui/form/FormInput';
import FormCheckbox from '../../../components/ui/form/FormCheckbox';
import ActionButtons from './ActionButtons';
import ErrorMessage from '../../../components/common/ErrorMessage';
import Modal from '../../../components/ui/Modal';

const UserRegisterModal = ({ isOpen, onClose, onCreateSuccess }) => {
  // Extraemos la lógica del hook del formulario
  const {
    formData,
    handleChange,
    handleSubmit,
    loading,
    error,
    validationErrors,
    resetForm
  } = useUserForm();

  // Cada vez que el modal se cierra (isOpen=false), reseteamos el formulario
  useEffect(() => {
    if (!isOpen) {
      setTimeout(resetForm, 300);
    }
  }, [isOpen, resetForm]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      // Envía los datos al backend (registerUser). 
      // Si el hook no lanza error, es éxito.
      const createdUser = await handleSubmit(e);

      // Notificamos al padre que un usuario se creó con éxito
      if (onCreateSuccess) {
        // Asumiendo que createdUser trae "username" directo 
        // o lo manejes en useUserForm
        onCreateSuccess(`Usuario "${formData.username}" registrado con éxito.`);
      }

    } catch (submitError) {
      // El hook setea 'error' y 'validationErrors', 
      // se mostrarán si usas <ErrorMessage> o error en cada FormInput
      console.error("Error en submit capturado por UserRegisterModal:", submitError);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Registrar Nuevo Usuario"
      position="center"
    >
      {/* Muestra error general del hook (por ej: Error 500 del servidor) */}
      {error && <ErrorMessage message={error} />}

      <form onSubmit={handleFormSubmit} encType="multipart/form-data">
        <FormInput
          label="Nombre de usuario"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
          error={validationErrors.username}
        />

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
            Cargar Imagen
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
              {validationErrors.image}
            </p>
          )}
        </div>

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
          label="Contraseña"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          required
          error={validationErrors.password}
        />

        <FormInput
          label="Confirmar Contraseña"
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          error={validationErrors.confirmPassword}
        />

        {/* Botones Aceptar / Cancelar */}
        <ActionButtons onClose={onClose} loading={loading} />
      </form>
    </Modal>
  );
};

export default UserRegisterModal;
