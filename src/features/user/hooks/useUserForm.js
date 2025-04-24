import { useState, useCallback } from 'react';
import { registerUser } from '../services/registerUser';

const useUserForm = (onSuccess = () => {}) => {
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    last_name: '',
    email: '',
    dni: '',
    image: null,
    is_staff: false,
    password: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  const handleChange = useCallback((e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : type === 'file' ? files[0] : value,
    }));
  }, []);

  const resetForm = useCallback(() => {
    setFormData({
      username: '',
      name: '',
      last_name: '',
      email: '',
      dni: '',
      image: null,
      is_staff: false,
      password: '',
      confirmPassword: '',
    });
    setError(null);
    setValidationErrors({});
  }, []);

  const handleSubmit = useCallback(async (e) => {
    if (e) e.preventDefault();

    setError(null);
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
    if (!formData.dni.match(/^\d{7,11}$/)) {
      errors.dni = 'El DNI debe tener entre 7 y 11 dígitos numéricos.';
    }
    if (!formData.password || formData.password.length < 4) {
      errors.password = ['La contraseña debe tener al menos 4 caracteres.'];
    }
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = ['Las contraseñas no coinciden.'];
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      throw new Error('Errores de validación en el formulario.');
    }

    setLoading(true);

    try {
      const dataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'confirmPassword' || value === '' || value === undefined || value === null) return;
        if (typeof value === 'boolean') value = value ? 'true' : 'false';
        dataToSend.append(key, value);
      });

      const createdUser = await registerUser(dataToSend);
      onSuccess(createdUser);
      return createdUser;
    } catch (error) {
      console.error('❌ Error al registrar usuario (hook):', error);
      if (error.fieldErrors) {
        setValidationErrors(error.fieldErrors);
        setError(error.message);
      } else {
        setError(error.message || 'Error al registrar el usuario.');
      }
      throw error;
    } finally {
      setLoading(false);
    }
  }, [formData, onSuccess]);

  return {
    formData,
    handleChange,
    handleSubmit,
    loading,
    error,
    validationErrors,
    resetForm,
  };
};

export default useUserForm;