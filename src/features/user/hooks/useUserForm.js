// ============== ARCHIVO REFACTORIZADO: src/hooks/useUserForm.js ==============
import { useState, useCallback } from 'react'; // Quitamos useEffect si no se usa
import { registerUser } from '../services/registerUser'; // Importamos el servicio

// Acepta un callback onSuccess en lugar de onSave y showSuccessPrompt
const useUserForm = (onSuccess = () => {}) => { // Default a función vacía
  const [formData, setFormData] = useState({
    username: '', name: '', last_name: '', email: '', dni: '',
    image: null, is_active: true, is_staff: false, password: '', confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // Para errores generales/API
  const [validationErrors, setValidationErrors] = useState({}); // Para errores de campo

  const handleChange = useCallback((e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : type === 'file' ? files[0] : value,
    }));
  }, []);

  // Función para resetear el formulario
   const resetForm = useCallback(() => {
     setFormData({
       username: '', name: '', last_name: '', email: '', dni: '',
       image: null, is_active: true, is_staff: false, password: '', confirmPassword: '',
     });
     setError(null);
     setValidationErrors({});
   }, []);

  const handleSubmit = useCallback(async (e) => {
    if (e) e.preventDefault(); // Prevenir default si se pasa evento

    setError(null);
    setValidationErrors({});

    // Validaciones frontend (como las tenías)
    let errors = {};
    if (!formData.username) errors.username = 'El nombre de usuario es obligatorio.';
    if (!formData.email) errors.email = 'El email es obligatorio.';
    if (!formData.dni.match(/^\d{7,11}$/)) errors.dni = 'El DNI debe tener entre 7 y 11 dígitos numéricos.';
    if (formData.password.length < 4) errors.password = ['La contraseña debe tener al menos 4 caracteres.']; // Array para consistencia con backend
    if (formData.password !== formData.confirmPassword) errors.confirmPassword = ['Las contraseñas no coinciden.']; // Array

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      throw new Error("Errores de validación en el formulario."); // Lanzar error para que el modal lo sepa
    }

    setLoading(true);

    // Prepara datos para enviar (FormData si hay imagen)
    let dataToSend;
    if (formData.image instanceof File) {
      dataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
          // No enviar confirmPassword al backend
          if (key !== 'confirmPassword') {
              // Convertir booleanos a string 'true'/'false' si el backend lo espera así para FormData
              let value = formData[key];
              if (typeof value === 'boolean') {
                  value = value ? 'true' : 'false';
              }
              dataToSend.append(key, value);
          }
      });
    } else {
      // Enviar JSON si no hay imagen
      const { image, confirmPassword, ...rest } = formData; // Excluir imagen y confirmPassword
      dataToSend = rest;
    }


    try {
      // Envío al backend usando el servicio importado
      const createdUser = await registerUser(dataToSend); // Llama al servicio

      // --- ÉXITO ---
      // Llama al callback onSuccess pasado como prop
      onSuccess(createdUser); // Pasa el usuario creado al callback
      // resetForm(); // El componente padre decidirá si resetear o no después del éxito

      return createdUser; // Devolver usuario por si el caller lo necesita

    } catch (error) {
      console.error('❌ Error al registrar usuario (hook):', error);
      // Manejo de errores (como lo tenías)
      if (error.response?.data && typeof error.response.data === 'object') {
        setValidationErrors(error.response.data);
        setError("Por favor corrige los errores.");
      } else {
        setError(error.message || 'Error al registrar el usuario.');
      }
      throw error; // Relanzar el error para que el componente lo capture
    } finally {
      setLoading(false);
    }
  }, [formData, onSuccess]); // Depende de formData y onSuccess

  // Devolvemos resetForm también
  return { formData, handleChange, handleSubmit, loading, error, validationErrors, resetForm };
};

export default useUserForm;
// ============== FIN useUserForm.js ==============