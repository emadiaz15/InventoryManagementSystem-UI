import { useState, useCallback } from 'react';
import { createCategory } from '../services/createCategory';

const useCategoryForm = (onSuccess = () => {}) => {
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  const handleChange = useCallback((e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }, [formData]);

  const resetForm = useCallback(() => {
    setFormData({ name: '', description: '' });
    setError(null);
    setValidationErrors({});
  }, []);

  const handleSubmit = useCallback(async (e) => {
    if (e) e.preventDefault();
    setError(null);
    setValidationErrors({});

    let errors = {};
    if (!formData.name) {
      errors.name = ['El nombre de la categoría es obligatorio.'];
    }
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      throw new Error("Error de validación en el formulario.");
    }

    setLoading(true);
    try {
      const createdCategory = await createCategory(formData);
      onSuccess(createdCategory);
      // El reset se realizará desde el componente padre si es necesario.
      return createdCategory;
    } catch (error) {
      console.error('❌ Error al crear categoría (hook):', error);
      if (error.response?.data && typeof error.response.data === 'object') {
        setValidationErrors(error.response.data);
        setError("Por favor corrige los errores indicados.");
      } else {
        setError(error.message || 'Error al crear la categoría.');
      }
      throw error;
    } finally {
      setLoading(false);
    }
  }, [formData, onSuccess]);

  return { formData, loading, error, validationErrors, handleChange, handleSubmit, resetForm };
};

export default useCategoryForm;
