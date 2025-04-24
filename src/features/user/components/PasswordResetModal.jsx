import React, { useState, useEffect } from 'react';

import Modal from '../../../components/ui/Modal'; // Usa tu Modal base
import FormInput from '../../../components/ui/form/FormInput';
import ErrorMessage from '../../../components/common/ErrorMessage'; // Para mostrar errores

// Recibe userId, isOpen, onClose, y onSave (la función que llama al servicio resetUserPassword)
const PasswordResetModal = ({ userId, isOpen, onClose, onSave }) => {
  // --- Estados Internos ---
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(''); // Para errores generales o de validación simple
  const [loading, setLoading] = useState(false); // NUEVO: Estado de carga

  // Limpiar estado al cerrar (buena práctica)
  useEffect(() => {
    if (!isOpen) {
      setPassword('');
      setConfirmPassword('');
      setError('');
      setLoading(false);
    }
  }, [isOpen]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Limpia errores previos

    // Validación frontend simple
    if (!password || !confirmPassword) {
      setError('Debes ingresar y confirmar la nueva contraseña.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    if (password.length < 8) { // Validación básica de longitud
      setError('La contraseña debe tener al menos 8 caracteres.');
      return;
    }

    setLoading(true); // Inicia estado de carga

    try {
      // Llama a la función onSave (que debería llamar a resetUserPassword)
      // Pasamos ambas contraseñas por si el backend las necesita/valida
      await onSave(userId, { password: password, confirmPassword: confirmPassword });

      // Si onSave tuvo éxito (no lanzó error), cerramos el modal
      // El mensaje de éxito lo puede mostrar el componente padre (UserEditModal)
      onClose();

    } catch (err) {
      // Muestra el error devuelto por el servicio/hook onSave
      setError(err.message || 'Error desconocido al cambiar la contraseña.');
      console.error("Error en onSave de PasswordResetModal:", err);
    } finally {
      setLoading(false); // Termina estado de carga
    }
  };

  // No renderizar si no está abierto
  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Restablecer Contraseña">
      {/* Contenido (children) */}
      <>
        {/* Muestra errores */}
        {error && <ErrorMessage message={error} onClose={() => setError('')} />}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Usamos FormInput si tiene estilos consistentes */}
          <FormInput
            label="Nueva Contraseña"
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading} // Deshabilitar si está cargando
          // Podrías pasar 'error' aquí si tu FormInput lo maneja
          // error={error && error.includes('contraseña') ? error : ''}
          />

          <FormInput
            label="Confirmar Nueva Contraseña"
            type="password"
            name="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            disabled={loading}
            // Podrías pasar 'error' aquí si tu FormInput lo maneja
            error={error && error.includes('coinciden') ? error : ''}
          />

          {/* Botones de Acción */}
          <div className="flex justify-end space-x-2 border-t border-neutral-200 pt-4 mt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading} // Deshabilitar si está cargando
              className="bg-neutral-500 text-white py-2 px-4 rounded hover:bg-neutral-600 transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading} // Deshabilitar si está cargando
              className={`bg-primary-500 text-white py-2 px-4 rounded hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center`} // Añadido justify-center
            >
              {loading ? (
                <>
                  {/* Spinner SVG (opcional) */}
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Guardando...
                </>
              ) : (
                'Guardar Contraseña'
              )
              }
            </button>
          </div>
        </form>
      </>
      {/* Fin Contenido */}
    </Modal>
  );
};

export default PasswordResetModal;
