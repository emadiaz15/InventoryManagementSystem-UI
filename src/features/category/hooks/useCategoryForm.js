import { useState } from 'react';
import { createCategory } from '../services/createCategory';

const useCategoryForm = (onClose) => {
  const [formData, setFormData] = useState({ name: '', description: '' });
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
      await createCategory(formData);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        onClose();
      }, 4000);
    } catch (error) {
      console.error('Error al crear la categoría:', error);
      setError(
        error.response?.data?.name
          ? 'El nombre de la categoría ya existe. Debe ser único.'
          : 'Hubo un problema al crear la categoría. Inténtalo de nuevo.'
      );
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', description: '' });
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

export default useCategoryForm;
