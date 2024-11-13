import React, { useState } from 'react';
import { updateCategory } from '../services/updateCategory'; // Servicio para actualizar categoría

const CategoryEditModal = ({ category, onClose, onSave }) => {
  const [name, setName] = useState(category.name);
  const [description, setDescription] = useState(category.description);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateCategory(category.id, { name, description }); // Actualizar categoría
      onSave(); // Actualizar la lista de categorías en la página principal
      onClose(); // Cerrar el modal
    } catch (error) {
      console.error('Error al actualizar la categoría:', error);
      setError('No se pudo actualizar la categoría.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-md w-1/3">
        <h2 className="text-2xl mb-4">Editar Categoría</h2>
        {error && <p className="text-red-500">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Nombre</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Descripción</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button type="button" className="bg-gray-500 text-white py-2 px-4 rounded" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryEditModal;
