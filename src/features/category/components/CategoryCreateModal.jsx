import React, { useState } from 'react';
import Modal from '../../../components/ui/Modal';
import ErrorMessage from '../../../components/common/ErrorMessage';
import SuccessMessage from '../../../components/common/SuccessMessage';
import { useCategoriesQuery } from '@/features/category/queries/useCategoriesList';

const CategoryCreateModal = ({ isOpen, onClose, onCreateSuccess }) => {
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const { createMutation } = useCategoriesQuery(); // 🧠 Ya tiene la mutación
  const isLoading = createMutation.isPending;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!formData.name) {
      setFormError('El nombre de la categoría es obligatorio.');
      return;
    }

    try {
      const result = await createMutation.mutateAsync(formData);
      setSuccessMessage(`Categoría "${result.name}" creada con éxito.`);
      onCreateSuccess && onCreateSuccess(`Categoría "${result.name}" creada con éxito.`);
      setTimeout(() => {
        setSuccessMessage('');
        setFormData({ name: '', description: '' });
        onClose();
      }, 2000);
    } catch (err) {
      const msg = err.response?.data?.detail || err.message || 'Error al crear la categoría.';
      setFormError(msg);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Crear Nueva Categoría" position="center">
      {formError && <ErrorMessage message={formError} />}
      {successMessage && <SuccessMessage message={successMessage} />}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium">
            Nombre <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium">
            Descripción
          </label>
          <textarea
            id="description"
            name="description"
            rows="3"
            value={formData.description}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div className="flex justify-end space-x-2 pt-4 border-t">
          <button
            type="button"
            onClick={onClose}
            className="bg-neutral-500 text-white py-2 px-4 rounded hover:bg-neutral-600"
            disabled={isLoading}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="bg-primary-500 text-white py-2 px-4 rounded hover:bg-primary-600 disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? 'Guardando...' : 'Crear Categoría'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CategoryCreateModal;
