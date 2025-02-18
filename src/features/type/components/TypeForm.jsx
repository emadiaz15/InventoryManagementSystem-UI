// src/components/types/TypeForm.js
import React from 'react';

const TypeForm = ({ formData, onChange, onSubmit, loading, error, submitText, onCancel }) => (
  <form onSubmit={onSubmit}>
    {error && <p className="text-red-500 mb-4">{error}</p>}
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700">Nombre</label>
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={onChange}
        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
        required
      />
    </div>
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700">Descripción</label>
      <textarea
        name="description"
        value={formData.description}
        onChange={onChange}
        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
      />
    </div>
    <div className="flex justify-end space-x-2">
      <button type="button" onClick={onCancel} className="bg-gray-500 text-white py-2 px-4 rounded">
        Cancelar
      </button>
      <button type="submit" disabled={loading} className="bg-blue-500 text-white py-2 px-4 rounded">
        {loading ? 'Guardando...' : submitText}
      </button>
    </div>
  </form>
);

export default TypeForm;
