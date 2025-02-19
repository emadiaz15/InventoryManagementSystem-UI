import React from 'react';
import { PencilIcon, TrashIcon, PlusCircleIcon } from "@heroicons/react/24/solid"; // Actualización de los íconos

// Componente para el botón de editar
const EditButton = ({ onClick }) => (
  <button
    className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600 flex items-center"
    onClick={onClick} // Llama a la función onEdit cuando se hace clic
  >
    <PencilIcon className="h-5 w-5 mr-2" /> Editar
  </button>
);

// Componente para el botón de eliminar
const DeleteButton = ({ onClick }) => (
  <button
    className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 ml-2 flex items-center"
    onClick={onClick} // Llama a la función onDelete cuando se hace clic
  >
    <TrashIcon className="h-5 w-5 mr-2" /> Eliminar
  </button>
);

// Componente para el botón de crear
const CreateButton = ({ onClick }) => (
  <button
    className="bg-green-500 text-white py-1 px-3 rounded hover:bg-green-600 flex items-center"
    onClick={onClick} // Llama a la función onCreate cuando se hace clic
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
