import { useState } from 'react';
import { createType } from '../services/createType'; // Importa el servicio para crear tipos

const useTypeForm = (onClose) => {
  const [formData, setFormData] = useState({ name: '', description: '', category: '' }); // Añade category
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await createType(formData); // Llama al servicio para crear tipos
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        onClose();
      }, 4000);
    } catch (error) {
      console.error('Error al crear el tipo:', error);
      setError(
        error.response?.data?.name
          ? 'El nombre del tipo ya existe. Debe ser único.'
          : 'Hubo un problema al crear el tipo. Inténtalo de nuevo.'
      );
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', description: '', category: '' }); // Añade category
    setError('');
    setShowSuccess(false);
  };

  return {
    formData,
    loading,
    error,
    showSuccess,
    handleChange,
    handleSubmit,
    resetForm,
  };
};

export default useTypeForm;