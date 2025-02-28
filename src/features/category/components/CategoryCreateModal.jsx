import React, { useState } from 'react';
import { createCategory } from '../services/createCategory'; // Servicio de creación de categoría
import SuccessMessage from '../../../components/common/SuccessMessage'; // Mensaje de éxito
import ErrorMessage from '../../../components/common/ErrorMessage'; // Mensaje de error

const CategoryCreateModal = ({ onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
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
        window.location.reload();
      }, 4000);
    } catch (error) {
      console.error('Error al crear la categoría:', error);

      if (error.response && error.response.data && error.response.data.name) {
        setError('El nombre de la categoría ya existe. Debe ser único.');
      } else {
        setError('Hubo un problema al crear la categoría. Inténtalo de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-md w-1/3">
        <h2 className="text-2xl mb-4 text-text-primary">Crear Nueva Categoría</h2>

        {error && <ErrorMessage message={error} shouldReload={false} />}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-text-secondary">Nombre de Categoría</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-text-secondary">Descripción</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
              rows="3"
            />
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-neutral-500 text-white py-2 px-4 rounded hover:bg-neutral-600 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={`bg-primary-500 text-white py-2 px-4 rounded hover:bg-primary-600 transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={loading}
            >
              {loading ? 'Guardando...' : 'Crear Categoría'}
            </button>
          </div>
        </form>

        {showSuccess && (
          <SuccessMessage
            message="¡Categoría creada con éxito!"
            onClose={() => setShowSuccess(false)}
          />
        )}
      </div>
    </div>
  );
};

export default CategoryCreateModal;
