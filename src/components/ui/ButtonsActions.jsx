// src/features/product/components/ButtonsActions.jsx
import React from 'react';

const ButtonsActions = ({ onEdit, onDelete }) => (
  <div>
    <button
      className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600"
      onClick={onEdit} // Llama a la función onEdit cuando se hace clic
    >
      Editar
    </button>
    <button
      className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 ml-2"
      onClick={onDelete} // Llama a la función onDelete cuando se hace clic
    >
      Eliminar
    </button>
  </div>
);

export default ButtonsActions;
