// src/components/ui/ActionsButtons.jsx
import React from "react";
import { EyeIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

const ActionsButtons = ({ type, onView, onEdit, onDelete }) => {
    return (
        <div className="flex space-x-2">
            {/* 🔍 Botón Ver */}
            <button
                onClick={() => onView(type)}
                className="bg-blue-500 p-2 rounded hover:bg-blue-600 transition-colors"
                aria-label="Ver detalles"
            >
                <EyeIcon className="w-5 h-5 text-white" />
            </button>

            {/* ✏️ Botón Editar */}
            <button
                onClick={() => onEdit(type)}
                className="bg-primary-500 p-2 rounded hover:bg-primary-600 transition-colors"
                aria-label="Editar tipo"
            >
                <PencilIcon className="w-5 h-5 text-white" />
            </button>

            {/* 🗑️ Botón Eliminar */}
            <button
                onClick={() => onDelete(type)}
                className="bg-red-500 p-2 rounded hover:bg-red-600 transition-colors"
                aria-label="Eliminar tipo"
            >
                <TrashIcon className="w-5 h-5 text-white" />
            </button>
        </div>
    );
};

export default ActionsButtons;
