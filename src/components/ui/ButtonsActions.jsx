import React from 'react';
import { PencilIcon, TrashIcon, PlusCircleIcon } from "@heroicons/react/24/solid";

// Componente para el botón de editar
const EditButton = ({ onClick }) => (
  <button
    onClick={onClick}
    className="bg-primary-500 text-white py-1 px-3 rounded hover:bg-primary-600 flex items-center transition-colors"
    aria-label="Editar usuario"
  >
    <PencilIcon className="h-5 w-5 mr-2" /> Editar
  </button>
);

// Componente para el botón de eliminar
const DeleteButton = ({ onClick }) => (
  <button
    onClick={onClick}
    className="bg-error-500 text-white py-1 px-3 rounded hover:bg-error-600 ml-2 flex items-center transition-colors"
    aria-label="Eliminar usuario"
  >
    <TrashIcon className="h-5 w-5 mr-2" /> Eliminar
  </button>
);

// Componente para el botón de crear
const CreateButton = ({ onClick }) => (
  <button
    onClick={onClick}
    className="bg-success-500 text-white py-1 px-3 rounded hover:bg-success-600 flex items-center transition-colors"
    aria-label="Crear usuario"
  >
    <PlusCircleIcon className="h-5 w-5 mr-2" /> Crear
  </button>
);

// Componente de botones con las tres acciones
const ButtonsActions = ({ onEdit, onDelete, onCreate }) => (
  <div className="flex space-x-2">
    {onEdit && <EditButton onClick={onEdit} />}
    {onDelete && <DeleteButton onClick={onDelete} />}
    {onCreate && <CreateButton onClick={onCreate} />}
  </div>
);

export { ButtonsActions, EditButton, DeleteButton, CreateButton };
