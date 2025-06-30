import React, { useState, useEffect, useCallback, useMemo } from "react";
import Modal from '../../../components/ui/Modal';
import FormInput from '../../../components/ui/form/FormInput';
import FormSelect from '../../../components/ui/form/FormSelect';
import ErrorMessage from '../../../components/common/ErrorMessage';
import logger from '../../../utils/logger';

const TypeCreateModal = ({ isOpen, onClose, onCreate, onCreateSuccess, categories, loadingCategories }) => {
  const initialFormData = useMemo(() => ({
    name: '',
    description: '',
    category: '', // Guarda el ID como string
  }), []);

  const [formData, setFormData] = useState(initialFormData);
  const [internalLoading, setInternalLoading] = useState(false);
  const [internalError, setInternalError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setFormData(initialFormData);
      setInternalError('');
      setInternalLoading(false);
    }
  }, [isOpen, initialFormData]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setInternalError('');

    // Validación: Verificar que se seleccionó una categoría válida
    if (!formData.category || formData.category === '') {
      setInternalError("Por favor, seleccione una categoría válida.");
      return;
    }

    setInternalLoading(true);

    const categoryId = parseInt(formData.category, 10);
    const dataToSend = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      category: categoryId, // Siempre envía un ID numérico válido
    };

    logger.log("Datos a enviar desde TypeCreateModal:", dataToSend);

    try {
      await onCreate(dataToSend);
      if (onCreateSuccess) {
        onCreateSuccess(`Tipo "${dataToSend.name}" creado con éxito.`);
      } else {
        onClose();
      }
    } catch (err) {
      console.error('❌ Error capturado en TypeCreateModal:', err);
      const errorMessage = err.response?.data?.detail || err.message || 'Hubo un problema al crear el tipo.';
      if (typeof err.response?.data === 'object' && err.response.data !== null) {
        const fieldErrors = Object.entries(err.response.data)
          .map(([field, errors]) => `${field}: ${Array.isArray(errors) ? errors.join(', ') : errors}`)
          .join('; ');
        setInternalError(fieldErrors || errorMessage);
      } else {
        setInternalError(errorMessage);
      }
    } finally {
      setInternalLoading(false);
    }
  }, [formData, onCreate, onClose, onCreateSuccess]);

  // Genera opciones para el select (sin placeholder; FormSelect lo muestra por defecto)
  const categoryOptions = useMemo(() => {
    const options = [{ value: "", label: "Seleccione una categoría" }];
    if (Array.isArray(categories)) {
      categories.forEach(cat => {
        options.push({ value: cat.id.toString(), label: cat.name });
      });
    }
    return options;
  }, [categories]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Crear Nuevo Tipo" position="center">
      <form onSubmit={handleSubmit} noValidate>
        {internalError && <ErrorMessage message={internalError} onClose={() => setInternalError('')} />}
        <FormInput
          label="Nombre del Tipo"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          disabled={internalLoading}
        />
        <FormInput
          label="Descripción"
          type="text"
          name="description"
          value={formData.description}
          onChange={handleChange}
          disabled={internalLoading}
        />
        <FormSelect
          label="Categoría"
          name="category"
          value={formData.category}
          onChange={handleChange}
          options={categoryOptions}
          required
          loading={loadingCategories}
          disabled={internalLoading || loadingCategories}
        />
        <div className="flex justify-end space-x-2 mt-4">
          <button
            type="button"
            onClick={onClose}
            disabled={internalLoading}
            className="bg-neutral-500 text-white py-2 px-4 rounded hover:bg-neutral-600 transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className={`bg-primary-500 text-white py-2 px-4 rounded hover:bg-primary-600 transition-colors ${internalLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={internalLoading || loadingCategories}
          >
            {internalLoading ? 'Guardando...' : 'Crear Tipo'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default TypeCreateModal;
