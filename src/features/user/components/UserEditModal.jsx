import React, { useState, useEffect } from 'react';
import Modal from '../../../components/ui/Modal';
import FormInput from '../../../components/ui/form/FormInput';
import FormCheckbox from '../../../components/ui/form/FormCheckbox';
import ErrorMessage from '../../../components/common/ErrorMessage';
import PasswordResetModal from './PasswordResetModal';
import ActionButtons from './ActionButtons';

// Acepta onSaveSuccess, onSave sigue siendo la función que llama a updateUser
const UserEditModal = ({ user, isOpen, onClose, onSave, onSaveSuccess, onPasswordReset }) => {
  const [formData, setFormData] = useState({
    username: '', name: '', last_name: '', email: '', dni: '',
    is_active: true, is_staff: false, image: null,
  });
  const [loading, setLoading] = useState(false); // Añadido estado de carga interno
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [error, setError] = useState(''); // Error general del submit de este modal
  const [validationErrors, setValidationErrors] = useState({}); // Errores específicos del backend

  // Rellena el form cuando cambia el usuario o se abre el modal
  useEffect(() => {
    if (user && isOpen) {
      setFormData({
        username: user.username || '',
        name: user.name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        dni: user.dni || '',
        is_active: user.is_active !== undefined ? user.is_active : true,
        is_staff: user.is_staff || false,
        image: null, // Resetear imagen en cada apertura
      });
      setError(''); // Limpiar errores anteriores al abrir
      setValidationErrors({});
    }
    if (!isOpen) {
      // Limpiar al cerrar si es necesario (opcional)
      // setTimeout(() => setFormData({...initial state...}), 300);
    }
  }, [user, isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : type === 'file' ? files[0] : value,
    }));
  };

  // Wrapper para el submit
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setValidationErrors({});
    setLoading(true); // Inicia carga

    // Validaciones frontend básicas (opcional, el backend debería validar también)
    let localErrors = {};
    if (!formData.username) localErrors.username = 'Nombre de usuario obligatorio.';
    // ... otras validaciones si quieres ...
    if (Object.keys(localErrors).length > 0) {
      setValidationErrors(localErrors);
      setLoading(false);
      return;
    }

    // Prepara datos para enviar (FormData si hay imagen)
    let dataToSend;
    if (formData.image instanceof File) {
      dataToSend = new FormData();
      // Añade solo campos modificados o todos excepto la imagen null
      Object.keys(formData).forEach((key) => {
        if (key !== 'image' || formData[key] !== null) { // No enviar null para imagen
          dataToSend.append(key, formData[key]);
        }
      });
    } else {
      // Si no hay imagen nueva, envía JSON sin el campo image
      const { image, ...rest } = formData;
      dataToSend = rest;
    }

    try {
      // Llama a la función onSave pasada desde UserList (que llama a updateUser)
      const updatedUser = await onSave(user.id, dataToSend);

      // --- LLAMAR AL HANDLER DEL PADRE ---
      // Si onSave tuvo éxito, llama a onSaveSuccess (que es handleActionSuccess)
      if (onSaveSuccess) {
        onSaveSuccess(`Usuario "${formData.username}" actualizado.`);
      }
      // --- FIN LLAMADA HANDLER ---

      // NO necesitas cerrar aquí, lo hace handleActionSuccess

    } catch (err) {
      console.error('❌ Error al actualizar usuario:', err);
      // Manejo de errores (como estaba, parece razonable)
      if (err.response?.data && typeof err.response.data === 'object') {
        setValidationErrors(err.response.data);
        setError("Por favor corrige los errores."); // Mensaje genérico si hay errores de campo
      } else {
        setError(err.message || 'Error al actualizar el usuario.');
      }
    } finally {
      setLoading(false); // Termina carga
    }
  };

  const handleRestorePassword = () => setShowPasswordModal(true);
  const handleClosePasswordModal = () => setShowPasswordModal(false);
  const handleSaveNewPassword = async (userId, newPasswordData) => {
    try {
      await onPasswordReset(userId, newPasswordData); // Llama a la prop del padre
      alert('Contraseña cambiada exitosamente'); // O usar un SuccessMessage temporal aquí
      handleClosePasswordModal();
    } catch (err) {
      alert('Error al cambiar la contraseña'); // O mostrar error en modal de contraseña
    }
  };

  return (
    <>
      {/* // Usa el componente Modal */}
      <Modal isOpen={isOpen} onClose={onClose} title={`Editar Usuario: ${user?.username || ''}`}>
        {/* Contenido del Modal */}
        <>
          {error && <ErrorMessage message={error} />}
          {/* Mensaje de éxito interno ELIMINADO */}
          {/* {successMessage && <SuccessMessage message={successMessage} onClose={() => setSuccessMessage('')}/>} */}

          <form onSubmit={handleFormSubmit} encType="multipart/form-data">
            {/* Inputs del Formulario (Sin cambios) */}
            <FormInput label="Nombre de usuario" name="username" value={formData.username} onChange={handleChange} required error={validationErrors.username} />
            <FormInput label="Nombre" name="name" value={formData.name} onChange={handleChange} required error={validationErrors.name} />
            <FormInput label="Apellido" name="last_name" value={formData.last_name} onChange={handleChange} required error={validationErrors.last_name} />
            <FormInput label="Email" name="email" type="email" value={formData.email} onChange={handleChange} required error={validationErrors.email} />
            <FormInput label="DNI" name="dni" value={formData.dni} onChange={handleChange} required error={validationErrors.dni} />
            <FormCheckbox label="Activo" name="is_active" checked={formData.is_active} onChange={handleChange} />
            <FormCheckbox label="Administrador" name="is_staff" checked={formData.is_staff} onChange={handleChange} />
            <FormInput label="Cambiar Imagen" type="file" name="image" onChange={handleChange} error={validationErrors.image} />
            {/* Fin Inputs */}

            {/* Botón Cambiar Contraseña */}
            <div className="mt-4">
              <button type="button" onClick={handleRestorePassword} className="text-sm text-blue-600 hover:underline">
                Restablecer Contraseña
              </button>
            </div>

            {/* Botones de Acción */}
            <ActionButtons onClose={onClose} loading={loading} />
          </form>
        </>
        {/* Fin Contenido */}
      </Modal>

      {/* Modal de Contraseña (se mantiene separado) */}
      {showPasswordModal && (
        <PasswordResetModal
          userId={user.id}
          isOpen={showPasswordModal}
          onClose={handleClosePasswordModal}
          onSave={handleSaveNewPassword} // Pasa el handler correcto
        />
      )}
    </>
  );
};

export default UserEditModal;