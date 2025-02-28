import { useState } from 'react';
import { registerUser } from '../services/registerUser';

const useUserForm = (onSave, showSuccessPrompt) => {
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    last_name: '',
    email: '',
    dni: '',
    image: null,
    is_active: true,
    is_staff: false,
    password: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

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

    // Reset errores anteriores
    setError(null);
    setValidationErrors({});

    // **📌 Validaciones en el frontend antes de enviar la solicitud**
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

    if (formData.password.length < 4) {
      errors.password = 'La contraseña debe tener al menos 4 caracteres.';
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Las contraseñas no coinciden.';
    }

    // Si hay errores, los mostramos y detenemos el registro
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setLoading(true);

    try {
      let dataToSend = { ...formData };

      // **Si hay imagen, usar FormData**
      if (formData.image instanceof File) {
        const formDataObj = new FormData();
        Object.keys(dataToSend).forEach((key) => {
          formDataObj.append(key, dataToSend[key]);
        });
        dataToSend = formDataObj;
      }

      // **Envío de datos al backend**
      await registerUser(dataToSend);

      if (showSuccessPrompt) {
        showSuccessPrompt('¡Usuario registrado con éxito!');
      }

      // **Reiniciar formulario tras éxito**
      setFormData({
        username: '',
        name: '',
        last_name: '',
        email: '',
        dni: '',
        image: null,
        is_active: true,
        is_staff: false,
        password: '',
        confirmPassword: '',
      });

      onSave();
    } catch (error) {
      console.error('❌ Error al registrar usuario:', error);

      // **Si el backend devuelve errores específicos, los mostramos**
      if (error.response?.data) {
        setValidationErrors(error.response.data);
      } else {
        setError(error.message || 'Error al registrar el usuario.');
      }
    } finally {
      setLoading(false);
    }
  };

  return { formData, handleChange, handleSubmit, loading, error, validationErrors };
};

export default useUserForm;
