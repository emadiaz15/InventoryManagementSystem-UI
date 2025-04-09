import React from 'react';
import SuccessMessage from '../../../components/common/SuccessMessage';
import ErrorMessage from '../../../components/common/ErrorMessage';
import Modal from '../../../components/ui/Modal';
import useCategoryForm from '../hooks/useCategoryForm';

const CategoryCreateModal = ({ isOpen, onClose, onCreateSuccess }) => {
  const {
    formData,
    loading,
    error,
    handleChange,
    handleSubmit,
    resetForm,
  } = useCategoryForm();

  if (!isOpen) return null;

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    try {
      await handleSubmit(e);
      // Si handleSubmit tuvo éxito, llama a la prop onCreateSuccess
      if (onCreateSuccess) {
        // Pasamos un mensaje para handleActionSuccess en CategoryList
        onCreateSuccess(`Categoría "${formData.name || 'Nueva'}" creada con éxito.`);
      }
      // Ya no se recarga ni se cierra desde aquí
    } catch (submitError) {
      // El hook ya debería haber puesto el error en el estado 'error'
      // que se muestra con <ErrorMessage />. Solo logueamos extra.
      console.error("Error en submit capturado por handleCreateCategory:", submitError);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Crear Nueva Categoría" position="center">
      {error && <ErrorMessage message={error} />}

      <form onSubmit={handleCreateCategory} aria-describedby="category-form-description">
        <p id="category-form-description" className="sr-only">Formulario para crear una nueva categoría de inventario.</p>

        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-text-secondary mb-1">
            Nombre de Categoría <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            aria-required="true"
            className="mt-1 block w-full border border-neutral-300 rounded-md shadow-sm p-2 bg-background-50 text-text-primary focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
            placeholder="Ej: Cables"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="description" className="block text-sm font-medium text-text-secondary mb-1">
            Descripción
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="mt-1 block w-full border border-neutral-300 rounded-md shadow-sm p-2 bg-background-50 text-text-primary focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
            rows="3"
            placeholder="Ej: Aqui puedes agregar una descripción de la categoría."
          />
        </div>

        <div className="flex justify-end space-x-3 border-t border-neutral-200 pt-4 mt-4">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="bg-neutral-500 text-white py-2 px-4 rounded hover:bg-neutral-600 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className={`bg-primary-500 text-white py-2 px-4 rounded-md hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center`}
            disabled={loading}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Guardando...
              </>
            ) : (
              'Crear Categoría'
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CategoryCreateModal;