import React, { useState } from 'react';
import useUserForm from '../../hooks/useUserForm';
import FormInput from '../../../../components/ui/form/FormInput';
import FormCheckbox from '../../../../components/ui/form/FormCheckbox';
import ActionButtons from './ActionButtons';
import SuccessMessage from '../../../../components/common/SuccessMessage'; // Importa el componente de mensaje de éxito

const UserRegisterModal = ({ onClose, onSave }) => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  const { formData, handleChange, handleSubmit, loading, error } = useUserForm(async () => {
    handleShowSuccess(); // Mostrar mensaje de éxito después de un registro exitoso
    await onSave(); // Llamar a `onSave` después de un registro exitoso (esto actualizará la lista de usuarios en la página principal)
    onClose(); // Cerrar el modal después de registrar
  });

  const handleShowSuccess = () => {
    setSuccessMessage('¡Usuario registrado con éxito!');
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
    }, 4000); // El mensaje de éxito desaparecerá después de 4 segundos
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-md w-1/2">
        <h2 className="text-2xl mb-4">Registrar Nuevo Usuario</h2>
        <form onSubmit={handleSubmit}>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          
          <FormInput label="Nombre de usuario" name="username" value={formData.username} onChange={handleChange} required />
          <FormInput label="Nombre" name="name" value={formData.name} onChange={handleChange} required />
          <FormInput label="Apellido" name="last_name" value={formData.last_name} onChange={handleChange} required />
          <FormInput label="Email" name="email" type="email" value={formData.email} onChange={handleChange} required />
          <FormInput label="DNI" name="dni" value={formData.dni} onChange={handleChange} required />
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Cargar Imagen</label>
            <input
              type="file"
              name="image"
              onChange={handleChange}
              className="mt-1 block w-full"
              accept="image/*"
            />
          </div>

          <FormCheckbox label="Activo" name="is_active" checked={formData.is_active} onChange={handleChange} />
          <FormCheckbox label="Administrador" name="is_staff" checked={formData.is_staff} onChange={handleChange} />
          
          <FormInput label="Contraseña" name="password" type="password" value={formData.password} onChange={handleChange} required />
          <FormInput label="Confirmar Contraseña" name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} required />

          <ActionButtons onClose={onClose} loading={loading} />
        </form>
      </div>

      {/* Mostrar el mensaje de éxito si está activo */}
      {showSuccess && (
        <SuccessMessage 
          message={successMessage} 
          onClose={() => setShowSuccess(false)} 
        />
      )}
    </div>
  );
};

export default UserRegisterModal;
