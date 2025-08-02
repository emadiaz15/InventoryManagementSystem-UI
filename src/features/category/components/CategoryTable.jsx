// src/features/category/components/CategoryTable.jsx
import React, { useMemo } from "react";
import Table from "@/components/common/Table";
import { PencilIcon, TrashIcon, EyeIcon } from "@heroicons/react/24/outline";

const CategoryTable = ({
    categories,
    openViewModal,
    openEditModal,
    openDeleteConfirmModal,
}) => {
    const tableRows = useMemo(
        () =>
            categories.map((category) => ({
                Nombre: category.name || "N/A",
                Descripción: category.description || "N/A",
                Acciones: (
                    <div className="flex space-x-2">
                        <button
                            onClick={() => openViewModal(category)}
                            className="bg-blue-500 p-2 rounded hover:bg-blue-600 transition-colors"
                            aria-label={`Ver detalles de la categoría ${category.name}`}
                            title="Ver detalles"
                        >
                            <EyeIcon className="w-5 h-5 text-white" />
                        </button>
                        <button
                            onClick={() => openEditModal(category)}
                            className="bg-primary-500 p-2 rounded hover:bg-primary-600 transition-colors"
                            aria-label={`Editar la categoría ${category.name}`}
                            title="Editar"
                        >
                            <PencilIcon className="w-5 h-5 text-white" />
                        </button>
                        <button
                            onClick={() => openDeleteConfirmModal(category)}
                            className="bg-red-500 p-2 rounded hover:bg-red-600 transition-colors"
                            aria-label={`Eliminar la categoría ${category.name}`}
                            title="Eliminar"
                        >
                            <TrashIcon className="w-5 h-5 text-white" />
                        </button>
                    </div>
                ),
            })),
        [categories, openViewModal, openEditModal, openDeleteConfirmModal]
    );

    const headers = ["Nombre", "Descripción", "Acciones"];

    return (
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-2">
            <Table headers={headers} rows={tableRows} />
        </div>
    );
};

export default CategoryTable;
